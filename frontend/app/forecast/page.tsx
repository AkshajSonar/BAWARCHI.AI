"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { getDishForecast } from "@/lib/api"
import { ConfidenceBadge } from "@/components/dashboard/confidence-badge"
import { ForecastResponse } from "@/types/dashboard"

export default function ForecastPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ForecastResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    meal_type: "lunch",
    dish_name: "",
    dish_type: "veg",
    total_students: 1200,
    is_special: false,
    is_exam_day: false,
    is_holiday: false,
    is_break: false,
    is_event_day: false,
  })

  async function handleSubmit() {
    setError(null)
    setResult(null)
    setLoading(true)

    try {
      const response = await getDishForecast({
        day_of_week: new Date().getDay(),
        meal_type: form.meal_type,
        dish_name: form.dish_name,
        dish_type: form.dish_type,
        total_students: form.total_students,
        is_special: form.is_special ? 1 : 0,
        is_exam_day: form.is_exam_day ? 1 : 0,
        is_holiday: form.is_holiday ? 1 : 0,
        is_break: form.is_break ? 1 : 0,
        is_event_day: form.is_event_day ? 1 : 0,
      })

      setResult(response)
    } catch (err: any) {
      setError(err.message || "Failed to fetch forecast")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold">Meal Forecast</h1>
        <p className="text-slate-600">
          Provide meal context to get accurate AI predictions.
        </p>
      </div>

      {/* Forecast Form */}
      <Card>
        <CardHeader>
          <CardTitle>Meal Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {/* Meal Type */}
          <div>
            <Label>Meal Type</Label>
            <Select
              value={form.meal_type}
              onValueChange={(v) => setForm({ ...form, meal_type: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dish Name */}
          <div>
            <Label>Dish Name</Label>
            <Input
              placeholder="e.g. Rice"
              value={form.dish_name}
              onChange={(e) =>
                setForm({ ...form, dish_name: e.target.value })
              }
            />
          </div>

          {/* Dish Type */}
          <div>
            <Label>Dish Type</Label>
            <Select
              value={form.dish_type}
              onValueChange={(v) => setForm({ ...form, dish_type: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="veg">Veg</SelectItem>
                <SelectItem value="egg">Egg</SelectItem>
                <SelectItem value="nonveg">Non‑Veg</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Students */}
          <div>
            <Label>Total Students</Label>
            <Input
              type="number"
              value={form.total_students}
              onChange={(e) =>
                setForm({ ...form, total_students: Number(e.target.value) })
              }
            />
          </div>

          {/* Special Dish */}
          <div className="flex items-center gap-2">
            <Switch
              checked={form.is_special}
              onCheckedChange={(v) =>
                setForm({ ...form, is_special: v })
              }
            />
            <Label>Special Dish</Label>
          </div>

          {/* Context Flags */}
          <div className="space-y-2">
            {[
              ["Exam Day", "is_exam_day"],
              ["Holiday", "is_holiday"],
              ["Break", "is_break"],
              ["Event Day", "is_event_day"],
            ].map(([label, key]) => (
              <div key={key} className="flex items-center gap-2">
                <Checkbox
                  checked={(form as any)[key]}
                  onCheckedChange={(v) =>
                    setForm({ ...form, [key]: Boolean(v) })
                  }
                />
                <Label>{label}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Predicting…" : "Generate Forecast"}
      </Button>

      {/* Result */}
      {error && <p className="text-red-600">{error}</p>}

      {result && (
        <Card className="border-emerald-100 bg-gradient-to-r from-emerald-50/50 via-white to-emerald-50/20 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
          <CardHeader className="pb-3">
            <CardTitle className="text-slate-800 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-emerald-500 fill-emerald-500/10" />
              AI Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Expected Consumption</p>
                <p className="text-2xl font-bold font-mono text-amber-700 mt-1">{result.expected_consumption_kg} <span className="text-sm font-semibold">kg</span></p>
              </div>

              <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Recommended Cooking</p>
                <p className="text-2xl font-bold font-mono text-emerald-700 mt-1">{result.recommended_kg} <span className="text-sm font-semibold">kg</span></p>
              </div>

              <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs flex flex-col justify-between">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Confidence Level</p>
                <div className="mt-2">
                  <ConfidenceBadge level={result.confidence} />
                </div>
              </div>
            </div>

            {result.inference_latency_ms !== undefined && (
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex flex-wrap gap-x-6 gap-y-1.5 font-mono">
                <span className="flex items-center gap-1">⚡ <strong>Latency:</strong> {result.inference_latency_ms} ms</span>
                <span className="flex items-center gap-1">📊 <strong>Dataset Support:</strong> {result.sample_support || 0} matching canteens</span>
              </div>
            )}

            <p className="text-xs text-slate-500 leading-relaxed italic border-l-2 border-emerald-500 pl-3">
              This recommendation incorporates active safety multipliers tailored to demand variability to prevent kitchen shortages.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
