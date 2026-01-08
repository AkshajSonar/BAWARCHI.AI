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
func (s *Service) GetTrainingData(ctx context.Context) ([]map[string]interface{}, error) {
	return s.repo.GetTrainingData(ctx)
}
