package routes

import (
	"plateai/internal/modules/forecast"
	"plateai/internal/modules/impact"
	"plateai/internal/modules/kitchen"
	"plateai/internal/modules/ngo"
	"plateai/internal/modules/surplus"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(
	r *gin.Engine,
	kitchenHandler *kitchen.Handler,
	forecastHandler *forecast.Handler,
	impactHandler *impact.Handler,
	ngoHandler *ngo.Handler,
	surplusHandler *surplus.Handler,
) {
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Kitchen
	r.POST("/kitchen/entry", kitchenHandler.AddEntry)

	// Impact
	r.GET("/impact/summary", impactHandler.GetImpact)

	// Forecast
	r.POST("/forecast/dish", forecastHandler.GetDishForecast)
	r.POST("/forecast/retrain", forecastHandler.RetrainModel)
	r.GET("/forecast/status", forecastHandler.GetTrainingStatus)

	// NGO routes
	ngo := r.Group("/ngos")
	{
		ngo.GET("/surplus/available", ngoHandler.GetAvailableSurplus)
		ngo.POST("/surplus/:id/accept", ngoHandler.AcceptSurplus)
	}

	// Surplus events route (for kitchen/admin view)
	r.GET("/surplus/events", surplusHandler.GetAllEvents)
}
