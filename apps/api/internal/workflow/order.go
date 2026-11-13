package workflow

// OrderWorkflow is the state machine on Order.Status.
//
// Generated from the workflow: block in the resource definition. Edit that and
// regenerate rather than editing here, so the admin, the API and this file
// cannot disagree about which moves are legal.
var OrderWorkflow = Definition{
	Resource: "orders",
	Field:    "status",
	Initial:  "pending",
	States: []State{
		{Name: "pending", Label: "Pending", Colour: "gray"},
		{Name: "paid", Label: "Paid", Colour: "green"},
		{Name: "packed", Label: "Packed", Colour: "gray"},
		{Name: "shipped", Label: "Shipped", Colour: "gray"},
		{Name: "delivered", Label: "Delivered", Colour: "green", Terminal: true},
		{Name: "cancelled", Label: "Cancelled", Colour: "red", Terminal: true},
	},
	Transitions: []Transition{
		{Action: "mark_paid", Label: "Mark paid", From: []string{"pending"}, To: "paid"},
		{Action: "pack", Label: "Pack", From: []string{"paid"}, To: "packed", Permission: "orders.fulfil"},
		{Action: "ship", Label: "Ship", From: []string{"packed"}, To: "shipped", Permission: "orders.fulfil"},
		{Action: "deliver", Label: "Deliver", From: []string{"shipped"}, To: "delivered"},
		{Action: "cancel", Label: "Cancel", From: []string{"pending", "paid", "packed"}, To: "cancelled", Confirm: true},
	},
}

func init() {
	Register(OrderWorkflow)
}
