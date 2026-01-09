package kitchen

import (
	"context"
	"plateai/internal/modules/donation"
	"plateai/internal/modules/surplus"
)

type Service struct {
	repo *Repository
	surplusService *surplus.Service
	donationRepo   *donation.Repository
}

func NewService(
	repo *Repository,
	surplusService *surplus.Service,
	donationRepo *donation.Repository,
) *Service {
	return &Service{
		repo: repo,
		surplusService: surplusService,
		donationRepo: donationRepo,
	}
}

func (s *Service) AddEntry(ctx context.Context, e *KitchenEntry) error {
	id, err := s.repo.Create(ctx, e)
	if err != nil {
		return err
	}

	e.ID = id

	// Create donation event for NGOs if surplus is significant
	if e.LeftoverQty >= 10 {
		_ = s.donationRepo.Create(
			ctx,
			e.MealType,
			e.DishName,
			e.LeftoverQty,
		)
	}

	return s.surplusService.TryCreateSurplus(
		ctx,
		e.ID,
		e.MealType,
		e.DishName,
		e.DishType,
		e.LeftoverQty,
	)
}



func (s *Service) GetTrainingData(ctx context.Context) ([]map[string]interface{}, error) {
	return s.repo.GetTrainingData(ctx)
}

func (s *Service) CountEntries(ctx context.Context) (int, error) {
	return s.repo.CountEntries(ctx)
}
