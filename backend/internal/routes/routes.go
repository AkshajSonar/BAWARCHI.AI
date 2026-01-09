package routes

import (
	"plateai/internal/modules/forecast"
	"plateai/internal/modules/impact"
	"plateai/internal/modules/kitchen"
	"plateai/internal/modules/ngo"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(
	r *gin.Engine,
	kitchenHandler *kitchen.Handler,
	forecastHandler *forecast.Handler,
	impactHandler *impact.Handler,
	ngoHandler *ngo.Handler,
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

	// NGO
	r.GET("/ngo/surplus", ngoHandler.GetAvailableSurplus)
	r.POST("/ngo/surplus/:id/accept", ngoHandler.AcceptSurplus)
}
