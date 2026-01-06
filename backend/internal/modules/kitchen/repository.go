package kitchen

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

func (r *Repository) Create(ctx context.Context, e *KitchenEntry) error {
	query := `
		INSERT INTO kitchen_entries
		(date, dish_name, dish_type, attendance, prepared_qty, leftover_qty)
		VALUES ($1, $2, $3, $4, $5, $6)
	`

	_, err := r.db.Exec(ctx, query,
		e.Date,
		e.DishName,
		e.DishType,
		e.Attendance,
		e.PreparedQty,
		e.LeftoverQty,
	)

	return err
}
