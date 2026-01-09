package impact

import "context"

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

// func (s *Service) GetSummary(ctx context.Context) (*ImpactSummary, error) {
// 	rows, err := s.repo.FetchImpactData(ctx)
// 	if err != nil {
// 		return nil, err
// 	}

// 	var totalLeftover float64
// 	var totalConsumed float64

// 	for _, r := range rows {
// 		consumed := r.Prepared - r.Leftover
// 		totalConsumed += consumed
// 		totalLeftover += r.Leftover
// 	}

// 	foodSaved := totalConsumed * 0.15 // conservative baseline
// 	mealsSaved := int(foodSaved / 0.25)
// 	moneySaved := foodSaved * 150
// 	co2 := foodSaved * 2.3

// 	return &ImpactSummary{
// 		FoodSavedKg:  foodSaved,
// 		MealsSaved:  mealsSaved,
// 		MoneySaved:  moneySaved,
// 		CO2AvoidedKg: co2,
// 	}, nil
// }
func (s *Service) GetSummary(ctx context.Context) (*ImpactSummary, error) {
	rows, err := s.repo.FetchImpactData(ctx)
	if err != nil {
		return nil, err
	}
	
	// Fetch redistribution data
	redistRows, redistErr := s.repo.FetchRedistributionData(ctx)
	if redistErr != nil {
		// If redistribution data fails, continue without it
		redistRows = []RedistributionRow{}
	}

	if len(rows) == 0 {
		return &ImpactSummary{
			FoodSavedKg:        0,
			MealsSaved:         0,
			MoneySaved:         0,
			CO2AvoidedKg:       0,
			WasteTrend:         []TrendPoint{},
			ConsumptionTrend:  []ConsumptionPoint{},
			AccuracyTrend:     []TrendPoint{},
			FoodRedistributedKg:    0,
			NgosServed:             0,
			SuccessfulRedistributions: 0,
			RedistributionTrend:    []RedistributionPoint{},
		}, nil
	}
	var totalConsumed float64
	var totalLeftover float64

	wasteTrendMap := map[string]float64{}
	consumptionMap := map[string]*ConsumptionPoint{}

	for _, r := range rows {
		consumed := r.Prepared - r.Leftover
		totalConsumed += consumed
		totalLeftover += r.Leftover

		day := r.Date.Format("2006-01-02")
		wasteTrendMap[day] += r.Leftover

		if _, ok := consumptionMap[r.Dish]; !ok {
			consumptionMap[r.Dish] = &ConsumptionPoint{
				Dish: r.Dish,
			}
		}
		consumptionMap[r.Dish].Prepared += r.Prepared
		consumptionMap[r.Dish].Consumed += consumed
	}

	// Convert maps → slices
	wasteTrend := make([]TrendPoint, 0)
	for day, value := range wasteTrendMap {
		wasteTrend = append(wasteTrend, TrendPoint{
			Day: day,
			Value: value,
		})
	}

	consumptionTrend := make([]ConsumptionPoint, 0)
	for _, v := range consumptionMap {
		consumptionTrend = append(consumptionTrend, *v)
	}

	// Calculate redistribution metrics
	var totalRedistributed float64
	redistTrendMap := map[string]float64{}
	ngoSet := map[int64]bool{}
	successfulRedistributions := 0

	for _, r := range redistRows {
		totalRedistributed += r.QuantityKg
		redistTrendMap[r.Day] += r.QuantityKg
		if r.NgoID != nil {
			ngoSet[*r.NgoID] = true
			successfulRedistributions++
		}
	}

	redistTrend := make([]RedistributionPoint, 0)
	for day, quantity := range redistTrendMap {
		redistTrend = append(redistTrend, RedistributionPoint{
			Day:        day,
			QuantityKg: quantity,
		})
	}

	foodSaved := totalConsumed * 0.15
	mealsSaved := int(foodSaved / 0.25)

	return &ImpactSummary{
		FoodSavedKg:        foodSaved,
		MealsSaved:         mealsSaved,
		MoneySaved:         foodSaved * 150,
		CO2AvoidedKg:       foodSaved * 2.3,
		WasteTrend:         wasteTrend,
		ConsumptionTrend:  consumptionTrend,
		FoodRedistributedKg:    totalRedistributed,
		NgosServed:             len(ngoSet),
		SuccessfulRedistributions: successfulRedistributions,
		RedistributionTrend:    redistTrend,
	}, nil
}
