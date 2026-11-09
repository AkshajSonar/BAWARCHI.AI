"use client"

import { useState, useEffect } from "react"
import { Timer, AlertTriangle } from "lucide-react"

export function CountdownBadge({ expiresAt }: { expiresAt: string }) {
  const [minutesLeft, setMinutesLeft] = useState<number>(0)

  useEffect(() => {
    const calc = () => {
      const diff = new Date(expiresAt).getTime() - Date.now()
      setMinutesLeft(Math.floor(diff / 60000))
    }
    calc()
    const timer = setInterval(calc, 30000)
    return () => clearInterval(timer)
  }, [expiresAt])

  if (minutesLeft <= 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <AlertTriangle className="h-3 w-3 text-rose-600" />
        Safe Window Expired
      </span>
    )
  }

  const isUrgent = minutesLeft < 45

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
        isUrgent
          ? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
          : "bg-emerald-50 text-emerald-800 border-emerald-200"
      }`}
    >
      <Timer className={`h-3.5 w-3.5 ${isUrgent ? "text-rose-600" : "text-emerald-600"}`} />
      <span>
        {minutesLeft < 60
          ? `Expires in ${minutesLeft}m`
          : `Expires in ${Math.floor(minutesLeft / 60)}h ${minutesLeft % 60}m`}
      </span>
    </span>
  )
}
