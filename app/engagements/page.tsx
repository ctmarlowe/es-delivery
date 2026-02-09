"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Calendar } from "lucide-react"
import Link from "next/link"

interface Customer {
  id: string
  name: string
}

interface Engagement {
  id: string
  name: string
  packageHours: number
  startDate?: string
  endDate?: string
  customer: Customer
  deliveryPlans?: { id: string }[]
}

export default function EngagementsPage() {
  const [engagements, setEngagements] = useState<Engagement[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEngagement, setEditingEngagement] = useState<Engagement | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    packageHours: "",
    customerId: "",
    startDate: "",
    endDate: "",
    createdByName: "",
  })

  useEffect(() => {
    fetchEngagements()
    fetchCustomers()
  }, [])

  const fetchEngagements = async () => {
    const res = await fetch("/api/engagements")
    const data = await res.json()
    setEngagements(data)
  }

  const fetchCustomers = async () => {
    const res = await fetch("/api/customers")
    const data = await res.json()
    setCustomers(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingEngagement
      ? `/api/engagements/${editingEngagement.id}`
      : "/api/engagements"
    const method = editingEngagement ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      setIsDialogOpen(false)
      setEditingEngagement(null)
      setFormData({
        name: "",
        packageHours: "",
        customerId: "",
        startDate: "",
        endDate: "",
        createdByName: "",
      })
      fetchEngagements()
    }
  }

  const handleEdit = (engagement: Engagement) => {
    setEditingEngagement(engagement)
    setFormData({
      name: engagement.name,
      packageHours: engagement.packageHours.toString(),
      customerId: engagement.customer.id,
      startDate: engagement.startDate ? engagement.startDate.split("T")[0] : "",
      endDate: engagement.endDate ? engagement.endDate.split("T")[0] : "",
      createdByName: "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this engagement?")) {
      const res = await fetch(`/api/engagements/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchEngagements()
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Engagements</h1>
          <p className="text-muted-foreground">
            Manage consulting engagements
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingEngagement(null)
            setFormData({
              name: "",
              packageHours: "",
              customerId: "",
              startDate: "",
              endDate: "",
              createdByName: "",
            })
            setIsDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Engagement
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {engagements.map((engagement) => (
          <Card key={engagement.id}>
            <CardHeader>
              <CardTitle>{engagement.name}</CardTitle>
              <CardDescription>
                {engagement.customer.name} • {engagement.packageHours} hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {engagement.startDate && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(engagement.startDate).toLocaleDateString()}
                    {engagement.endDate &&
                      ` - ${new Date(engagement.endDate).toLocaleDateString()}`}
                  </div>
                )}
                <div className="text-sm">
                  {engagement.deliveryPlans?.length || 0} delivery plan(s)
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(engagement)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(engagement.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEngagement ? "Edit Engagement" : "Add Engagement"}
            </DialogTitle>
            <DialogDescription>
              {editingEngagement
                ? "Update engagement information"
                : "Create a new consulting engagement"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="customerId">Customer</Label>
              <Select
                id="customerId"
                value={formData.customerId}
                onChange={(e) =>
                  setFormData({ ...formData, customerId: e.target.value })
                }
                required
                disabled={!!editingEngagement}
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="packageHours">Package Hours</Label>
              <Input
                id="packageHours"
                type="number"
                step="0.01"
                value={formData.packageHours}
                onChange={(e) =>
                  setFormData({ ...formData, packageHours: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date (optional)</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date (optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>
            {!editingEngagement && (
              <div>
                <Label htmlFor="createdByName">Created By (optional)</Label>
                <Input
                  id="createdByName"
                  value={formData.createdByName}
                  onChange={(e) =>
                    setFormData({ ...formData, createdByName: e.target.value })
                  }
                />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingEngagement ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

