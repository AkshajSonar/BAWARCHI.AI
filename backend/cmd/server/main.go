package main

import (
	"plateai/internal/config"
	"plateai/internal/db"
	"plateai/internal/modules/forecast"
	"plateai/internal/modules/kitchen"
	"plateai/internal/modules/impact"
	"plateai/internal/routes"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	dbPool := db.NewPostgresPool(cfg.DatabaseURL)
	db.RunMigrations(dbPool)

	// Kitchen
	kitchenRepo := kitchen.NewRepository(dbPool)
	kitchenService := kitchen.NewService(kitchenRepo)
	kitchenHandler := kitchen.NewHandler(kitchenService)

	// Forecast (ML)
	forecastService := forecast.NewService(cfg.MLServiceURL)
	forecastHandler := forecast.NewHandler(forecastService, kitchenService)

	// Impact
	impactRepo := impact.NewRepository(dbPool)
	impactService := impact.NewService(impactRepo)
	impactHandler := impact.NewHandler(impactService)

	// r := gin.Default()
	routes.RegisterRoutes(r, kitchenHandler, forecastHandler, impactHandler)

	r.Run(":8080")
}
