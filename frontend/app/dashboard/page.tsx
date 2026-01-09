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
  const [trainStatus, setTrainStatus] = useState<TrainingStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [retraining, setRetraining] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const canRetrain = (trainStatus?.rows_used || 0) >= 10

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
          value={`${impactData.food_saved_kg || 0} kg`}
        />
        <MetricCard
          title="Meals Saved"
          value={impactData.meals_saved || 0}
        />
        <MetricCard
          title="Money Saved"
          value={`₹${impactData.money_saved || 0}`}
        />
        <MetricCard
          title="CO₂ Avoided"
          value={`${impactData.co2_avoided_kg || 0} kg`}
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
      {impactData.redistribution_trend && (
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
      <Card>
        <CardHeader>
          <CardTitle>Model Training Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trainStatus ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Last Trained</p>
                  <p className="text-lg font-semibold">
                    {new Date(trainStatus.last_trained_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Entries Since Training</p>
                  <p className="text-lg font-semibold">
                    {trainStatus.rows_used}
                  </p>
                </div>
                <div>
                  <Badge
                    variant={canRetrain ? "default" : "secondary"}
                  >
                    {canRetrain ? "Ready to Retrain" : "Need More Data"}
                  </Badge>
                </div>
              </div>
              {trainStatus.trigger_reason && (
                <p className="text-sm text-slate-500">
                  Reason: {trainStatus.trigger_reason}
                </p>
              )}
              <Button
                onClick={handleRetrain}
                disabled={!canRetrain || retraining}
                className="w-full"
              >
                {retraining
                  ? "Retraining..."
                  : canRetrain
                  ? "Retrain Model"
                  : "Need 10+ Entries to Retrain"}
              </Button>
            </>
          ) : (
            <p className="text-slate-500">No training data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
