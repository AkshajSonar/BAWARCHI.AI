package ngo

import (
	"net/http"
	"strconv"

	"plateai/internal/modules/surplus"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	surplusService *surplus.Service
}

func NewHandler(surplusService *surplus.Service) *Handler {
	return &Handler{
		surplusService: surplusService,
	}
}

// GET /ngo/surplus
// List all available surplus food
func (h *Handler) GetAvailableSurplus(c *gin.Context) {
	events, err := h.surplusService.GetAvailable(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, events)
}

// POST /ngo/surplus/:id/accept
// NGO manually accepts a surplus event
func (h *Handler) AcceptSurplus(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid surplus id"})
		return
	}

	// ⚠️ demo NGO (until auth exists)
	const demoNgoID int64 = 1

	if err := h.surplusService.Accept(
		c.Request.Context(),
		id,
		demoNgoID,
	); err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Surplus pickup reserved successfully",
	})
}
