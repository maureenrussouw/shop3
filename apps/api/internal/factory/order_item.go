package factory

import (
	"fmt"
	"testing"

	"gorm.io/gorm"

	"shop3/apps/api/internal/models"
)

// NewOrderItem builds a valid OrderItem without saving it.
//
// Every call produces different values for the unique fields, so two rows made
// in the same test do not collide.
//
// ProductID and OrderID is left empty here. CreateOrderItem fills it with a fresh parent when
// nothing else has, because the column is a string rather than a pointer: its
// zero value is the empty string, not NULL, and no parent row has that id.
// To attach it to one you already have, pass it in and the override wins:
//
//	orderItem := factory.CreateOrderItem(t, db, func(m *models.OrderItem) {
//		m.ProductID = parent.ID
//	})
func NewOrderItem(overrides ...func(*models.OrderItem)) *models.OrderItem {
	n := next()

	record := &models.OrderItem{
		ProductName: fmt.Sprintf("OrderItem %d", n),
		Quantity:    n,
		UnitPrice:   float64(n) + 0.5,
		LineTotal:   float64(n) + 0.5,
	}

	for _, apply := range overrides {
		apply(record)
	}
	return record
}

// CreateOrderItem builds one and writes it, failing the test if it will not save.
//
// Failing here rather than returning an error is deliberate: a fixture that
// cannot be created is not a test failure to be asserted on, it is a broken
// test, and the stack should point at the line that asked for it.
func CreateOrderItem(tb testing.TB, db *gorm.DB, overrides ...func(*models.OrderItem)) *models.OrderItem {
	tb.Helper()
	record := NewOrderItem(overrides...)
	if record.ProductID == "" {
		record.ProductID = CreateProduct(tb, db).ID
	}
	if err := db.Create(record).Error; err != nil {
		tb.Fatalf("creating a orderitem fixture: %v", err)
	}
	return record
}

// CreateOrderItems writes n of them, for a test about paging or sorting.
func CreateOrderItems(tb testing.TB, db *gorm.DB, n int, overrides ...func(*models.OrderItem)) []*models.OrderItem {
	tb.Helper()
	out := make([]*models.OrderItem, 0, n)
	for i := 0; i < n; i++ {
		out = append(out, CreateOrderItem(tb, db, overrides...))
	}
	return out
}
