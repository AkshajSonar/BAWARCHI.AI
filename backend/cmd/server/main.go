package main

import (
	"time"

	"plateai/internal/config"
	"plateai/internal/db"
	"plateai/internal/routes"

	"plateai/internal/modules/forecast"
	"plateai/internal/modules/impact"
	"plateai/internal/modules/kitchen"
	"plateai/internal/modules/surplus"
	"plateai/internal/modules/donation"
	"plateai/internal/modules/ngo"

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

	// Repos
	trainingRepo := forecast.NewTrainingRepo(dbPool)
	surplusRepo := surplus.NewRepository(dbPool)
	donationRepo := donation.NewRepository(dbPool)
	kitchenRepo := kitchen.NewRepository(dbPool)
	impactRepo := impact.NewRepository(dbPool)

	// Services
	surplusService := surplus.NewService(surplusRepo)
	kitchenService := kitchen.NewService(
		kitchenRepo,
		surplusService,
		donationRepo,
	)
	forecastService := forecast.NewService(cfg.MLServiceURL, trainingRepo)
	impactService := impact.NewService(impactRepo)

	// Handlers
	kitchenHandler := kitchen.NewHandler(kitchenService)
	forecastHandler := forecast.NewHandler(forecastService, kitchenService)
	impactHandler := impact.NewHandler(impactService)

	ngoHandler := ngo.NewHandler(surplusService)

	routes.RegisterRoutes(
		r,
		kitchenHandler,
		forecastHandler,
		impactHandler,
		ngoHandler,
	)

	r.Run(":8080")
}
