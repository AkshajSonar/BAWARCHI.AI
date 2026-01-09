package impact

import "time"

// KitchenRow represents raw kitchen data used for impact calculations
type KitchenRow struct {
	Date      time.Time
	Dish      string
	Prepared  float64
	Leftover  float64
}

// RedistributionRow represents surplus events that were accepted by NGOs
type RedistributionRow struct {
	Day        string
	QuantityKg float64
	NgoID      *int64
}
