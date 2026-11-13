package models

import (
	"time"

	"gorm.io/gorm"

	"shop3/apps/api/internal/ids"
)

// Order represents a order in the system.
type Order struct {
	ID              string         `gorm:"primarykey;size:36" json:"id"`
	Number          string         `gorm:"size:255" json:"number" search:"trigram"`
	CustomerName    string         `gorm:"size:255" json:"customer_name" search:"trigram"`
	CustomerEmail   string         `gorm:"size:255" json:"customer_email" search:"trigram"`
	ShippingAddress string         `gorm:"type:text" json:"shipping_address" search:"trigram"`
	Subtotal        float64        `gorm:"type:decimal(12,2)" json:"subtotal"`
	Shipping        float64        `json:"shipping"`
	Total           float64        `gorm:"type:decimal(12,2)" json:"total"`
	PaymentIntent   string         `gorm:"size:255" json:"payment_intent" search:"trigram"`
	TrackingNumber  string         `gorm:"size:255" json:"tracking_number" search:"trigram"`
	Status          string         `gorm:"size:255" json:"status" enum:"pending|paid|packed|shipped|delivered|cancelled"`
	Version         int            `gorm:"not null;default:1" json:"version"`
	CreatedAt       time.Time      `gorm:"index" json:"created_at"`
	UpdatedAt       time.Time      `gorm:"index" json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`
	// ArchivedAt is the "put this away without destroying it" state, and it is
	// deliberately not DeletedAt. A soft delete is invisible to every query and
	// means the row is gone as far as the app is concerned; an archived row is
	// still listable, still exportable and still restorable in one click. The
	// list endpoint hides archived rows unless ?archived=true asks for them.
	ArchivedAt *time.Time `gorm:"index" json:"archived_at,omitempty"`
}

// BeforeCreate generates a UUID before inserting.
func (m *Order) BeforeCreate(tx *gorm.DB) error {
	if m.ID == "" {
		m.ID = ids.New()
	}
	if m.Status == "" {
		m.Status = "pending"
	}
	return nil
}

// BeforeUpdate increments Version so offline clients can detect server-side updates.
func (m *Order) BeforeUpdate(tx *gorm.DB) error {
	tx.Statement.SetColumn("version", gorm.Expr("version + 1"))
	return nil
}
