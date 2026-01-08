package db

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

func RunMigrations(db *pgxpool.Pool) {
	query := `
	CREATE TABLE IF NOT EXISTS kitchen_entries (
		id SERIAL PRIMARY KEY,
		date DATE NOT NULL,

		meal_type TEXT NOT NULL,
		dish_name TEXT NOT NULL,
		dish_type TEXT NOT NULL,

		is_special INT DEFAULT 0,
		is_exam_day INT DEFAULT 0,
		is_holiday INT DEFAULT 0,
		is_break INT DEFAULT 0,
		is_event_day INT DEFAULT 0,

		total_students INT NOT NULL,

		prepared_qty FLOAT NOT NULL,
		leftover_qty FLOAT DEFAULT 0
	);
	`

	_, err := db.Exec(context.Background(), query)
	if err != nil {
		log.Fatal("❌ Failed to run DB migrations:", err)
	}

	log.Println("✅ Database schema ready")
}
