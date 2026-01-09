import { Badge } from "@/components/ui/badge"

export function ConfidenceBadge({ level }: { level: "high" | "medium" | "low" }) {
  const styles = {
    high: "bg-green-100 text-green-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-red-100 text-red-700",
  }

  return <Badge className={styles[level]}>{level.toUpperCase()}</Badge>
}
