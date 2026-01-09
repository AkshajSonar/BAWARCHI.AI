"use client"

import { useEffect, useState } from "react"
import { MetricCard } from "@/components/dashboard/metric-card"
import { ForecastTable } from "@/components/dashboard/forecast-table"
import { getDishForecast } from "@/lib/api"
import { ForecastResponse } from "@/types/dashboard"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [forecast, setForecast] = useState<ForecastResponse | null>(null)

  useEffect(() => {
    async function loadForecast() {
      try {
        setLoading(true)

        const data = await getDishForecast({
          day_of_week: new Date().getDay(),
          meal_type: "lunch",
          dish_name: "Rice",
          dish_type: "veg",
          is_special: 0,
          is_exam_day: 0,
          is_holiday: 0,
          is_break: 0,
          is_event_day: 0,
          total_students: 1200,
        })

        setForecast(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadForecast()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Today’s Dashboard</h1>

      {loading && <p className="text-slate-500">Loading forecast…</p>}

      {error && (
        <p className="text-red-600">
          Error loading forecast: {error}
        </p>
      )}

      {forecast && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard title="Total Students" value="1200" />
            <MetricCard
              title="Expected Consumption"
              value={`${forecast.expected_consumption_kg} kg`}
            />
            <MetricCard
              title="Recommended Cooking"
              value={`${forecast.recommended_kg} kg`}
            />
            <MetricCard
              title="Confidence"
              value={forecast.confidence.toUpperCase()}
            />
          </div>

          <div className="bg-white rounded-lg p-4 border">
            <h2 className="mb-4 text-lg font-semibold">
              Dish-wise Forecast
            </h2>

            <ForecastTable
              rows={[
                {
                  dish: "Rice",
                  meal: "Lunch",
                  expected: forecast.expected_consumption_kg,
                  recommended: forecast.recommended_kg,
                  confidence: forecast.confidence,
                },
              ]}
            />
          </div>
        </>
      )}
    </div>
  )
}
