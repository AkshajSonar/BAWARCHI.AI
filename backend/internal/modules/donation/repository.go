package donation

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

func (r *Repository) Create(
	ctx context.Context,
	mealType, dishName string,
	quantity float64,
) error {
	_, err := r.db.Exec(ctx, `
		INSERT INTO donation_events
		(date, meal_type, dish_name, quantity_kg)
		VALUES ($1, $2, $3, $4)
	`,
		time.Now(),
		mealType,
		dishName,
		quantity,
	)

	return err
}

func (r *Repository) ListPending(ctx context.Context) ([]DonationEvent, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id, date, meal_type, dish_name, quantity_kg, status, accepted_by_ngo, created_at
		FROM donation_events
		WHERE status = 'PENDING'
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []DonationEvent

	for rows.Next() {
		var d DonationEvent
		err := rows.Scan(
			&d.ID,
			&d.Date,
			&d.MealType,
			&d.DishName,
			&d.QuantityKg,
			&d.Status,
			&d.AcceptedByNGO,
			&d.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		results = append(results, d)
	}

	return results, nil
}
