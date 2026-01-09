package surplus

import "time"

type SurplusEvent struct {
	ID              int64     `json:"id"`
	KitchenEntryID  int64     `json:"kitchen_entry_id"`

	MealType        string    `json:"meal_type"`
	DishName        string    `json:"dish_name"`
	DishType        string    `json:"dish_type"`

	QuantityKg      float64   `json:"quantity_kg"`
	ExpiresAt       time.Time `json:"expires_at"`

	Status          string    `json:"status"`
	AcceptedByNgoID *int64    `json:"accepted_by_ngo_id"`

	CreatedAt       time.Time `json:"created_at"`
}
