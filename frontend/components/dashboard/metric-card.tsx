import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface Props {
  title: string
  value: string
  subtitle?: string
  icon?: LucideIcon
  colorClass?: string
}

export function MetricCard({ title, value, subtitle, icon: Icon, colorClass = "text-slate-500 bg-slate-50" }: Props) {
  return (
    <Card className="hover:shadow-md transition-all duration-300 border-slate-100 hover:border-emerald-200 group relative overflow-hidden bg-white">
      {/* Subtle top indicator bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/30 to-emerald-600/10 group-hover:from-emerald-500 group-hover:to-teal-600 transition-all duration-300" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</CardTitle>
        {Icon && (
          <div className={`p-1.5 rounded-lg transition-colors duration-300 ${colorClass}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-800 tracking-tight">{value}</div>
        {subtitle && (
          <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
}
