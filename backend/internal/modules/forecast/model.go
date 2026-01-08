package forecast

type ForecastRequest struct {
	DayOfWeek     int    `json:"day_of_week"`
	MealType      string `json:"meal_type"`
	DishName      string `json:"dish_name"`
	DishType      string `json:"dish_type"`
	IsSpecial     int    `json:"is_special"`
	IsExamDay     int    `json:"is_exam_day"`
	IsHoliday     int    `json:"is_holiday"`
	IsBreak       int    `json:"is_break"`
	IsEventDay    int    `json:"is_event_day"`
	TotalStudents int    `json:"total_students"`
}

type ForecastResponse struct {
	ExpectedConsumptionKg float64 `json:"expected_consumption_kg"`
	RecommendedKg         float64 `json:"recommended_kg"`
	Confidence            string  `json:"confidence"`
}
