import { ShieldCheck, Zap, AlertTriangle } from "lucide-react"

export function ConfidenceBadge({ level }: { level: "high" | "medium" | "low" | string }) {
  const normLevel = (level || "medium").toLowerCase()

  if (normLevel === "high") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        <span>High (Reliable)</span>
      </span>
    )
  }

  if (normLevel === "low") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
        <span>Low (Volatile)</span>
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
      <Zap className="h-3.5 w-3.5 text-amber-600" />
      <span>Medium (Stable)</span>
    </span>
  )
}
