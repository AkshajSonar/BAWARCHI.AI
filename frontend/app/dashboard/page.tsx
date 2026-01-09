"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getImpactSummary } from "@/lib/api"
import { TrainingStatus } from "@/lib/types"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { MetricCard } from "@/components/dashboard/metric-card"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export default function AdminDashboardPage() {
  const [impactData, setImpactData] = useState<any | null>(null)
  const [trainStatus, setTrainStatus] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [retraining, setRetraining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const round = (v?: number) => Math.round(v ?? 0)


  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [impactRes, statusRes] = await Promise.all([
          getImpactSummary(),
          fetch(`${API_BASE}/forecast/status`).then((r) => r.json()),
        ])
        setImpactData(impactRes)
        setTrainStatus(statusRes)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  async function handleRetrain() {
    try {
      setRetraining(true)
      const res = await fetch(`${API_BASE}/forecast/retrain`, {
        method: "POST",
      })
      if (!res.ok) throw new Error("Failed to retrain")
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
      <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
        Loading dashboard...
      </div>
    )
  }

  if (error || !impactData) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-destructive">
        Failed to load dashboard data
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-slate-600">
          High-level overview of system performance and impact
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <MetricCard
  title="Food Saved"
  value={`${round(impactData.food_saved_kg)} kg`}
/>

<MetricCard
  title="Meals Saved"
  value={`${round(impactData.meals_saved)}`}
/>

<MetricCard
  title="Money Saved"
  value={`₹${round(impactData.money_saved)}`}
/>

<MetricCard
  title="CO₂ Avoided"
  value={`${round(impactData.co2_avoided_kg)} kg`}
/>

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Food Waste Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Food Waste Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={impactData.waste_trend || []}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Waste (kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Prepared vs Consumed */}
        <Card>
          <CardHeader>
            <CardTitle>Prepared vs Consumed</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={impactData.consumption_trend || []}>
                <XAxis dataKey="dish" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="prepared" fill="#c7d2fe" name="Prepared (kg)" />
                <Bar dataKey="consumed" fill="#4f46e5" name="Consumed (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Food Redistributed Chart */}
      {impactData.redistribution_trend && impactData.redistribution_trend.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Food Redistributed to NGOs</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={impactData.redistribution_trend}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="quantity_kg"
                  fill="#10b981"
                  name="Redistributed (kg)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Model Training Status */}
      {trainStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Model Training Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-slate-600">
              Last trained:{" "}
              <span className="font-medium text-slate-900">
                {new Date(trainStatus.last_trained_at).toLocaleString()}
              </span>
            </div>

            <div className="text-sm text-slate-600">
              New entries since training:{" "}
              <span className="font-medium text-slate-900">
                {trainStatus.entries_since_last_train}
              </span>
            </div>

            <Badge variant={trainStatus.should_retrain ? "destructive" : "secondary"}>
              {trainStatus.should_retrain ? "Retrain recommended" : "Model up‑to‑date"}
            </Badge>

            <Button
              onClick={handleRetrain}
              disabled={loading || !trainStatus.should_retrain || retraining}
              className="w-full"
            >
              {retraining ? "Retraining…" : "Retrain Model"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
