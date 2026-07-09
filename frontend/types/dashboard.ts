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
  inference_latency_ms?: number
  sample_support?: number
}

export type MetricSummary = {
  mae: number
  rmse: number
  r2: number
}

export type MLMetrics = {
  train_metrics: MetricSummary
  val_metrics: MetricSummary
  feature_importances: Record<string, number>
  training_duration_seconds: number
  total_training_samples: number
  last_trained_at: string | null
}
