package forecast

import (
	"net/http"
	"time"

	"plateai/internal/modules/kitchen"

	"github.com/gin-gonic/gin"
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

// func (h *Handler) RetrainModel(c *gin.Context) {
// 	data, err := h.kitchenService.GetTrainingData(c.Request.Context())
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if err := h.service.Retrain(data); err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

//		c.JSON(http.StatusOK, gin.H{"status": "model retrained successfully"})
//	}
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

	// ✅ log training metadata
	_ = h.service.trainingRepo.SaveTrainingLog(
		c.Request.Context(),
		len(data),
		"manual",
	)

	c.JSON(http.StatusOK, gin.H{
		"status":    "model retrained successfully",
		"rows_used": len(data),
	})
}

func (h *Handler) GetTrainingStatus(c *gin.Context) {
	lastAt, rowsUsed, err := h.service.trainingRepo.GetLastTraining(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"trained": false,
		})
		return
	}

	totalEntries, _ := h.kitchenService.CountEntries(c.Request.Context())
	entriesSince := totalEntries - rowsUsed

	shouldRetrain :=
		entriesSince >= 10 ||
			time.Since(lastAt) > 48*time.Hour

	c.JSON(http.StatusOK, gin.H{
		"last_trained_at":          lastAt,
		"entries_since_last_train": entriesSince,
		"should_retrain":           shouldRetrain,
	})
}
