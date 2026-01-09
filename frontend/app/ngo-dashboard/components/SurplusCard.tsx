"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { acceptSurplus } from "@/lib/api1/surplus"
import { SurplusEvent } from "@/lib/types"
import { CountdownBadge } from "./CountdownBadge"

export function SurplusCard({
  event,
  onAccepted,
}: {
  event: SurplusEvent
  onAccepted: () => void
}) {
  const [loading, setLoading] = useState(false)

  async function handleAccept() {
    try {
      setLoading(true)
      await acceptSurplus(event.id)
      onAccepted()
    } catch (err) {
      alert("Failed to accept surplus")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle>{event.dish_name}</CardTitle>
          <p className="text-sm text-slate-500">
            {event.meal_type} · {event.dish_type}
          </p>
        </div>

        <CountdownBadge expiresAt={event.expires_at} />
      </CardHeader>

      <CardContent className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="text-sm">
            Quantity:{" "}
            <span className="font-semibold">
              {event.quantity_kg} kg
            </span>
          </p>

          <Badge variant="secondary">
            {event.status}
          </Badge>
        </div>

        <Button
          onClick={handleAccept}
          disabled={loading || event.status !== "available"}
        >
          {loading ? "Accepting…" : "Accept Pickup"}
        </Button>
      </CardContent>
    </Card>
  )
}
