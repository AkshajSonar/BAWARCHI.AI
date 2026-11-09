"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Users,
  Search,
  Phone,
  Mail,
  HeartHandshake,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
} from "lucide-react"

type NGO = {
  id: number
  name: string
  email: string
  phone?: string
  accepts_veg: boolean
  accepts_nonveg: boolean
  is_active: boolean
  total_pickups: number
  total_redistributed_kg: number
  last_pickup_date: string
  description: string
}

const DEFAULT_NGOS: NGO[] = [
  {
    id: 1,
    name: "Food for All Foundation",
    email: "contact@foodforall.org",
    phone: "+91 98765 43210",
    accepts_veg: true,
    accepts_nonveg: false,
    is_active: true,
    total_pickups: 15,
    total_redistributed_kg: 450,
    last_pickup_date: "2026-01-08",
    description: "Serves community shelters and orphanages with daily hot vegetarian meals.",
  },
  {
    id: 2,
    name: "Community Kitchen Network",
    email: "info@communitykitchen.in",
    phone: "+91 98765 43211",
    accepts_veg: true,
    accepts_nonveg: true,
    is_active: true,
    total_pickups: 23,
    total_redistributed_kg: 680,
    last_pickup_date: "2026-01-09",
    description: "Equipped with refrigerated rescue vans to pick up bulk buffet meals quickly.",
  },
  {
    id: 3,
    name: "Hope Meals & Care",
    email: "hello@hopemeals.org",
    phone: "+91 98765 43212",
    accepts_veg: true,
    accepts_nonveg: false,
    is_active: true,
    total_pickups: 8,
    total_redistributed_kg: 240,
    last_pickup_date: "2026-01-07",
    description: "Focuses on migrant workers and elderly nursing facilities.",
  },
]

export default function NGOsPage() {
  const [ngos] = useState<NGO[]>(DEFAULT_NGOS)
  const [search, setSearch] = useState("")
  const [dietaryFilter, setDietaryFilter] = useState<"all" | "veg" | "nonveg">("all")

  const filtered = ngos.filter((n) => {
    const matchSearch =
      n.name.toLowerCase().includes(search.toLowerCase()) ||
      n.email.toLowerCase().includes(search.toLowerCase())
    if (!matchSearch) return false
    if (dietaryFilter === "veg") return n.accepts_veg
    if (dietaryFilter === "nonveg") return n.accepts_nonveg
    return true
  })

  const totalPickups = ngos.reduce((acc, n) => acc + n.total_pickups, 0)
  const totalKg = ngos.reduce((acc, n) => acc + n.total_redistributed_kg, 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Verified Partner NGO Directory
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Registered food rescue foundations, distribution capacities, and contact logistics.
          </p>
        </div>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Verified Partner NGOs
          </span>
          <div className="mt-2 text-3xl font-extrabold font-mono text-slate-900">
            {ngos.length}
          </div>
          <p className="mt-1 text-xs text-emerald-600 font-medium">
            100% active food safety compliant
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-white shadow-xs">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            Total Food Rescued
          </span>
          <div className="mt-2 text-3xl font-extrabold font-mono text-emerald-900">
            {totalKg} <span className="text-base font-normal text-emerald-700">kg</span>
          </div>
          <p className="mt-1 text-xs text-emerald-700 font-medium">
            Across {totalPickups} completed operations
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Average Response Time
          </span>
          <div className="mt-2 text-3xl font-extrabold font-mono text-slate-900">
            22 <span className="text-base font-normal text-slate-500">mins</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            From surplus dispatch to arrival
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search NGO by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl border-slate-200 h-10 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium self-start sm:self-auto">
          {[
            { id: "all", label: "All Charities" },
            { id: "veg", label: "Accepts Veg 🌱" },
            { id: "nonveg", label: "Accepts Non-Veg 🍗" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDietaryFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                dietaryFilter === tab.id
                  ? "bg-white text-slate-900 font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* NGO Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((ngo) => (
          <Card
            key={ngo.id}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    {ngo.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>{ngo.name}</span>
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    </h3>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      Verified Partner · ID #{ngo.id}
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {ngo.description}
              </p>

              {/* Preferences */}
              <div className="flex flex-wrap gap-1.5">
                {ngo.accepts_veg && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-100">
                    Vegetarian (🌱)
                  </span>
                )}
                {ngo.accepts_nonveg && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-semibold border border-amber-100">
                    Non-Vegetarian (🍗)
                  </span>
                )}
              </div>

              {/* Contact info */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1.5 font-mono">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <a href={`mailto:${ngo.email}`} className="hover:text-emerald-600 truncate">
                    {ngo.email}
                  </a>
                </div>
                {ngo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <a href={`tel:${ngo.phone}`} className="hover:text-emerald-600">
                      {ngo.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Metrics footer */}
            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                  Pickups
                </span>
                <span className="font-bold font-mono text-slate-800">
                  {ngo.total_pickups} trips
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                  Rescued
                </span>
                <span className="font-bold font-mono text-emerald-700">
                  {ngo.total_redistributed_kg} kg
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}
