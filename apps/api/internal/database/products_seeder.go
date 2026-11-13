package database

import (
	"fmt"

	"github.com/brianvoe/gofakeit/v7"
	"gorm.io/gorm"
	"shop3/apps/api/internal/files"
	"shop3/apps/api/internal/models"
)

// SeedProducts tops products up to 40 fake rows. It is what
// "grit seed" runs; "grit seed Product --count N" runs SeedProductsTo with any
// other target.
func SeedProducts(db *gorm.DB) error {
	return SeedProductsTo(db, 40)
}

func init() {
	RegisterSeeder("Product", SeedProductsTo, "products", "products")
}

// SeedProductsTo tops products up to target rows. It counts what is there and
// inserts only the rest, in batches, so running it twice does nothing the second
// time and a run that stopped partway resumes where it stopped. Row i is the
// row's number in the table, which keeps a unique column unique however many
// rows are asked for. Swap the gofakeit calls for your own values.
func SeedProductsTo(db *gorm.DB, target int64) error {
	// Link each row to an existing parent (loaded once).
	var categoryIDs []string
	db.Model(&models.Category{}).Pluck("id", &categoryIDs)
	if len(categoryIDs) == 0 {
		return fmt.Errorf("cannot seed product: no category rows exist yet. Seed Category first (generate it with --faker, or add rows in the admin), then run grit seed again")
	}

	return SeedTopUp(db, "products", SeedPlan[models.Product]{
		Target: target,
		Make: func(n int64) models.Product {
			i := int(n)
			return models.Product{
				Name:           gofakeit.ProductName(),
				Sku:            fmt.Sprintf("SKU-%07d", i+1),
				Description:    gofakeit.Sentence(12),
				Price:          gofakeit.Price(1, 1000),
				CompareAtPrice: gofakeit.Price(1, 1000),
				Stock:          gofakeit.Number(1, 100),
				Images:         files.FileRefs{{URL: "https://picsum.photos/seed/" + gofakeit.UUID() + "/600/400", Name: "sample.jpg", MIME: "image/jpeg"}},
				CategoryID:     pickID(categoryIDs),
				Active:         gofakeit.Bool(),
			}
		},
	})
}
