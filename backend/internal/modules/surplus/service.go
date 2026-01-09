package surplus

import (
	"context"
	"time"
)

const (
	SurplusThresholdKg = 15            // minimum leftover (15 kg)
	PickupWindowHours = 2              // food safety window
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) TryCreateSurplus(
	ctx context.Context,
	kitchenEntryID int64,
	mealType, dishName, dishType string,
	leftoverKg float64,
) error {

	if leftoverKg < SurplusThresholdKg {
		return nil // not surplus, silently skip
	}

	event := &SurplusEvent{
		KitchenEntryID: kitchenEntryID,
		MealType:       mealType,
		DishName:       dishName,
		DishType:       dishType,
		QuantityKg:     leftoverKg,
		ExpiresAt:      time.Now().Add(PickupWindowHours * time.Hour),
		Status:         "available",
	}

	return s.repo.Create(ctx, event)
}
func (s *Service) GetAvailable(ctx context.Context) ([]SurplusEvent, error) {
	return s.repo.ListAvailable(ctx)
}

func (s *Service) Accept(
	ctx context.Context,
	surplusID int64,
	ngoID int64,
) error {
	return s.repo.MarkAccepted(ctx, surplusID, ngoID)
}

func (s *Service) GetAllEvents(ctx context.Context) ([]SurplusEvent, error) {
	return s.repo.GetAll(ctx)
}


