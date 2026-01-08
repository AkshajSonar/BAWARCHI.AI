package routes

import (
	"plateai/internal/modules/forecast"
	"plateai/internal/modules/kitchen"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(
	r *gin.Engine,
	kitchenHandler *kitchen.Handler,
	forecastHandler *forecast.Handler,
) {
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	r.POST("/kitchen/entry", kitchenHandler.AddEntry)

	// Forecast routes
	r.POST("/forecast/dish", forecastHandler.GetDishForecast)
	r.POST("/forecast/retrain", forecastHandler.RetrainModel) // ✅ THIS WAS MISSING
}
