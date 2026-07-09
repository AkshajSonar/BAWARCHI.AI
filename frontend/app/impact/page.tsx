"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useEffect, useState } from "react"
import { getImpactSummary, getMLMetrics } from "@/lib/api"
import { AnimatedKpi } from "@/components/impact/AnimatedKpi"
import { WasteTrendChart } from "@/components/impact/WasteTrendChart"
import { ModelRetrainCard } from "@/components/impact/ModelRetrainCard"
import { MLMetrics } from "@/types/dashboard"

// ---------- SAMPLE DATA (Replace later with real backend) ----------

const wasteData = [
  { day: "Day 1", waste: 80 },
  { day: "Day 2", waste: 65 },
  { day: "Day 3", waste: 55 },
  { day: "Day 4", waste: 40 },
  { day: "Day 5", waste: 28 },
]

const accuracyData = [
  { day: "Day 1", error: 22 },
  { day: "Day 2", error: 18 },
  { day: "Day 3", error: 14 },
  { day: "Day 4", error: 10 },
  { day: "Day 5", error: 7 },
]

const consumptionData = [
  { dish: "Rice", prepared: 200, consumed: 175 },
  { dish: "Dal", prepared: 120, consumed: 95 },
  { dish: "Sabzi", prepared: 90, consumed: 82 },
]


