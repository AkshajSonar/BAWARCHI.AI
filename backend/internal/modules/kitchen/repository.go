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
(date, meal_type, dish_name, dish_type,
 is_special, is_exam_day, is_holiday, is_break, is_event_day,
 total_students, prepared_qty, leftover_qty)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
`

	_, err := r.db.Exec(ctx, query,
		e.Date,
		e.MealType,
		e.DishName,
		e.DishType,
		e.IsSpecial,
		e.IsExamDay,
		e.IsHoliday,
		e.IsBreak,
		e.IsEventDay,
		e.TotalStudents,
		e.PreparedQty,
		e.LeftoverQty,
	)

	return err
}
func (r *Repository) GetTrainingData(ctx context.Context) ([]map[string]interface{}, error) {
	query := `
		SELECT
			EXTRACT(DOW FROM date)::INT AS day_of_week,
			meal_type,
			dish_name,
			dish_type,
			is_special,
			is_exam_day,
			is_holiday,
			is_break,
			is_event_day,
			total_students,
			prepared_qty,
			leftover_qty
		FROM kitchen_entries
	`

	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var data []map[string]interface{}

	for rows.Next() {
		var (
			dayOfWeek      int
			mealType       string
			dishName       string
			dishType       string
			isSpecial      int
			isExamDay      int
			isHoliday      int
			isBreak        int
			isEventDay     int
			totalStudents  int
			preparedKg     float64
			leftoverKg     float64
		)

		err := rows.Scan(
			&dayOfWeek,
			&mealType,
			&dishName,
			&dishType,
			&isSpecial,
			&isExamDay,
			&isHoliday,
			&isBreak,
			&isEventDay,
			&totalStudents,
			&preparedKg,
			&leftoverKg,
		)
		if err != nil {
			return nil, err
		}

		row := map[string]interface{}{
			"day_of_week":     dayOfWeek,
			"meal_type":       mealType,
			"dish_name":       dishName,
			"dish_type":       dishType,
			"is_special":      isSpecial,
			"is_exam_day":     isExamDay,
			"is_holiday":      isHoliday,
			"is_break":        isBreak,
			"is_event_day":    isEventDay,
			"total_students":  totalStudents,
			"prepared_kg":     preparedKg,
			"leftover_kg":     leftoverKg,
		}

		data = append(data, row)
	}

	return data, nil
}


