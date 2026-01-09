package surplus

import (
	"context"
	"errors"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

func (r *Repository) Create(ctx context.Context, e *SurplusEvent) error {
	query := `
		INSERT INTO surplus_events
		(kitchen_entry_id, meal_type, dish_name, dish_type, quantity_kg, expires_at)
		VALUES ($1, $2, $3, $4, $5, $6)
	`

	_, err := r.db.Exec(ctx, query,
		e.KitchenEntryID,
		e.MealType,
		e.DishName,
		e.DishType,
		e.QuantityKg,
		e.ExpiresAt,
	)

	return err
}
func (r *Repository) ListAvailable(ctx context.Context) ([]SurplusEvent, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id, kitchen_entry_id, meal_type, dish_name, dish_type,
		       quantity_kg, expires_at, status, accepted_by_ngo_id, created_at
		FROM surplus_events
		WHERE status = 'available'
		  AND expires_at > now()
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []SurplusEvent
	for rows.Next() {
		var e SurplusEvent
		err := rows.Scan(
			&e.ID,
			&e.KitchenEntryID,
			&e.MealType,
			&e.DishName,
			&e.DishType,
			&e.QuantityKg,
			&e.ExpiresAt,
			&e.Status,
			&e.AcceptedByNgoID,
			&e.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		result = append(result, e)
	}
	return result, nil
}

func (r *Repository) MarkAccepted(
	ctx context.Context,
	surplusID int64,
	ngoID int64,
) error {
	cmd, err := r.db.Exec(ctx, `
		UPDATE surplus_events
		SET status = 'reserved',
		    accepted_by_ngo_id = $1
		WHERE id = $2
		  AND status = 'available'
	`, ngoID, surplusID)

	if err != nil {
		return err
	}
	if cmd.RowsAffected() == 0 {
		return errors.New("surplus already claimed or expired")
	}
	return nil
}