// ---------------------------------------------------------------

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export default function ImpactPage() {
  const [data, setData] = useState<any | null>(null)
  const [mlMetrics, setMlMetrics] = useState<MLMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trainStatus, setTrainStatus] = useState(null)
  const [retraining, setRetraining] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE}/forecast/status`)
      .then((res) => res.json())
      .then(setTrainStatus)
  }, [])

  async function handleRetrain() {
    setRetraining(true)
    await fetch(`${API_BASE}/forecast/retrain`, {
      method: "POST",
    })
    window.location.reload()
  }

  useEffect(() => {
    Promise.all([getImpactSummary(), getMLMetrics()])
      .then(([summaryRes, metricsRes]) => {
        setData(summaryRes)
        setMlMetrics(metricsRes)
      })
      .catch((err) => {
        console.error(err)
        setError("Failed to load impact data")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])
console.log("Loading:", loading, "Error:", error, "Data:", data);
if (loading) {
  return (
    <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
      Loading impact data...
    </div>
  )
}

if (error || !data) {
  return (
    <div className="flex items-center justify-center h-[60vh] text-destructive">
      Failed to load impact data
    </div>
  )
}

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Impact Overview</h1>
        <p className="text-slate-600">
          How AI‑driven planning reduced waste and improved efficiency.
        </p>
      </div>

      {/* KPI CARDS */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  <AnimatedKpi
    title="Food Saved"
    value={data.food_saved_kg}
    suffix=" kg"
  />

  <AnimatedKpi
    title="Meals Saved"
    value={data.meals_saved}
  />

  <AnimatedKpi
    title="Money Saved"
    value={data.money_saved}
    suffix=" ₹"
  />

  <AnimatedKpi
    title="CO₂ Avoided"
    value={data.co2_avoided_kg}
    suffix=" kg"
  />
</div>

    {/* <WasteTrendChart data={data.waste_trend} /> */}

      {/* Waste Reduction Chart */}
      <ImpactCard
        title="Food Waste Reduction Over Time"
        description="Steady decline in daily food waste after AI adoption"
      >
        <ChartWrapper>
          <LineChart data={data.waste_trend}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4f46e5"
              strokeWidth={3}
            />
          </LineChart>
        </ChartWrapper>
      </ImpactCard>

      {/* Accuracy Improvement */}
      {/* <ImpactCard
        title="Prediction Accuracy Improvement"
        description="Model learns continuously from kitchen data"
      >
        <ChartWrapper>
          <LineChart data={accuracyData}>
            <XAxis dataKey="day" />
            <YAxis unit="%" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="error"
              stroke="#16a34a"
              strokeWidth={3}
            />
          </LineChart>
        </ChartWrapper>
      </ImpactCard> */}

      {/* Prepared vs Consumed */}
      <ImpactCard
        title="Prepared vs Consumed Quantities"
        description="Improved alignment between cooking and actual demand"
      >
        <ChartWrapper>
          <BarChart data={data.consumption_trend}>
            <XAxis dataKey="dish" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="prepared" fill="#c7d2fe" />
            <Bar dataKey="consumed" fill="#4f46e5" />
          </BarChart>
        </ChartWrapper>
      </ImpactCard>

      {/* ML Model Performance & Evaluation Metrics */}
      {mlMetrics && (
        <Card className="border-indigo-100 bg-gradient-to-r from-indigo-50/50 via-white to-indigo-50/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-indigo-900 flex items-center gap-2">
                🤖 ML Model Performance & Validation
              </CardTitle>
              <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono">
                XGBoost Regressor
              </Badge>
            </div>
            <p className="text-sm text-slate-600">
              Evaluated using 5-Fold Cross-Validation to guarantee generalization and prevent overfitting. 
              Reflects the precision and performance characteristics required for production workloads.
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Grid 1: Side by Side Training vs Cross-Validation Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Training Metrics Card */}
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-slate-700 border-b pb-2 flex items-center justify-between">
                  <span>🎯 Model Fit (Training Data)</span>
                  <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200">In-Sample</Badge>
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">MAE</p>
                    <p className="text-xl font-bold font-mono text-slate-800">{(mlMetrics?.train_metrics?.mae ?? 0).toFixed(2)} <span className="text-[10px] text-slate-400">kg</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">RMSE</p>
                    <p className="text-xl font-bold font-mono text-slate-800">{(mlMetrics?.train_metrics?.rmse ?? 0).toFixed(2)} <span className="text-[10px] text-slate-400">kg</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">R² Score</p>
                    <p className="text-xl font-bold font-mono text-indigo-600">{Math.round((mlMetrics?.train_metrics?.r2 ?? 0) * 100)}%</p>
                  </div>
                </div>
              </div>

              {/* Cross-Validation Metrics Card */}
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-slate-700 border-b pb-2 flex items-center justify-between">
                  <span>📊 Generalization (5-Fold Cross-Val)</span>
                  <Badge variant="outline" className="text-indigo-700 bg-indigo-50 border-indigo-200">Out-of-Sample</Badge>
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Avg MAE</p>
                    <p className="text-xl font-bold font-mono text-slate-800">{(mlMetrics?.val_metrics?.mae ?? 0).toFixed(2)} <span className="text-[10px] text-slate-400">kg</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Avg RMSE</p>
                    <p className="text-xl font-bold font-mono text-slate-800">{(mlMetrics?.val_metrics?.rmse ?? 0).toFixed(2)} <span className="text-[10px] text-slate-400">kg</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">R² Score</p>
                    <p className="text-xl font-bold font-mono text-indigo-600">{Math.round((mlMetrics?.val_metrics?.r2 ?? 0) * 100)}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid 2: Feature Importance Visualization */}
            <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 border-b pb-2">
                🔑 Feature Importances (Model Interpretability)
              </h3>
              <p className="text-xs text-slate-500">
                Visualizes which input signals the XGBoost regressor relies on most when predicting consumed food quantities.
              </p>
              <div className="h-[240px] w-full">
                <ResponsiveContainer>
                  <BarChart
                    layout="vertical"
                    data={
                      Object.entries(mlMetrics?.feature_importances || {})
                        .map(([feature, importance]) => ({
                          name: feature
                            .replace("is_", "")
                            .replace("_day", "")
                            .replace("_qty", "")
                            .replace("_kg", "")
                            .replace("_", " ")
                            .toUpperCase(),
                          importance: Number((importance * 100).toFixed(1)),
                        }))
                        .sort((a, b) => b.importance - a.importance)
                    }
                    margin={{ left: 60, right: 20, top: 10, bottom: 10 }}
                  >
                    <XAxis type="number" unit="%" />
                    <YAxis type="category" dataKey="name" width={100} style={{ fontSize: 10, fontWeight: 500 }} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Weight / Importance']} />
                    <Bar dataKey="importance" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Grid 3: Training logs & metadata */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-600 text-xs">
              <div>
                <p className="font-semibold text-slate-400">Dataset Size</p>
                <p className="text-sm font-bold text-slate-700">{mlMetrics?.total_training_samples ?? 0} records</p>
              </div>
              <div>
                <p className="font-semibold text-slate-400">Total Fit Latency</p>
                <p className="text-sm font-bold text-slate-700">{Math.round((mlMetrics?.training_duration_seconds ?? 0) * 1000)} ms</p>
              </div>
              <div>
                <p className="font-semibold text-slate-400">Validation Split</p>
                <p className="text-sm font-bold text-slate-700">80/20 (K-Fold)</p>
              </div>
              <div>
                <p className="font-semibold text-slate-400">Last Training Session</p>
                <p className="text-sm font-bold text-slate-700 truncate" title={mlMetrics?.last_trained_at || "N/A"}>
                  {mlMetrics?.last_trained_at || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {trainStatus && (
  <ModelRetrainCard
    status={trainStatus}
    onRetrain={handleRetrain}
    loading={retraining}
  />
)}


      {/* NGO Redistribution Section */}
      <Card>
        <CardHeader>
          <CardTitle>NGO Redistribution Impact</CardTitle>
          <p className="text-sm text-slate-600">
            Food saved through AI forecasting is redistributed to NGOs, creating
            a complete waste-to-impact cycle
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-700">
                {data.ngos_served || 0}
              </p>
              <p className="text-sm text-slate-600">NGOs Served</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-700">
                {data.food_redistributed_kg || 0} kg
              </p>
              <p className="text-sm text-slate-600">Food Redistributed</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-700">
                {data.successful_redistributions || 0}
              </p>
              <p className="text-sm text-slate-600">Successful Pickups</p>
            </div>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-slate-600">
              <strong>How it works:</strong> When kitchen entries show leftover
              quantities ≥ 15 kg, surplus events are automatically created. NGOs
              can view and accept these events, ensuring food reaches those in
              need instead of going to waste.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Final Statement */}
      <Card>
        <CardContent className="py-6 text-center space-y-2">
          <Badge className="bg-green-100 text-green-700">
            Real‑World Impact
          </Badge>
          <p className="text-slate-700 max-w-2xl mx-auto">
            By combining daily kitchen data with contextual signals,
            BawarchiAI enables institutions to cook closer to real demand —
            reducing waste, saving money, and lowering carbon impact
            automatically over time. Surplus food is seamlessly redistributed
            to NGOs, creating a complete AI → Less Waste → NGO Redistribution
            cycle.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// ----------------- SMALL COMPONENTS -----------------

function KpiCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-slate-500">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

function ImpactCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-slate-600">{description}</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function ChartWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer>{children}</ResponsiveContainer>
    </div>
  )
}
