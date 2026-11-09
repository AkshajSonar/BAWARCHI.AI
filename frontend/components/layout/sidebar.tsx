"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Brain,
  ClipboardList,
  BarChart3,
  Package,
  Users,
  Leaf,
  Database,
  Radio,
  HeartHandshake,
  Cpu,
  ChevronRight,
  X,
} from "lucide-react"

interface NavItem {
  name: string
  href: string
  icon: any
  badge?: string
  badgeColor?: string
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: "OPERATIONS",
    items: [
      { name: "Live Overview", href: "/", icon: Radio, badge: "Live", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      { name: "Meal Forecast", href: "/forecast", icon: Brain, badge: "AI", badgeColor: "bg-teal-50 text-teal-700 border-teal-200" },
      { name: "Kitchen Entry", href: "/entry", icon: ClipboardList },
    ],
  },
  {
    label: "FOOD RESCUE",
    items: [
      { name: "Surplus Radar", href: "/surplus", icon: Package },
      { name: "NGO Pickup Hub", href: "/ngo-dashboard", icon: HeartHandshake, badge: "NGO", badgeColor: "bg-amber-50 text-amber-700 border-amber-200" },
      { name: "Partner NGOs", href: "/ngos", icon: Users },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      { name: "Admin Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Impact & ML Telemetry", href: "/impact", icon: BarChart3 },
    ],
  },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-20 h-screen w-72 flex-col justify-between border-r border-slate-200/80 bg-white/95 backdrop-blur-md px-4 py-5 transition-transform duration-300 ease-in-out md:translate-x-0 flex shrink-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <Link href="/" className="flex items-center gap-2.5 group" onClick={onClose}>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    Bawarchi<span className="text-emerald-600">AI</span>
                  </h2>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-emerald-100/70 text-emerald-800">
                    v2.4
                  </span>
                </div>
                <p className="text-[10px] font-medium text-slate-400 tracking-wider uppercase">
                  Zero-Waste Canteen Planner
                </p>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Groups */}
          <nav className="space-y-5 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
            {navGroups.map((group) => (
              <div key={group.label} className="space-y-1">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-150 ${
                          isActive
                            ? "bg-gradient-to-r from-emerald-50 to-teal-50/50 text-emerald-900 font-semibold shadow-xs"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        {/* Active vertical bar */}
                        {isActive && (
                          <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-emerald-600" />
                        )}

                        <div className="flex items-center gap-3">
                          <item.icon
                            className={`h-4 w-4 transition-colors ${
                              isActive
                                ? "text-emerald-600"
                                : "text-slate-400 group-hover:text-slate-700"
                            }`}
                          />
                          <span>{item.name}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {item.badge && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase font-mono ${
                                item.badgeColor || "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                          {isActive && (
                            <ChevronRight className="h-3.5 w-3.5 text-emerald-600" />
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* System Telemetry Footer */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          {/* Supabase status */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50/80 border border-slate-100 text-[11px] font-mono text-slate-600">
            <div className="flex items-center gap-2">
              <Database className="h-3.5 w-3.5 text-emerald-600" />
              <span>Database:</span>
            </div>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          </div>

          {/* ML Engine Status */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-50/50 border border-emerald-100/60 text-[11px] font-mono text-slate-600">
            <div className="flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5 text-teal-600" />
              <span>ML Engine:</span>
            </div>
            <span className="font-semibold text-teal-700 text-[10px]">
              XGBoost · 94.2% R²
            </span>
          </div>
        </div>
      </aside>
    </>
  )
}
