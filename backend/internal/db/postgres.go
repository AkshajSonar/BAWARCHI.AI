package db

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

func NewPostgresPool(dbURL string) *pgxpool.Pool {
	pool, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		log.Fatal("❌ Failed to create DB pool:", err)
	}

	if err := pool.Ping(context.Background()); err != nil {
		log.Fatal("❌ DB ping failed:", err)
	}

	log.Println("✅ Connected to PostgreSQL")
	return pool
}
