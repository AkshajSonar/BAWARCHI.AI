import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface Props {
  title: string
  value: string
  subtitle?: string
  icon?: LucideIcon
  colorClass?: string
  trend?: {
    value: string
    isPositive?: boolean
    label?: string
  }
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  colorClass = "text-emerald-600 bg-emerald-50 border-emerald-100",
  trend,
}: Props) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/80 hover:shadow-lg hover:shadow-emerald-500/5">
      {/* Top subtle gradient highlight */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/30 via-teal-500/40 to-emerald-600/20 group-hover:from-emerald-500 group-hover:to-teal-500 transition-all duration-300" />

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div
            className={`p-2 rounded-xl border transition-all duration-300 group-hover:scale-110 ${colorClass}`}
          >
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-mono">
          {value}
        </div>
        
        {subtitle && (
          <p className="mt-1 text-xs text-slate-500 line-clamp-1">{subtitle}</p>
        )}

        {trend && (
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium">
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded font-mono font-semibold ${
                trend.isPositive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {trend.value}
            </span>
            {trend.label && (
              <span className="text-slate-400">{trend.label}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
