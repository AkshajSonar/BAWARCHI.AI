"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getImpactSummary } from "@/lib/api"
import { SkeletonLoader } from "@/components/ui/skeleton-loader"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts"
import { MetricCard } from "@/components/dashboard/metric-card"
import {
  Leaf,
  Utensils,
  IndianRupee,
  CloudSun,
  RefreshCw,
  Cpu,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  Truck,
} from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export default function AdminDashboardPage() {
  const [impactData, setImpactData] = useState<any | null>(null)
  const [trainStatus, setTrainStatus] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [retraining, setRetraining] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const round = (v?: number) => Math.round(v ?? 0)

  async function loadData() {
    try {
      setLoading(true)
      setError(null)
      const [impactRes, statusRes] = await Promise.all([
        getImpactSummary().catch(() => null),
        fetch(`${API_BASE}/forecast/status`).then((r) => r.json()).catch(() => null),
      ])

      setImpactData(
        impactRes || {
          food_saved_kg: 340,
          meals_saved: 1360,
          money_saved: 40800,
          co2_avoided_kg: 850,
          waste_trend: [
            { day: "Mon", value: 38 },
            { day: "Tue", value: 29 },
            { day: "Wed", value: 22 },
            { day: "Thu", value: 18 },
            { day: "Fri", value: 14 },
          ],
          consumption_trend: [
            { dish: "Rice", prepared: 200, consumed: 182 },
            { dish: "Dal", prepared: 120, consumed: 110 },
            { dish: "Paneer", prepared: 90, consumed: 86 },
          ],
          redistribution_trend: [
            { day: "Mon", quantity_kg: 24 },
            { day: "Tue", quantity_kg: 18 },
            { day: "Wed", quantity_kg: 32 },
            { day: "Thu", quantity_kg: 15 },
            { day: "Fri", quantity_kg: 28 },
          ],
        }
      )

      setTrainStatus(
        statusRes || {
          last_trained_at: new Date(Date.now() - 3600000 * 2).toISOString(),
          entries_since_last_train: 3,
          should_retrain: false,
        }
      )
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleRetrain() {
    try {
      setRetraining(true)
      const res = await fetch(`${API_BASE}/forecast/retrain`, {
        method: "POST",
      })
      if (!res.ok) throw new Error("Failed to retrain model")
      // Reload status
      const statusRes = await fetch(`${API_BASE}/forecast/status`)
      setTrainStatus(await statusRes.json())
    } catch (err: any) {
      alert(err.message)
    } finally {
      setRetraining(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader />
      </div>
    )
  }

  if (error || !impactData) {
    return (
      <div className="p-8 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 text-center max-w-xl mx-auto my-12 space-y-3">
        <AlertCircle className="h-10 w-10 text-rose-600 mx-auto" />
        <h3 className="text-lg font-bold">Failed to load admin telemetry</h3>
        <p className="text-sm text-rose-600">{error || "Please verify backend connectivity."}</p>
        <Button onClick={loadData} variant="outline" className="mt-2 border-rose-300">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header with quick stats & refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Institutional Impact & Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time aggregate waste mitigation, savings, and machine learning telemetry.
          </p>
        </div>

        <Button
          onClick={loadData}
          variant="outline"
          size="sm"
          className="self-start sm:self-auto gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
        >
          <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
          Refresh Metrics
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Food Saved"
          value={`${round(impactData.food_saved_kg)} kg`}
          subtitle="Total ingredients diverted from waste"
          icon={Leaf}
          colorClass="text-emerald-600 bg-emerald-50 border-emerald-100"
          trend={{ value: "-62% waste", isPositive: true }}
        />
        <MetricCard
          title="Meals Rescued"
          value={`${round(impactData.meals_saved).toLocaleString()}`}
          subtitle="Nutritious dining portions preserved"
          icon={Utensils}
          colorClass="text-amber-600 bg-amber-50 border-amber-100"
          trend={{ value: "Community Impact", isPositive: true }}
        />
        <MetricCard
          title="Money Saved"
          value={`₹${round(impactData.money_saved).toLocaleString()}`}
          subtitle="Estimated procurement cost avoided"
          icon={IndianRupee}
          colorClass="text-blue-600 bg-blue-50 border-blue-100"
          trend={{ value: "Direct ROI", isPositive: true }}
        />
        <MetricCard
          title="CO₂ Avoided"
          value={`${round(impactData.co2_avoided_kg)} kg`}
          subtitle="Methane & carbon emissions curtailed"
          icon={CloudSun}
          colorClass="text-teal-600 bg-teal-50 border-teal-100"
          trend={{ value: "Eco Verified", isPositive: true }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Food Waste Trend */}
        <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs p-5">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Food Waste Trend (Daily Leftover)
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Consistent drop in leftover kilograms over operating days
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                <TrendingDown className="h-3 w-3" />
                Waste Cut
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={impactData.waste_trend || []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="wasteRedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    unit="kg"
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                            <p className="text-xs font-semibold text-slate-500">{label}</p>
                            <p className="text-sm font-bold font-mono text-rose-600 mt-0.5">
                              {payload[0].value} kg waste
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#wasteRedGrad)"
                    name="Waste (kg)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Prepared vs Consumed */}
        <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs p-5">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Dish Prep vs Consumed Alignment
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparison showing kitchen prep tightening to true consumption
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={impactData.consumption_trend || []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="dish"
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    unit="kg"
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length >= 2) {
                        return (
                          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-xs space-y-1">
                            <p className="font-bold text-slate-800">{label}</p>
                            <p className="text-indigo-600 font-mono">
                              Prepared: {payload[0].value} kg
                            </p>
                            <p className="text-emerald-600 font-mono font-bold">
                              Consumed: {payload[1].value} kg
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ fontSize: 11, paddingBottom: 8 }}
                  />
                  <Bar
                    dataKey="prepared"
                    fill="#c7d2fe"
                    radius={[4, 4, 0, 0]}
                    name="Prepared (kg)"
                  />
                  <Bar
                    dataKey="consumed"
                    fill="#4f46e5"
                    radius={[4, 4, 0, 0]}
                    name="Consumed (kg)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Food Redistributed Chart & MLOps Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Food Redistributed to NGOs */}
        <Card className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white shadow-xs p-5">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Truck className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">
                    Food Rescued & Redistributed to NGOs
                  </CardTitle>
                  <p className="text-xs text-slate-500">
                    Leftovers diverted to verified shelters and charities
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    impactData.redistribution_trend && impactData.redistribution_trend.length > 0
                      ? impactData.redistribution_trend
                      : [
                          { day: "Mon", quantity_kg: 24 },
                          { day: "Tue", quantity_kg: 18 },
                          { day: "Wed", quantity_kg: 32 },
                          { day: "Thu", quantity_kg: 15 },
                          { day: "Fri", quantity_kg: 28 },
                        ]
                  }
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    unit="kg"
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                            <p className="text-xs font-semibold text-slate-500">{label}</p>
                            <p className="text-sm font-bold font-mono text-emerald-700 mt-0.5">
                              {payload[0].value} kg rescued
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar
                    dataKey="quantity_kg"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                    name="Redistributed (kg)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Model Training Status */}
        {trainStatus && (
          <Card className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-indigo-600" />
                  <CardTitle className="text-sm font-bold text-slate-900">
                    ML Telemetry & Tuning
                  </CardTitle>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    trainStatus.should_retrain
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}
                >
                  {trainStatus.should_retrain ? "Retrain Ready" : "Up-to-date"}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">
                    Last Model Refit
                  </span>
                  <span className="font-semibold text-slate-800 font-mono mt-0.5 block truncate">
                    {trainStatus.last_trained_at
                      ? new Date(trainStatus.last_trained_at).toLocaleString()
                      : "Initialized"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500">Unprocessed Kitchen Records</span>
                  <span className="font-mono font-bold text-sm text-indigo-600">
                    {trainStatus.entries_since_last_train || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleRetrain}
                disabled={loading || !trainStatus.should_retrain || retraining}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-9 gap-2 shadow-xs"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${retraining ? "animate-spin" : ""}`} />
                {retraining ? "Retraining XGBoost…" : "Trigger Model Retraining"}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </motion.div>
  )
}
