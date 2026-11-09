"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cpu, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react"

interface StatusProps {
  last_trained_at: string
  entries_since_last_train: number
  should_retrain: boolean
}

export function ModelRetrainCard({
  status,
  onRetrain,
  loading,
}: {
  status: StatusProps
  onRetrain: () => void
  loading: boolean
}) {
  return (
    <Card className="rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-indigo-50/40 via-white to-slate-50/50 p-6 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-indigo-100/60">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-slate-900">
                XGBoost Model Continuous Learning
              </CardTitle>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  status.should_retrain
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}
              >
                {status.should_retrain ? (
                  <>
                    <AlertCircle className="h-3 w-3 text-amber-600" />
                    Retrain Recommended
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    Optimal Fit
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Online model parameter updates based on newly ingested kitchen entries
            </p>
          </div>
        </div>

        <Button
          onClick={onRetrain}
          disabled={loading || (!status.should_retrain && !loading)}
          className={`gap-2 text-xs font-semibold shadow-xs ${
            status.should_retrain
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
          }`}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Re-fitting Estimators…" : "Retrain XGBoost Model"}
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 text-xs font-mono">
        <div className="p-3 rounded-xl bg-white border border-slate-100">
          <p className="text-[10px] font-sans font-semibold text-slate-400 uppercase">Last Retrained</p>
          <p className="text-slate-800 font-semibold mt-1 truncate" title={status.last_trained_at}>
            {status.last_trained_at ? new Date(status.last_trained_at).toLocaleString() : "Never"}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-white border border-slate-100">
          <p className="text-[10px] font-sans font-semibold text-slate-400 uppercase">New Ingested Records</p>
          <p className="text-slate-800 font-semibold mt-1 flex items-center gap-1.5">
            <span className="text-base font-bold text-indigo-600">
              {status.entries_since_last_train || 0}
            </span>
            <span className="text-slate-400 text-[10px]">records</span>
          </p>
        </div>

        <div className="p-3 rounded-xl bg-white border border-slate-100 col-span-2 sm:col-span-1">
          <p className="text-[10px] font-sans font-semibold text-slate-400 uppercase">Retrain Threshold</p>
          <p className="text-slate-800 font-semibold mt-1">
            ≥ 5 new kitchen records
          </p>
        </div>
      </div>
    </Card>
  )
}
