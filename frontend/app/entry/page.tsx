"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function EntryPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

const [form, setForm] = useState({
  meal_type: "lunch",
  dish_name: "",
  dish_type: "veg",
  total_students: 1200,
  prepared_qty: "",
  leftover_qty: "",

  is_special: 0,
  is_exam_day: 0,
  is_holiday: 0,
  is_break: 0,
  is_event_day: 0,
})

  async function handleSubmit() {
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      const res = await fetch("http://localhost:8080/kitchen/entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          prepared_qty: Number(form.prepared_qty),
          leftover_qty: Number(form.leftover_qty),
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Failed to save entry")
      }

      setSuccess(true)
      setForm({
        ...form,
        dish_name: "",
        prepared_qty: "",
        leftover_qty: "",
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Kitchen Entry</h1>
        <p className="text-slate-600">
          Record prepared and leftover quantities after the meal.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meal Data</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {/* Meal Type */}
          <div>
            <Label>Meal Type</Label>
            <Select
              value={form.meal_type}
              onValueChange={(v) =>
                setForm({ ...form, meal_type: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dish Name */}
          <div>
            <Label>Dish Name</Label>
            <Input
              placeholder="e.g. Rice"
              value={form.dish_name}
              onChange={(e) =>
                setForm({ ...form, dish_name: e.target.value })
              }
            />
          </div>

          {/* Dish Type */}
          <div>
            <Label>Dish Type</Label>
            <Select
              value={form.dish_type}
              onValueChange={(v) =>
                setForm({ ...form, dish_type: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="veg">Veg</SelectItem>
                <SelectItem value="egg">Egg</SelectItem>
                <SelectItem value="nonveg">Non‑Veg</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Total Students */}
          <div>
            <Label>Total Students</Label>
            <Input
              type="number"
              value={form.total_students}
              onChange={(e) =>
                setForm({
                  ...form,
                  total_students: Number(e.target.value),
                })
              }
            />
          </div>
          <div className="md:col-span-2 space-y-3">
  <Label>Day Context</Label>

  {[
    { key: "is_special", label: "Special Dish" },
    { key: "is_exam_day", label: "Exam Day" },
    { key: "is_holiday", label: "Holiday" },
    { key: "is_break", label: "Break" },
    { key: "is_event_day", label: "Event Day" },
  ].map(({ key, label }) => (
    <div key={key} className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={form[key as keyof typeof form] === 1}
        onChange={(e) =>
          setForm({
            ...form,
            [key]: e.target.checked ? 1 : 0,
          })
        }
      />
      <span className="text-sm">{label}</span>
    </div>
  ))}
</div>


          {/* Prepared */}
          <div>
            <Label>Prepared Quantity (kg)</Label>
            <Input
              type="number"
              placeholder="e.g. 200"
              value={form.prepared_qty}
              onChange={(e) =>
                setForm({
                  ...form,
                  prepared_qty: e.target.value,
                })
              }
            />
          </div>

          {/* Leftover */}
          <div>
            <Label>Leftover Quantity (kg)</Label>
            <Input
              type="number"
              placeholder="e.g. 25"
              value={form.leftover_qty}
              onChange={(e) =>
                setForm({
                  ...form,
                  leftover_qty: e.target.value,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Saving…" : "Save Entry"}
      </Button>

      {success && (
        <Alert>
          <AlertDescription>
            Entry saved successfully. This data will improve future predictions.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
