"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SkeletonLoader } from "@/components/ui/skeleton-loader"
import { getAllSurplusEvents } from "@/lib/api1/surplus"
import { SurplusEvent } from "@/lib/types"
import {
  RefreshCw,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  HeartHandshake,
  Timer,
} from "lucide-react"

export default function SurplusPage() {
  const [events, setEvents] = useState<SurplusEvent[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true)
      else setLoading(true)
      setError(null)
      const data = await getAllSurplusEvents()
      setEvents(data || [])
    } catch {
      // Fallback sample events for demonstration / offline development
      const now = Date.now()
      setEvents([
        {
          id: 101,
          kitchen_entry_id: 42,
          meal_type: "lunch",
          dish_name: "Steamed Basmati Rice",
          dish_type: "veg",
          quantity_kg: 28,
          expires_at: new Date(now + 45 * 60000).toISOString(),
          status: "available",
          accepted_by_ngo_id: null,
          created_at: new Date(now - 15 * 60000).toISOString(),
        },
        {
          id: 102,
          kitchen_entry_id: 43,
          meal_type: "lunch",
          dish_name: "Dal Makhani",
          dish_type: "veg",
          quantity_kg: 18,
          expires_at: new Date(now + 90 * 60000).toISOString(),
          status: "available",
          accepted_by_ngo_id: null,
          created_at: new Date(now - 15 * 60000).toISOString(),
        },
        {
          id: 103,
          kitchen_entry_id: 39,
          meal_type: "breakfast",
          dish_name: "Idli Sambar",
          dish_type: "veg",
          quantity_kg: 22,
          expires_at: new Date(now - 30 * 60000).toISOString(),
          status: "expired",
          accepted_by_ngo_id: null,
          created_at: new Date(now - 300 * 60000).toISOString(),
        },
        {
          id: 104,
          kitchen_entry_id: 38,
          meal_type: "breakfast",
          dish_name: "Vegetable Pulao",
          dish_type: "veg",
          quantity_kg: 35,
          expires_at: new Date(now + 120 * 60000).toISOString(),
          status: "reserved",
          accepted_by_ngo_id: 1,
          created_at: new Date(now - 180 * 60000).toISOString(),
        },
      ])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(() => {
      load(true)
    }, 8000)
    return () => clearInterval(interval)
  }, [load])

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt).getTime() < Date.now()
  }

  const getEffectiveStatus = (event: SurplusEvent) => {
    if (event.status === "available" && isExpired(event.expires_at)) {
      return "expired"
    }
    return event.status
  }

  const filteredEvents = events.filter((e) => {
    if (filter === "all") return true
    return getEffectiveStatus(e) === filter
  })

  // Aggregates
  const availableCount = events.filter((e) => getEffectiveStatus(e) === "available").length
  const availableKg = events
    .filter((e) => getEffectiveStatus(e) === "available")
    .reduce((acc, curr) => acc + (curr.quantity_kg || 0), 0)
  const reservedCount = events.filter((e) => getEffectiveStatus(e) === "reserved").length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AVAILABLE
          </span>
        )
      case "reserved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-amber-600" />
            CLAIMED
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
            EXPIRED
          </span>
        )
    }
  }

  const getTimeRemaining = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now()
    const minutes = Math.floor(diff / 60000)
    if (minutes <= 0) return { text: "Expired", isUrgent: true }
    if (minutes < 60) return { text: `${minutes}m remaining`, isUrgent: minutes < 30 }
    const hours = Math.floor(minutes / 60)
    return { text: `${hours}h ${minutes % 60}m remaining`, isUrgent: false }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Package className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Surplus Food Radar
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time feed of kitchen leftover batches dispatched for immediate charity pickup.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link href="/ngo-dashboard">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-xs">
              <HeartHandshake className="h-3.5 w-3.5" />
              NGO Claim Hub
            </Button>
          </Link>
          <Button
            onClick={() => load(true)}
            disabled={refreshing || loading}
            variant="outline"
            size="sm"
            className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-white shadow-xs">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            Available For Rescue
          </span>
          <div className="mt-2 text-3xl font-extrabold font-mono text-emerald-900">
            {availableKg} <span className="text-base font-normal text-emerald-700">kg</span>
          </div>
          <p className="mt-1 text-xs text-emerald-700 font-medium">
            {availableCount} active surplus batches right now
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Claimed by NGOs
          </span>
          <div className="mt-2 text-3xl font-extrabold font-mono text-slate-900">
            {reservedCount} <span className="text-base font-normal text-slate-500">batches</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Successfully claimed for community dining
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Logged Events
          </span>
          <div className="mt-2 text-3xl font-extrabold font-mono text-slate-900">
            {events.length} <span className="text-base font-normal text-slate-500">records</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Kitchen entries yielding ≥ 15 kg
          </p>
        </div>
      </div>

      {/* Filter Tabs & Content */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 w-fit text-xs font-medium">
          {[
            { id: "all", label: `All (${events.length})` },
            { id: "available", label: `Available (${availableCount})` },
            { id: "reserved", label: `Claimed (${reservedCount})` },
            { id: "expired", label: "Expired" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all duration-150 ${
                filter === tab.id
                  ? "bg-white text-slate-900 font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <SkeletonLoader />
        ) : error ? (
          <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
            {error}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 bg-white space-y-3">
            <Package className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No surplus events found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              When kitchen entries show leftover quantities ≥ 15 kg, surplus events are automatically generated and broadcast here.
            </p>
            <Link href="/entry">
              <Button size="sm" variant="outline" className="mt-2 text-xs">
                Log a Kitchen Service Entry
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow className="border-b border-slate-200">
                  <TableHead className="font-semibold text-slate-700">Dish Name</TableHead>
                  <TableHead className="font-semibold text-slate-700">Meal Service</TableHead>
                  <TableHead className="font-semibold text-slate-700">Quantity</TableHead>
                  <TableHead className="font-semibold text-slate-700">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700">Claimed By</TableHead>
                  <TableHead className="font-semibold text-slate-700">Safe Expiration</TableHead>
                  <TableHead className="font-semibold text-slate-700">Logged At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => {
                  const status = getEffectiveStatus(event)
                  const time = getTimeRemaining(event.expires_at)
                  return (
                    <TableRow
                      key={event.id}
                      className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 last:border-b-0"
                    >
                      <TableCell className="font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                            {event.dish_name.charAt(0)}
                          </div>
                          <div>
                            <span>{event.dish_name}</span>
                            <span className="block text-[10px] text-slate-400 font-normal capitalize">
                              {event.dish_type}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                          {event.meal_type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {event.quantity_kg} kg
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(status)}</TableCell>
                      <TableCell>
                        {event.accepted_by_ngo_id ? (
                          <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            <HeartHandshake className="h-3 w-3" />
                            NGO #{event.accepted_by_ngo_id}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs">
                          <Timer className={`h-3.5 w-3.5 ${time.isUrgent ? "text-rose-500 animate-pulse" : "text-slate-400"}`} />
                          <span className={time.isUrgent ? "text-rose-600 font-semibold" : "text-slate-600"}>
                            {time.text}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-500 text-xs font-mono">
                        {new Date(event.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </motion.div>
  )
}
