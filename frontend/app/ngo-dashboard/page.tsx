"use client"

import { useEffect, useState } from "react"
import { getAvailableSurplus } from "@/lib/api1/surplus"
import { SurplusEvent } from "@/lib/types"
import { SurplusCard } from "./components/SurplusCard"

export default function NgoDashboardPage() {
  const [data, setData] = useState<SurplusEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try {
      const res = await getAvailableSurplus()
      setData(res)
    } catch (err) {
      setError("Failed to load surplus data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) {
    return <p className="p-6 text-slate-500">Loading surplus…</p>
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Available Food for Pickup
        </h1>
        <p className="text-slate-600">
          Fresh surplus meals ready for redistribution
        </p>
      </div>

      {data.length === 0 ? (
        <p className="text-slate-500">
          No surplus available right now
        </p>
      ) : (
        <div className="grid gap-4">
          {data.map((event) => (
            <SurplusCard
              key={event.id}
              event={event}
              onAccepted={load}
            />
          ))}
        </div>
      )}
    </div>
  )
}
