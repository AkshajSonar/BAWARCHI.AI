package donation

import "context"

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) CreateIfEligible(
	ctx context.Context,
	mealType, dishName string,
	quantity float64,
) error {

	if quantity < 10 {
		return nil
	}

	return s.repo.Create(ctx, mealType, dishName, quantity)
}

func (s *Service) ListPending(ctx context.Context) ([]DonationEvent, error) {
	return s.repo.ListPending(ctx)
}
