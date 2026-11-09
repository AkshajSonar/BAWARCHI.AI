"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { motion } from "framer-motion"
import { TrendingDown } from "lucide-react"

export function WasteTrendChart({ data }: { data: any[] }) {
  const chartData = Array.isArray(data) && data.length > 0 ? data : [
    { day: "Mon", value: 45 },
    { day: "Tue", value: 38 },
    { day: "Wed", value: 30 },
    { day: "Thu", value: 24 },
    { day: "Fri", value: 18 },
    { day: "Sat", value: 14 },
    { day: "Sun", value: 12 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Food Waste Reduction Over Time</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <TrendingDown className="h-3 w-3" />
              -62% since AI launch
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Daily leftover quantities tracked across dining services (lower is better)
          </p>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="wasteGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tick={{ fill: "#64748b", fontSize: 12 }}
              unit="kg"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                      <p className="text-xs font-semibold text-slate-500 uppercase">{label}</p>
                      <p className="text-sm font-bold font-mono text-emerald-700 mt-0.5">
                        {payload[0].value} kg waste
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#059669"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#wasteGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
