import { ForecastRequest, ForecastResponse, MLMetrics } from "@/types/dashboard"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export async function getDishForecast(
  payload: ForecastRequest
): Promise<ForecastResponse> {
  const res = await fetch(`${BACKEND_URL}/forecast/dish`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Failed to fetch forecast")
  }

  return res.json()
}

export async function getImpactSummary() {
  const res = await fetch(`${BACKEND_URL}/impact/summary`, {
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to load impact data")
    console.log("Impact summary fetched:", res)
  return res.json()
}

export async function getMLMetrics(): Promise<MLMetrics> {
  const res = await fetch(`${BACKEND_URL}/forecast/metrics`, {
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to load ML metrics")
  return res.json()
}



