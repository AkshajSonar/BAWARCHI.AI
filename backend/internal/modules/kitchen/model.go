package kitchen

import "time"

type KitchenEntry struct {
	ID          int64     `json:"id"`
	Date        time.Time `json:"date"`
	DishName    string    `json:"dish_name"`
	DishType    string    `json:"dish_type"`
	Attendance  int       `json:"attendance"`
	PreparedQty float64   `json:"prepared_qty"`
	LeftoverQty float64   `json:"leftover_qty"`
}
