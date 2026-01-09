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

	CREATE TABLE IF NOT EXISTS model_training_log (
		id SERIAL PRIMARY KEY,
		last_trained_at TIMESTAMP NOT NULL,
		rows_used INT NOT NULL,
		trigger_reason TEXT
	);

	CREATE TABLE IF NOT EXISTS surplus_events (
		id SERIAL PRIMARY KEY,

		kitchen_entry_id INT NOT NULL
			REFERENCES kitchen_entries(id)
			ON DELETE CASCADE,

		meal_type TEXT NOT NULL,
		dish_name TEXT NOT NULL,
		dish_type TEXT NOT NULL,

		quantity_kg FLOAT NOT NULL,
		expires_at TIMESTAMP NOT NULL,

		status TEXT NOT NULL DEFAULT 'available',
		-- available | reserved | expired

		accepted_by_ngo_id INT NULL,
		created_at TIMESTAMP DEFAULT now()
	);

	CREATE TABLE IF NOT EXISTS ngos (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL,
		email TEXT NOT NULL,
		phone TEXT,
		address TEXT,
		is_active BOOLEAN DEFAULT TRUE,
		created_at TIMESTAMP DEFAULT NOW()
	);

	CREATE TABLE IF NOT EXISTS donation_events (
		id SERIAL PRIMARY KEY,
		date DATE NOT NULL,
		meal_type TEXT NOT NULL,
		dish_name TEXT NOT NULL,
		quantity_kg FLOAT NOT NULL,

		status TEXT NOT NULL DEFAULT 'PENDING',
		-- PENDING | ACCEPTED | COMPLETED

		accepted_by_ngo INT REFERENCES ngos(id),
		created_at TIMESTAMP DEFAULT NOW()
	);
	`

	_, err := db.Exec(context.Background(), query)
	if err != nil {
		log.Fatal("❌ Failed to run DB migrations:", err)
	}

	log.Println("✅ Database schema ready")
}
