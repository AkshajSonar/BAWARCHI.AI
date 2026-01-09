export type SurplusEvent = {
  id: number
  kitchen_entry_id: number
  meal_type: string
  dish_name: string
  dish_type: string
  quantity_kg: number
  expires_at: string
  status: "available" | "reserved" | "expired"
  accepted_by_ngo_id?: number | null
  created_at: string
}

export type TrainingStatus = {
  last_trained_at: string
  rows_used: number
  trigger_reason?: string
}
