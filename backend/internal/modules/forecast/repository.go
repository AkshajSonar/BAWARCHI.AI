package forecast

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type TrainingRepo struct {
	db *pgxpool.Pool
}

func NewTrainingRepo(db *pgxpool.Pool) *TrainingRepo {
	return &TrainingRepo{db: db}
}

func (r *TrainingRepo) SaveTrainingLog(
	ctx context.Context,
	rowsUsed int,
	reason string,
) error {
	_, err := r.db.Exec(ctx, `
		INSERT INTO model_training_log (last_trained_at, rows_used, trigger_reason)
		VALUES (now(), $1, $2)
	`, rowsUsed, reason)
	return err
}

func (r *TrainingRepo) GetLastTraining(ctx context.Context) (time.Time, int, error) {
	var t time.Time
	var rows int

	err := r.db.QueryRow(ctx, `
		SELECT last_trained_at, rows_used
		FROM model_training_log
		ORDER BY last_trained_at DESC
		LIMIT 1
	`).Scan(&t, &rows)

	return t, rows, err
}
