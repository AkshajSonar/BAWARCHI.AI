import { SurplusEvent } from "@/lib/types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export async function getAvailableSurplus(): Promise<SurplusEvent[]> {
  const res = await fetch(`${API_BASE}/ngos/surplus/available`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch surplus")
  }

  return res.json()
}

export async function acceptSurplus(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/ngos/surplus/${id}/accept`, {
    method: "POST",
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Failed to accept surplus")
  }
}

export async function getAllSurplusEvents(): Promise<SurplusEvent[]> {
  const res = await fetch(`${API_BASE}/surplus/events`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch surplus events")
  }

  return res.json()
}
