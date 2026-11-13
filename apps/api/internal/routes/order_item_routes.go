package routes

import (
	"shop3/apps/api/internal/handlers"
	"shop3/apps/api/internal/middleware"
)

// OrderItems routes.
//
// This is the whole surface for order_items: the handler, and every path that
// reaches it. Add a route by adding a line here. Remove the resource by
// deleting this file; nothing else refers to it.
//
// m.Public is outside the auth middleware and behind an API key, m.Protected
// takes a JWT or an API key, and m.Staff also requires the permission its
// route names (an ADMIN holds every one).
func init() {
	RegisterRoutes(func(m *Mount) {
		h := &handlers.OrderItemHandler{
			DB:      m.DB,
			AppName: m.Cfg.AppName,
		}

		m.Staff.GET("/order_items", middleware.RequireRole("ADMIN", "perm:order_items.view"), h.List)
		m.Staff.GET("/order_items/export", middleware.RequireRole("ADMIN", "perm:order_items.view"), h.Export)
		m.Staff.POST("/order_items/import", middleware.RequireRole("ADMIN", "perm:order_items.create"), h.Import)
		m.Staff.GET("/order_items/import/template", middleware.RequireRole("ADMIN", "perm:order_items.view"), h.Template)
		m.Staff.GET("/order_items/:id", middleware.RequireRole("ADMIN", "perm:order_items.view"), h.GetByID)
		m.Staff.GET("/order_items/:id/pdf", middleware.RequireRole("ADMIN", "perm:order_items.view"), h.PDF)
		m.Staff.POST("/order_items", middleware.RequireRole("ADMIN", "perm:order_items.create"), h.Create)
		m.Staff.POST("/order_items/bulk-create", middleware.RequireRole("ADMIN", "perm:order_items.create"), h.BulkCreate)
		m.Staff.PUT("/order_items/:id", middleware.RequireRole("ADMIN", "perm:order_items.edit"), h.Update)
		m.Staff.PATCH("/order_items/:id", middleware.RequireRole("ADMIN", "perm:order_items.edit"), h.Patch)
		m.Staff.POST("/order_items/bulk-edit", middleware.RequireRole("ADMIN", "perm:order_items.edit"), h.BulkEdit)

		m.Staff.DELETE("/order_items/:id", middleware.RequireRole("ADMIN", "perm:order_items.delete"), h.Delete)
		m.Staff.POST("/order_items/bulk", middleware.RequireRole("ADMIN", "perm:order_items.delete"), h.Bulk)
	})
}
