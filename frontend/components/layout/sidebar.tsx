"use client"

import Link from "next/link"
import {
  LayoutDashboard,
  Brain,
  ClipboardList,
  BarChart3
} from "lucide-react"

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Forecast", href: "/forecast", icon: Brain },
  { name: "Entry", href: "/entry", icon: ClipboardList },
  { name: "Impact", href: "/impact", icon: BarChart3 },
]

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white px-4 py-6">
      <h2 className="mb-8 text-xl font-bold text-slate-900">
        Bawarchi<span className="text-indigo-600">AI</span>
      </h2>

      <nav className="space-y-2">
        {navItems.map(item => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100"
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
