package impact

import "time"

// KitchenRow represents raw kitchen data used for impact calculations
type KitchenRow struct {
	Date      time.Time
	Dish      string
	Prepared  float64
	Leftover  float64
}
