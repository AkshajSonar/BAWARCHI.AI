"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  X,
  Sparkles,
  PlusCircle,
  Bell,
  Clock,
  Radio,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onToggleSidebar?: () => void
  sidebarOpen?: boolean
}

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Live Operations Overview",
    subtitle: "Real-time lunch demand predictions & buffer planning",
  },
  "/dashboard": {
    title: "Executive Dashboard",
    subtitle: "High-level waste mitigation & financial performance",
  },
  "/forecast": {
    title: "AI Demand Forecast Studio",
    subtitle: "Granular ML predictions parameterized by calendar & menu signals",
  },
  "/entry": {
    title: "Kitchen Service Entry",
    subtitle: "Record prepared vs leftover food to train ML and trigger surplus alerts",
  },
  "/surplus": {
    title: "Surplus Food Radar",
    subtitle: "Redistribution events dispatched to local verified NGOs",
  },
  "/ngo-dashboard": {
    title: "NGO Food Rescue Hub",
    subtitle: "Claim fresh surplus food before expiration for community dining",
  },
  "/ngos": {
    title: "Partner NGO Directory",
    subtitle: "Registered verified food rescue charities and logistics contacts",
  },
  "/impact": {
    title: "Impact & ML Telemetry",
    subtitle: "XGBoost model validation, 5-fold CV metrics & eco metrics",
  },
}

export function Header({ onToggleSidebar, sidebarOpen }: HeaderProps) {
  const pathname = usePathname()
  const [currentTime, setCurrentTime] = useState<string>("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const currentInfo = PAGE_TITLES[pathname] || {
    title: "Zero-Waste Canteen Planner",
    subtitle: "AI-powered meal demand optimization",
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Hamburger (mobile) + Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {currentInfo.title}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Radio className="h-2.5 w-2.5 animate-pulse text-emerald-500" />
                Live
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-500 line-clamp-1">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Telemetry & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live time indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 text-xs font-mono text-slate-600">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{currentTime || "Today"}</span>
          </div>

          {/* Quick service pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-medium">Lunch Service</span>
            <span className="text-emerald-600 font-mono text-[11px]">• 1,200 Dining</span>
          </div>

          {/* Quick Actions */}
          <Link href="/forecast">
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs gap-1.5 text-xs font-medium h-8"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-200" />
              <span className="hidden sm:inline">New Forecast</span>
              <span className="sm:hidden">Predict</span>
            </Button>
          </Link>

          <Link href="/entry">
            <Button
              size="sm"
              variant="outline"
              className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 gap-1.5 text-xs font-medium h-8"
            >
              <PlusCircle className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden md:inline">Log Kitchen Entry</span>
              <span className="md:hidden">Log</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
