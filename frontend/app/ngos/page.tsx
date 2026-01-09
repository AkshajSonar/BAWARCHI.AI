"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

type NGO = {
  id: number
  name: string
  email: string
  phone?: string
  accepts_veg: boolean
  accepts_nonveg: boolean
  is_active: boolean
  total_pickups?: number
  total_redistributed_kg?: number
  last_pickup_date?: string
}

export default function NGOsPage() {
  const [ngos, setNgos] = useState<NGO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        // For now, we'll use mock data since the backend doesn't have this endpoint yet
        // In production, this would be: const res = await fetch(`${API_BASE}/ngos`)
        const mockNGOs: NGO[] = [
          {
            id: 1,
            name: "Food for All Foundation",
            email: "contact@foodforall.org",
            phone: "+91 98765 43210",
            accepts_veg: true,
            accepts_nonveg: false,
            is_active: true,
            total_pickups: 15,
            total_redistributed_kg: 450,
            last_pickup_date: "2026-01-08",
          },
          {
            id: 2,
            name: "Community Kitchen Network",
            email: "info@communitykitchen.in",
            phone: "+91 98765 43211",
            accepts_veg: true,
            accepts_nonveg: true,
            is_active: true,
            total_pickups: 23,
            total_redistributed_kg: 680,
            last_pickup_date: "2026-01-09",
          },
          {
            id: 3,
            name: "Hope Meals",
            email: "hello@hopemeals.org",
            accepts_veg: true,
            accepts_nonveg: false,
            is_active: true,
            total_pickups: 8,
            total_redistributed_kg: 240,
            last_pickup_date: "2026-01-07",
          },
        ]
        setNgos(mockNGOs)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
        Loading NGO directory...
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
      <div>
        <h1 className="text-2xl font-semibold">NGO Directory</h1>
        <p className="text-slate-600">
          View NGO participation and redistribution statistics
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered NGOs</CardTitle>
        </CardHeader>
        <CardContent>
          {ngos.length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              No NGOs registered yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NGO Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Food Preferences</TableHead>
                  <TableHead>Total Pickups</TableHead>
                  <TableHead>Total Redistributed</TableHead>
                  <TableHead>Last Pickup</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ngos.map((ngo) => (
                  <TableRow key={ngo.id}>
                    <TableCell className="font-medium">{ngo.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">{ngo.email}</p>
                        {ngo.phone && (
                          <p className="text-sm text-slate-500">{ngo.phone}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {ngo.accepts_veg && (
                          <Badge variant="secondary">Veg</Badge>
                        )}
                        {ngo.accepts_nonveg && (
                          <Badge variant="secondary">Non-Veg</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{ngo.total_pickups || 0}</TableCell>
                    <TableCell>
                      {ngo.total_redistributed_kg || 0} kg
                    </TableCell>
                    <TableCell>
                      {ngo.last_pickup_date
                        ? new Date(ngo.last_pickup_date).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={ngo.is_active ? "default" : "secondary"}
                      >
                        {ngo.is_active ? "Active" : "Inactive"}
                      </Badge>
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
