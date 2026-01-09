import { ForecastRequest, ForecastResponse } from "@/types/dashboard"

const BACKEND_URL = "http://localhost:8080"

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
  const res = await fetch("http://localhost:8080/impact/summary")
  if (!res.ok) throw new Error("Failed to load impact data")
    console.log("Impact summary fetched:", res)
  return res.json()
}


