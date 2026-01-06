package main

import (
	"plateai/internal/config"
	"plateai/internal/db"
	"plateai/internal/modules/kitchen"
	"plateai/internal/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()

	dbPool := db.NewPostgresPool(cfg.DatabaseURL)

	kitchenRepo := kitchen.NewRepository(dbPool)
	kitchenService := kitchen.NewService(kitchenRepo)
	kitchenHandler := kitchen.NewHandler(kitchenService)

	r := gin.Default()
	routes.RegisterRoutes(r, kitchenHandler)

	r.Run(":8080")
}
