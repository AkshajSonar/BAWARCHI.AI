package db

import (
	"context"
	"log"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func NewPostgresPool(dbURL string) *pgxpool.Pool {
	var pool *pgxpool.Pool
	var err error

	// Automatically append simple protocol query param for PgBouncer compatibility (Supabase transaction pooler)
	if !strings.Contains(dbURL, "default_query_exec_mode") {
		if strings.Contains(dbURL, "?") {
			dbURL += "&default_query_exec_mode=simple_protocol"
		} else {
			dbURL += "?default_query_exec_mode=simple_protocol"
		}
	}

	maxRetries := 10
	retryDelay := 3 * time.Second

	for i := 1; i <= maxRetries; i++ {
		log.Printf("⏳ Connecting to PostgreSQL (attempt %d/%d)...", i, maxRetries)

		pool, err = pgxpool.New(context.Background(), dbURL)
		if err == nil {
			err = pool.Ping(context.Background())
			if err == nil {
				log.Println("✅ Connected to PostgreSQL")
				return pool
			}
		}

		log.Printf("⚠️ DB not ready yet: %v", err)
		time.Sleep(retryDelay)
	}

	log.Fatal("❌ Could not connect to PostgreSQL after retries")
	return nil
}
