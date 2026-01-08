package main

import (
	"plateai/internal/config"
	"plateai/internal/db"
	"plateai/internal/modules/forecast"
	"plateai/internal/modules/kitchen"
	"plateai/internal/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()

	dbPool := db.NewPostgresPool(cfg.DatabaseURL)
	db.RunMigrations(dbPool)

	// Kitchen
	kitchenRepo := kitchen.NewRepository(dbPool)
	kitchenService := kitchen.NewService(kitchenRepo)
	kitchenHandler := kitchen.NewHandler(kitchenService)

	// Forecast (ML)
	forecastService := forecast.NewService(cfg.MLServiceURL)
	forecastHandler := forecast.NewHandler(forecastService, kitchenService)

	r := gin.Default()
	routes.RegisterRoutes(r, kitchenHandler, forecastHandler)

	r.Run(":8080")
}
