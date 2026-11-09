"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"
import { Utensils, IndianRupee, CloudSun, Leaf, LucideIcon } from "lucide-react"

type Props = {
  title: string
  value: number
  suffix?: string
  prefix?: string
}

const KPI_CONFIGS: Record<
  string,
  { icon: LucideIcon; color: string; bg: string; subtitle: string }
> = {
  "Food Saved": {
    icon: Leaf,
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-100",
    subtitle: "Diverted from waste landfills",
  },
  "Meals Saved": {
    icon: Utensils,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-100",
    subtitle: "Equivalent nutritious portions",
  },
  "Money Saved": {
    icon: IndianRupee,
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-100",
    subtitle: "Direct procurement savings",
  },
  "CO₂ Avoided": {
    icon: CloudSun,
    color: "text-teal-600",
    bg: "bg-teal-50 border-teal-100",
    subtitle: "Greenhouse emissions prevented",
  },
}

export function AnimatedKpi({ title, value, suffix = "", prefix = "" }: Props) {
  const config = KPI_CONFIGS[title] || {
    icon: Leaf,
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-100",
    subtitle: "Optimized through AI demand matching",
  }
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/80 hover:shadow-lg hover:shadow-emerald-500/5"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/30 via-teal-500/40 to-emerald-600/20 group-hover:from-emerald-500 group-hover:to-teal-500 transition-all duration-300" />

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div
          className={`p-2 rounded-xl border transition-all duration-300 group-hover:scale-110 ${config.bg}`}
        >
          <Icon className={`h-4 w-4 ${config.color}`} />
        </div>
      </div>

      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-mono flex items-baseline">
          {prefix && <span className="mr-0.5 text-xl font-normal text-slate-600">{prefix}</span>}
          <Counter to={value || 0} />
          {suffix && <span className="ml-1 text-base font-semibold text-slate-600">{suffix}</span>}
        </div>
        <p className="mt-1 text-xs text-slate-500 line-clamp-1">{config.subtitle}</p>
      </div>
    </motion.div>
  )
}

function Counter({ to }: { to: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString())

  useEffect(() => {
    const controls = animate(count, to, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
    })

    return controls.stop
  }, [to, count])

  return <motion.span>{rounded}</motion.span>
}
