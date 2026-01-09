package impact

type ImpactSummary struct {
	FoodSavedKg      float64 `json:"food_saved_kg"`
	MealsSaved       int     `json:"meals_saved"`
	MoneySaved       float64 `json:"money_saved"`
	CO2AvoidedKg     float64 `json:"co2_avoided_kg"`

	WasteTrend       []TrendPoint `json:"waste_trend"`
	AccuracyTrend    []TrendPoint `json:"accuracy_trend"`
	ConsumptionTrend []ConsumptionPoint `json:"consumption_trend"`
}

type TrendPoint struct {
	Day   string  `json:"day"`
	Value float64 `json:"value"`
}

type ConsumptionPoint struct {
	Dish      string  `json:"dish"`
	Prepared  float64 `json:"prepared"`
	Consumed  float64 `json:"consumed"`
}
