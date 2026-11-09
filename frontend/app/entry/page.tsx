"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
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
import { Label } from "@/components/ui/label"
import {
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  GraduationCap,
  CalendarOff,
  Coffee,
  PartyPopper,
  Package,
  Sparkles,
  Utensils,
} from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export default function EntryPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [lastSavedSurplus, setLastSavedSurplus] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    meal_type: "lunch",
    dish_name: "",
    dish_type: "veg",
    total_students: 1200,
    prepared_qty: "",
    leftover_qty: "",
    is_special: 0,
    is_exam_day: 0,
    is_holiday: 0,
    is_break: 0,
    is_event_day: 0,
  })

  const prep = parseFloat(form.prepared_qty) || 0
  const left = parseFloat(form.leftover_qty) || 0
  const consumed = Math.max(0, prep - left)
  const wastePercent = prep > 0 ? Math.round((left / prep) * 100) : 0
  const triggersSurplus = left >= 15

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!form.dish_name.trim()) {
      setError("Please specify the dish name")
      return
    }
    if (!form.prepared_qty || prep <= 0) {
      setError("Please enter a valid prepared quantity")
      return
    }
    if (form.leftover_qty === "" || left < 0) {
      setError("Please enter leftover quantity (use 0 if none)")
      return
    }
    if (left > prep) {
      setError("Leftover quantity cannot exceed prepared quantity")
      return
    }

    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/kitchen/entry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          prepared_qty: prep,
          leftover_qty: left,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Failed to save entry")
      }

      setLastSavedSurplus(triggersSurplus)
      setSuccess(true)
      setForm((prev) => ({
        ...prev,
        dish_name: "",
        prepared_qty: "",
        leftover_qty: "",
      }))
    } catch (err: any) {
      setError(err.message || "Failed to save kitchen entry")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ClipboardList className="h-4 w-4" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Kitchen Service Post-Meal Log
          </h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Log actual consumption quantities to refine future ML models and automatically dispatch excess food to partner NGOs.
        </p>
      </div>

      {/* Main Entry Card */}
      <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            {/* Meal Type */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase">
                Meal Service
              </Label>
              <Select
                value={form.meal_type}
                onValueChange={(v) => setForm({ ...form, meal_type: v })}
              >
                <SelectTrigger className="rounded-xl border-slate-200 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dish Name */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase">
                Dish Name
              </Label>
              <Input
                placeholder="e.g. Steamed Rice, Dal Makhani"
                value={form.dish_name}
                onChange={(e) => setForm({ ...form, dish_name: e.target.value })}
                className="rounded-xl border-slate-200 h-10"
              />
            </div>

            {/* Dish Type */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase">
                Dietary Category
              </Label>
              <Select
                value={form.dish_type}
                onValueChange={(v) => setForm({ ...form, dish_type: v })}
              >
                <SelectTrigger className="rounded-xl border-slate-200 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="veg">Vegetarian (🌱)</SelectItem>
                  <SelectItem value="egg">Egg-based (🥚)</SelectItem>
                  <SelectItem value="nonveg">Non-Vegetarian (🍗)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Total Students */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase">
                Actual Diners Served
              </Label>
              <Input
                type="number"
                value={form.total_students}
                onChange={(e) =>
                  setForm({ ...form, total_students: Number(e.target.value) })
                }
                className="rounded-xl border-slate-200 h-10 font-mono"
              />
            </div>
          </div>

          {/* Context Flags */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <Label className="text-xs font-bold text-slate-700 uppercase block">
              Service Operating Context
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {[
                { key: "is_special", label: "Special Dish", icon: Flame },
                { key: "is_exam_day", label: "Exam Day", icon: GraduationCap },
                { key: "is_holiday", label: "Holiday", icon: CalendarOff },
                { key: "is_break", label: "Campus Break", icon: Coffee },
                { key: "is_event_day", label: "Campus Event", icon: PartyPopper },
              ].map(({ key, label, icon: Icon }) => {
                const isActive = form[key as keyof typeof form] === 1
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        [key]: isActive ? 0 : 1,
                      })
                    }
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      isActive
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs"
                        : "bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                    <span>{label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quantities Section with Live Calculation */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <Label className="text-xs font-bold text-slate-700 uppercase block">
              Kilogram Measurement (Kitchen Scales)
            </Label>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600">
                  Prepared Quantity (kg)
                </Label>
                <Input
                  type="number"
                  step="0.5"
                  placeholder="e.g. 200"
                  value={form.prepared_qty}
                  onChange={(e) =>
                    setForm({ ...form, prepared_qty: e.target.value })
                  }
                  className="rounded-xl border-slate-200 h-10 font-mono text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600">
                  Leftover Quantity (kg)
                </Label>
                <Input
                  type="number"
                  step="0.5"
                  placeholder="e.g. 18"
                  value={form.leftover_qty}
                  onChange={(e) =>
                    setForm({ ...form, leftover_qty: e.target.value })
                  }
                  className="rounded-xl border-slate-200 h-10 font-mono text-base"
                />
              </div>
            </div>

            {/* Real-time Consumption Calculation Preview */}
            {prep > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Calculated Metrics:</span>
                  <span className="font-mono text-slate-500">
                    Prepared: {prep} kg · Consumed: {consumed} kg
                  </span>
                </div>

                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${Math.max(0, 100 - wastePercent)}%` }}
                    title={`Consumed: ${100 - wastePercent}%`}
                  />
                  <div
                    className="bg-rose-500 h-full transition-all duration-300"
                    style={{ width: `${wastePercent}%` }}
                    title={`Leftover: ${wastePercent}%`}
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-700 font-medium">
                    ✓ Eaten: {consumed} kg ({100 - wastePercent}%)
                  </span>
                  <span className="text-rose-600 font-medium">
                    ⚠ Leftover: {left} kg ({wastePercent}%)
                  </span>
                </div>

                {triggersSurplus ? (
                  <div className="p-3 rounded-lg bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-xs flex items-start gap-2">
                    <Package className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">NGO Surplus Redistribution Alert Enabled</p>
                      <p className="text-[11px] text-emerald-800 mt-0.5">
                        Leftover is ≥ 15 kg. Saving this entry will automatically dispatch an emergency pickup broadcast to verified local food rescue NGOs!
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic">
                    Leftover is below the 15 kg threshold for automated NGO redistribution.
                  </p>
                )}
              </motion.div>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11 rounded-xl shadow-md gap-2"
          >
            <Sparkles className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Recording Service Entry…" : "Save Kitchen Entry"}
          </Button>
        </form>
      </Card>

      {/* Confirmation & Error Alerts */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <h4 className="font-bold text-sm">
                Kitchen Entry Saved Successfully!
              </h4>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              The service record has been stored in Supabase and ingested into our continuous learning pipeline.
            </p>
            {lastSavedSurplus && (
              <div className="pt-2">
                <Link href="/surplus">
                  <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs gap-1.5 shadow-xs">
                    <Package className="h-3.5 w-3.5" />
                    View Dispatched Surplus Broadcast in Radar
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
            <p className="font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
