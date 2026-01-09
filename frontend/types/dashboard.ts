export type ForecastRequest = {
  day_of_week: number
  meal_type: string
  dish_name: string
  dish_type: string
  is_special: number
  is_exam_day: number
  is_holiday: number
  is_break: number
  is_event_day: number
  total_students: number
}

export type ForecastResponse = {
  expected_consumption_kg: number
  recommended_kg: number
  confidence: "high" | "medium" | "low"
}
