"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { acceptSurplus } from "@/lib/api1/surplus"
import { SurplusEvent } from "@/lib/types"
import { CountdownBadge } from "./CountdownBadge"
import {
  Package,
  MapPin,
  Utensils,
  CheckCircle2,
  AlertCircle,
  Truck,
} from "lucide-react"

export function SurplusCard({
  event,
  onAccepted,
}: {
  event: SurplusEvent
  onAccepted: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [justAccepted, setJustAccepted] = useState(false)

  async function handleAccept() {
    try {
      setLoading(true)
      await acceptSurplus(event.id)
      setJustAccepted(true)
      setTimeout(() => {
        onAccepted()
      }, 1500)
    } catch (err) {
      alert("Failed to claim surplus batch. It may have already been reserved.")
    } finally {
      setLoading(false)
    }
  }

  const isAvailable = event.status === "available" && !justAccepted
  const portions = Math.round(event.quantity_kg * 4)

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-emerald-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
            {event.dish_name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-slate-900">
                {event.dish_name}
              </CardTitle>
              <span className="capitalize text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {event.dish_type}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 capitalize">
              {event.meal_type} Service Surplus · Event #{event.id}
            </p>
          </div>
        </div>

        <CountdownBadge expiresAt={event.expires_at} />
      </div>

      <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">
            Net Quantity
          </span>
          <span className="text-xl font-extrabold font-mono text-slate-900 mt-0.5 block">
            {event.quantity_kg} <span className="text-xs font-normal text-slate-500">kg</span>
          </span>
          <span className="text-[10px] text-emerald-700 font-medium">
            ~{portions} nutritious portions
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">
            Pickup Location
          </span>
          <span className="font-semibold text-slate-800 flex items-center gap-1 mt-1 truncate">
            <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            Kitchen Loading Bay 2
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Main Campus Canteen
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">
            Packaging & Hygiene
          </span>
          <span className="font-semibold text-emerald-800 flex items-center gap-1 mt-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            Insulated Cambro Trays
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Prepared under FSSAI norms
          </span>
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
        <div className="text-xs text-slate-500">
          {justAccepted ? (
            <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Pickup Reserved! Notifying canteen loading manager.
            </span>
          ) : (
            <span>Ready for dispatch · Immediate vehicle arrival recommended</span>
          )}
        </div>

        <Button
          onClick={handleAccept}
          disabled={loading || !isAvailable}
          className={`font-semibold text-xs h-9 px-4 rounded-xl gap-2 shadow-xs ${
            justAccepted
              ? "bg-emerald-700 text-white"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          <Truck className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Confirming…" : justAccepted ? "Claimed!" : "Accept & Claim Food"}
        </Button>
      </div>
    </Card>
  )
}
