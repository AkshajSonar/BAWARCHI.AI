package routes

import (
	"plateai/internal/modules/kitchen"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, kitchenHandler *kitchen.Handler) {
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	r.POST("/kitchen/entry", kitchenHandler.AddEntry)
}
