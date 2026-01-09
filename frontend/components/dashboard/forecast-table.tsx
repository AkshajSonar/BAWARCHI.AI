import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { ConfidenceBadge } from "./confidence-badge"

type Row = {
  dish: string
  meal: string
  expected: number
  recommended: number
  confidence: "high" | "medium" | "low"
}

export function ForecastTable({ rows }: { rows: Row[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Dish</TableHead>
          <TableHead>Meal</TableHead>
          <TableHead>Expected (kg)</TableHead>
          <TableHead>Recommended (kg)</TableHead>
          <TableHead>Confidence</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {rows.map((row, i) => (
          <TableRow key={i}>
            <TableCell>{row.dish}</TableCell>
            <TableCell>{row.meal}</TableCell>
            <TableCell>{row.expected}</TableCell>
            <TableCell className="font-medium">
              {row.recommended}
            </TableCell>
            <TableCell>
              <ConfidenceBadge level={row.confidence} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
