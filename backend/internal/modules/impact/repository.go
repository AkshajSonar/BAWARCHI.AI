package impact

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

func (r *Repository) FetchImpactData(ctx context.Context) ([]KitchenRow, error) {
	rows, err := r.db.Query(ctx, `
		SELECT date, dish_name, prepared_qty, leftover_qty
		FROM kitchen_entries
		ORDER BY date
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []KitchenRow

	for rows.Next() {
		var r KitchenRow
		err := rows.Scan(&r.Date, &r.Dish, &r.Prepared, &r.Leftover)
		if err != nil {
			return nil, err
		}
		result = append(result, r)
	}

	return result, nil
}
