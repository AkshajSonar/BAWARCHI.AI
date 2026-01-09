"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAllSurplusEvents } from "@/lib/api1/surplus"
import { SurplusEvent } from "@/lib/types"
import { RefreshCw } from "lucide-react"

export default function SurplusPage() {
  const [events, setEvents] = useState<SurplusEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)
      const data = await getAllSurplusEvents()
      setEvents(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      load(true)
    }, 5000)

    return () => clearInterval(interval)
  }, [load])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      available: "default",
      reserved: "secondary",
      expired: "destructive",
    }
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
        Loading surplus events...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-destructive">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Surplus Events</h1>
          <p className="text-slate-600">
            View all leftover food available for redistribution
          </p>
        </div>
        <Button
          onClick={() => load(true)}
          disabled={refreshing || loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Surplus Events</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              No surplus events found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dish Name</TableHead>
                  <TableHead>Meal Type</TableHead>
                  <TableHead>Quantity (kg)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Accepted NGO</TableHead>
                  <TableHead>Expiry Time</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">
                      {event.dish_name}
                    </TableCell>
                    <TableCell className="capitalize">
                      {event.meal_type}
                    </TableCell>
                    <TableCell>{event.quantity_kg} kg</TableCell>
                    <TableCell>
                      {isExpired(event.expires_at) && event.status === "available"
                        ? getStatusBadge("expired")
                        : getStatusBadge(event.status)}
                    </TableCell>
                    <TableCell>
                      {event.accepted_by_ngo_id
                        ? `NGO #${event.accepted_by_ngo_id}`
                        : "-"}
                    </TableCell>
                    <TableCell
                      className={
                        isExpired(event.expires_at)
                          ? "text-red-600"
                          : "text-slate-600"
                      }
                    >
                      {formatDate(event.expires_at)}
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {formatDate(event.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
