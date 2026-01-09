"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function ModelRetrainCard({
  status,
  onRetrain,
  loading,
}: {
  status: {
    last_trained_at: string
    entries_since_last_train: number
    should_retrain: boolean
  }
  onRetrain: () => void
  loading: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Training Status</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-sm text-slate-600">
          Last trained:{" "}
          <span className="font-medium text-slate-900">
            {new Date(status.last_trained_at).toLocaleString()}
          </span>
        </div>

        <div className="text-sm text-slate-600">
          New entries since training:{" "}
          <span className="font-medium text-slate-900">
            {status.entries_since_last_train}
          </span>
        </div>

        <Badge variant={status.should_retrain ? "destructive" : "secondary"}>
          {status.should_retrain ? "Retrain recommended" : "Model up‑to‑date"}
        </Badge>

        <Button
          onClick={onRetrain}
          disabled={loading || !status.should_retrain}
        >
          {loading ? "Retraining…" : "Retrain Model"}
        </Button>
      </CardContent>
    </Card>
  )
}
