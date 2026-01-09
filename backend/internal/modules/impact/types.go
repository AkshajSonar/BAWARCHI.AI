package impact

type ImpactSummary struct {
	FoodSavedKg      float64 `json:"food_saved_kg"`
	MealsSaved       int     `json:"meals_saved"`
	MoneySaved       float64 `json:"money_saved"`
	CO2AvoidedKg     float64 `json:"co2_avoided_kg"`

	WasteTrend       []TrendPoint `json:"waste_trend"`
	AccuracyTrend    []TrendPoint `json:"accuracy_trend"`
	ConsumptionTrend []ConsumptionPoint `json:"consumption_trend"`

	// Redistribution metrics
	FoodRedistributedKg    float64 `json:"food_redistributed_kg"`
	NgosServed             int     `json:"ngos_served"`
	SuccessfulRedistributions int  `json:"successful_redistributions"`
	RedistributionTrend    []RedistributionPoint `json:"redistribution_trend"`
}

type TrendPoint struct {
	Day   string  `json:"day"`
	Value float64 `json:"value"`
}

type ConsumptionPoint struct {
	Dish      string  `json:"dish"`
	Prepared  float64 `json:"prepared"`
	Consumed float64 `json:"consumed"`
}

type RedistributionPoint struct {
	Day         string  `json:"day"`
	QuantityKg  float64 `json:"quantity_kg"`
}
