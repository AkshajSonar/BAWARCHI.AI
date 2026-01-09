package donation

import "time"

type DonationEvent struct {
	ID            int64     `json:"id"`
	Date          time.Time `json:"date"`
	MealType      string    `json:"meal_type"`
	DishName      string    `json:"dish_name"`
	QuantityKg    float64   `json:"quantity_kg"`
	Status        string    `json:"status"` // PENDING | ACCEPTED | COMPLETED
	AcceptedByNGO *int64    `json:"accepted_by_ngo"`
	CreatedAt     time.Time `json:"created_at"`
}
