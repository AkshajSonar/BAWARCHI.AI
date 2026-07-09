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
} from "lucide-react"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Forecast", href: "/forecast", icon: Brain },
  { name: "Entry", href: "/entry", icon: ClipboardList },
  { name: "Surplus", href: "/surplus", icon: Package },
  { name: "NGOs", href: "/ngos", icon: Users },
  { name: "Impact", href: "/impact", icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-slate-100 bg-white px-4 py-6 flex flex-col justify-between min-h-screen">
      <div>
        <div className="flex items-center gap-2 mb-8">
          <Leaf className="h-6 w-6 text-emerald-500 fill-emerald-500/20" />
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Bawarchi<span className="text-emerald-500">AI</span>
            <span className="block text-[9px] font-medium text-slate-400 tracking-wider uppercase mt-0.5">
              Zero-Waste Kitchen Planner
            </span>
          </h2>
        </div>

        <nav className="space-y-1">
          {navItems.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-emerald-50/70 text-emerald-700 font-semibold border-l-4 border-emerald-500 rounded-l-none"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="border-t border-slate-100 pt-4 mt-auto">
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 px-3">
          <Database className="h-3 w-3 text-emerald-500" />
          <span>Supabase DB:</span>
          <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Connected
          </span>
        </div>
      </div>
    </aside>
  )
}
