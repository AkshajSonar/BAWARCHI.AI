package kitchen

import "time"

type KitchenEntry struct {
	ID            int64     `json:"id"`
	Date          time.Time `json:"date"`

	MealType      string `json:"meal_type"`
	DishName      string `json:"dish_name"`
	DishType      string `json:"dish_type"`

	IsSpecial     int `json:"is_special"`
	IsExamDay     int `json:"is_exam_day"`
	IsHoliday     int `json:"is_holiday"`
	IsBreak       int `json:"is_break"`
	IsEventDay    int `json:"is_event_day"`

	TotalStudents int `json:"total_students"`

	PreparedQty   float64 `json:"prepared_qty"`
	LeftoverQty   float64 `json:"leftover_qty"`
}
