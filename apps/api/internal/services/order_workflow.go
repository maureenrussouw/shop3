package services

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"shop3/apps/api/internal/events"
	"shop3/apps/api/internal/models"
	"shop3/apps/api/internal/workflow"
)

// TransitionOrder moves one order through its workflow.
//
// Returns the updated record, or an error describing why the move is not
// legal. The caller turns that into a 422: an invalid transition is the user
// asking for something the process does not allow, not a server fault.
//
// Permission is checked here as well as on the route, because the route is
// one of several ways in.
func TransitionOrder(db *gorm.DB, c *gin.Context, id, action string, can func(string) bool) (*models.Order, error) {
	var item models.Order
	if err := db.First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}

	from := item.Status
	transition, err := workflow.OrderWorkflow.Check(from, action)
	if err != nil {
		return nil, err
	}
	if transition.Permission != "" && can != nil && !can(transition.Permission) {
		return nil, workflow.ErrNotPermitted{
			Resource: "orders", Action: action, Label: transition.Label, Noun: "order",
		}
	}

	// The status change, the hooks and the durable copy of the event commit
	// together or not at all. A hook that reserves stock and then finds the
	// budget short takes the reservation back out with the approval.
	var ev events.Event
	err = db.Transaction(func(tx *gorm.DB) error {
		// Guarded by the current state as well as the id. Two people pressing
		// Send at the same moment would otherwise both pass the check above and
		// both write; this makes the second one affect no rows, before any hook
		// has run for it.
		result := tx.Model(&models.Order{}).
			Where("id = ? AND status = ?", id, from).
			Update("status", transition.To)
		if result.Error != nil {
			return result.Error
		}
		if result.RowsAffected == 0 {
			return workflow.ErrInvalidTransition{
				Resource: "orders",
				From:     from,
				Action:   action,
				Allowed:  actionsFrom(workflow.OrderWorkflow, from),
			}
		}
		if err := tx.First(&item, "id = ?", id).Error; err != nil {
			return err
		}

		// Hooks registered with workflow.OnTransition do the rest of the move's
		// work here, in this transaction, and can refuse it.
		if err := workflow.RunHooks(tx, workflow.Move{
			Resource: "orders", Action: action, From: from, To: transition.To,
			ID: item.ID, Record: &item, C: c,
		}); err != nil {
			return err
		}

		// The transition is its own event, not an "updated". A subscriber that
		// cares about invoices being paid should not have to diff two versions
		// of a record to find out that is what happened. Durable subscribers
		// get it in this transaction, so it reaches them if and only if the
		// move commits.
		ev = events.Event{
			Name:     "orders." + action,
			Resource: "orders",
			Entity:   "Order",
			ID:       item.ID,
			Label:    item.Number,
			Detail:   fmt.Sprintf("%s: %s to %s", transition.Label, from, transition.To),
			Before:   map[string]interface{}{"status": from},
			After:    item,
		}
		return events.EmitTx(tx, c, &ev)
	})
	if err != nil {
		return nil, err
	}

	// The activity feed, realtime and webhooks hear about it once it has
	// committed.
	events.Emit(c, ev)
	return &item, nil
}

// actionsFrom lists the actions legal from a state, for an error message that
// tells the caller what they could have done instead.
func actionsFrom(d workflow.Definition, from string) []string {
	var out []string
	for _, t := range d.Next(from) {
		out = append(out, t.Action)
	}
	return out
}
