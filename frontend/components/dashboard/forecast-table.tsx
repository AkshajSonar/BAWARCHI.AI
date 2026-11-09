import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { ConfidenceBadge } from "./confidence-badge"
import { Utensils, ChefHat } from "lucide-react"

type Row = {
  dish: string
  meal: string
  expected: number
  recommended: number
  confidence: "high" | "medium" | "low" | string
}

export function ForecastTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
      <Table>
        <TableHeader className="bg-slate-50/80">
          <TableRow className="border-b border-slate-200">
            <TableHead className="font-semibold text-slate-700">Dish Name</TableHead>
            <TableHead className="font-semibold text-slate-700">Meal Service</TableHead>
            <TableHead className="font-semibold text-slate-700">Expected (Demand)</TableHead>
            <TableHead className="font-semibold text-slate-700">Recommended (Cook Target)</TableHead>
            <TableHead className="font-semibold text-slate-700">Model Confidence</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row, i) => {
            const buffer = Math.round((row.recommended - row.expected) * 10) / 10
            return (
              <TableRow
                key={i}
                className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 last:border-b-0"
              >
                <TableCell className="font-semibold text-slate-900">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      {row.dish.charAt(0)}
                    </div>
                    <span>{row.dish}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                    {row.meal}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 font-mono text-slate-700 font-medium">
                    <Utensils className="h-3.5 w-3.5 text-amber-500" />
                    <span>{row.expected} kg</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 font-mono font-bold text-emerald-700">
                      <ChefHat className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{row.recommended} kg</span>
                    </div>
                    {buffer > 0 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                        +{buffer}kg buffer
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <ConfidenceBadge level={row.confidence} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
