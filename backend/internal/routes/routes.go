package routes

import (
	"plateai/internal/modules/forecast"
	"plateai/internal/modules/kitchen"
	"plateai/internal/modules/impact"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(
	r *gin.Engine,
	kitchenHandler *kitchen.Handler,
	forecastHandler *forecast.Handler,
	impactHandler *impact.Handler,
) {
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	r.POST("/kitchen/entry", kitchenHandler.AddEntry)
	r.GET("/impact/summary", impactHandler.GetImpact)

	// Forecast routes
	r.POST("/forecast/dish", forecastHandler.GetDishForecast)
	r.POST("/forecast/retrain", forecastHandler.RetrainModel) // ✅ THIS WAS MISSING
}
