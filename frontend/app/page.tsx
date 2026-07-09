"use client"

import { useEffect, useState } from "react"
import { MetricCard } from "@/components/dashboard/metric-card"
import { ForecastTable } from "@/components/dashboard/forecast-table"
import { getDishForecast } from "@/lib/api"
import { ForecastResponse } from "@/types/dashboard"
import {
  Users,
  UtensilsCrossed,
  ChefHat,
  Sparkles,
  ArrowUpRight,
  Leaf,
  ShieldCheck,
  Zap,
} from "lucide-react"

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

  const getConfidenceDetails = (conf: string) => {
    switch (conf.toLowerCase()) {
      case "high":
        return {
          icon: ShieldCheck,
          color: "text-emerald-600 bg-emerald-50 border-emerald-100",
          text: "High (Reliable)",
        }
      case "medium":
        return {
          icon: Zap,
          color: "text-amber-600 bg-amber-50 border-amber-100",
          text: "Medium (Stable)",
        }
      default:
        return {
          icon: Sparkles,
          color: "text-rose-600 bg-rose-50 border-rose-100",
          text: "Low (Volatile)",
        }
    }
  }

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Dynamic Eco-Friendly Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative background vector */}
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-12">
          <Leaf className="h-64 w-64" />
        </div>
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Leaf className="h-3 w-3 text-emerald-300" /> Powered by PlateAI
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Zero-Waste Canteen Planner
          </h1>
          <p className="text-emerald-50 text-sm md:text-base leading-relaxed font-light">
            Using machine learning to match kitchen preparation to exact student demand. 
            Preventing over-preparation, reducing landfill emissions, and saving costs.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-800">Today’s Prediction Overview</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Automatic forecast generated for today's Lunch service.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-[20vh] text-slate-400 text-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping mr-2" />
          Analyzing historical canteens and preparing demand forecast...
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm">
          ⚠️ Error loading forecast: {error}
        </div>
      )}

      {forecast && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard 
              title="Total Students" 
              value="1,200" 
              subtitle="Registered dining support"
              icon={Users}
              colorClass="text-blue-600 bg-blue-50"
            />
            <MetricCard
              title="Expected Consumption"
              value={`${forecast.expected_consumption_kg} kg`}
              subtitle="Estimated student consumption"
              icon={UtensilsCrossed}
              colorClass="text-amber-600 bg-amber-50"
            />
            <MetricCard
              title="Recommended Cooking"
              value={`${forecast.recommended_kg} kg`}
              subtitle="Target cooking quantity + risk buffer"
              icon={ChefHat}
              colorClass="text-emerald-600 bg-emerald-50"
            />
            <MetricCard
              title="Confidence"
              value={getConfidenceDetails(forecast.confidence).text}
              subtitle="Data density & CV dispersion"
              icon={getConfidenceDetails(forecast.confidence).icon}
              colorClass={getConfidenceDetails(forecast.confidence).color}
            />
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-700">
                  Dish-wise Forecast Recommendations
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Actionable quantities tailored for canteen operators and chefs.
                </p>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium flex items-center gap-1 font-mono uppercase">
                <ArrowUpRight className="h-3 w-3" /> Live Prediction
              </Badge>
            </div>

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

// Simple Badge fallback inline component
function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none ${className}`}>
      {children}
    </span>
  )
}
