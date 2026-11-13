package services

import (
	"time"

	"gorm.io/gorm"

	"shop3/apps/api/internal/sequence"
)

// NextOrderNumber returns the next order identifier (e.g. ORD-202605-0001).
// The counter resets monthly and is generated atomically.
func NextOrderNumber(db *gorm.DB, t time.Time) (string, error) {
	return sequence.Next(db, sequence.Config{
		Name:   "order",
		Prefix: "ORD",
		Reset:  sequence.ResetMonthly,
		Width:  4,
	}, t)
}
