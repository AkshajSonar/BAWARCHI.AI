package kitchen

import "context"

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) AddEntry(ctx context.Context, e *KitchenEntry) error {
	return s.repo.Create(ctx, e)
}
