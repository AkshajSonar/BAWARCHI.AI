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
import { getImpactSummary } from "@/lib/api"
import { AnimatedKpi } from "@/components/impact/AnimatedKpi"
import { WasteTrendChart } from "@/components/impact/WasteTrendChart"
import { ModelRetrainCard } from "@/components/impact/ModelRetrainCard"

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

export default function ImpactPage() {
 const [data, setData] = useState<any | null>(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
const [trainStatus, setTrainStatus] = useState(null)
const [retraining, setRetraining] = useState(false)

useEffect(() => {
  fetch("http://localhost:8080/forecast/status")
    .then((res) => res.json())
    .then(setTrainStatus)
}, [])

async function handleRetrain() {
  setRetraining(true)
  await fetch("http://localhost:8080/forecast/retrain", {
    method: "POST",
  })
  window.location.reload()
}


useEffect(() => {
  getImpactSummary()
    .then((res) => {
      setData(res)
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
console.log("Impact data:", data);
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
      
      {trainStatus && (
  <ModelRetrainCard
    status={trainStatus}
    onRetrain={handleRetrain}
    loading={retraining}
  />
)}


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
            automatically over time.
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
