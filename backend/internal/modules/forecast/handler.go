package forecast

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"plateai/internal/modules/kitchen"
)

type Handler struct {
	service        *Service
	kitchenService *kitchen.Service
}

func NewHandler(service *Service, kitchenService *kitchen.Service) *Handler {
	return &Handler{
		service:        service,
		kitchenService: kitchenService,
	}
}

func (h *Handler) GetDishForecast(c *gin.Context) {
	var req ForecastRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.service.Predict(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}

func (h *Handler) RetrainModel(c *gin.Context) {
	data, err := h.kitchenService.GetTrainingData(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.Retrain(data); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "model retrained successfully"})
}
