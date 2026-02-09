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
import { Plus, Edit, Trash2, BookOpen, ArrowRight } from "lucide-react"
import Link from "next/link"

interface Engagement {
  id: string
  name: string
  packageHours: number
  customer: {
    id: string
    name: string
  }
}

interface DeliveryPlan {
  id: string
  title: string
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "ARCHIVED"
  engagement: Engagement
  sessions?: { id: string; plannedHours: number }[]
}

const statusColors = {
  DRAFT: "bg-gray-100 text-gray-800",
  ACTIVE: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  ARCHIVED: "bg-gray-200 text-gray-600",
}

export default function DeliveryPlansPage() {
  const [deliveryPlans, setDeliveryPlans] = useState<DeliveryPlan[]>([])
  const [engagements, setEngagements] = useState<Engagement[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<DeliveryPlan | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    status: "DRAFT",
    engagementId: "",
    createdByName: "",
  })

  useEffect(() => {
    fetchDeliveryPlans()
    fetchEngagements()
  }, [])

  const fetchDeliveryPlans = async () => {
    const res = await fetch("/api/delivery-plans")
    const data = await res.json()
    setDeliveryPlans(data)
  }

  const fetchEngagements = async () => {
    const res = await fetch("/api/engagements")
    const data = await res.json()
    setEngagements(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingPlan
      ? `/api/delivery-plans/${editingPlan.id}`
      : "/api/delivery-plans"
    const method = editingPlan ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      setIsDialogOpen(false)
      setEditingPlan(null)
      setFormData({
        title: "",
        status: "DRAFT",
        engagementId: "",
        createdByName: "",
      })
      fetchDeliveryPlans()
    }
  }

  const handleEdit = (plan: DeliveryPlan) => {
    setEditingPlan(plan)
    setFormData({
      title: plan.title,
      status: plan.status,
      engagementId: plan.engagement.id,
      createdByName: "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this delivery plan?")) {
      const res = await fetch(`/api/delivery-plans/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchDeliveryPlans()
      }
    }
  }

  const calculateTotalHours = (sessions?: { plannedHours: number }[]) => {
    if (!sessions) return 0
    return sessions.reduce(
      (sum, s) => sum + parseFloat(s.plannedHours.toString()),
      0
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Delivery Plans</h1>
          <p className="text-muted-foreground">
            Manage delivery plans for engagements
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingPlan(null)
            setFormData({
              title: "",
              status: "DRAFT",
              engagementId: "",
              createdByName: "",
            })
            setIsDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Delivery Plan
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {deliveryPlans.map((plan) => {
          const totalHours = calculateTotalHours(plan.sessions)
          const remainingHours =
            parseFloat(plan.engagement.packageHours.toString()) - totalHours

          return (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="flex-1">{plan.title}</CardTitle>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${statusColors[plan.status]}`}
                  >
                    {plan.status}
                  </span>
                </div>
                <CardDescription>
                  {plan.engagement.customer.name} • {plan.engagement.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Planned:</span>
                      <span className="font-medium">{totalHours.toFixed(2)}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Remaining:</span>
                      <span
                        className={`font-medium ${
                          remainingHours < 0 ? "text-red-600" : ""
                        }`}
                      >
                        {remainingHours.toFixed(2)}h
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Package:</span>
                      <span className="font-medium">
                        {plan.engagement.packageHours}h
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {plan.sessions?.length || 0} session(s)
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/delivery-plans/${plan.id}`}>
                    <Button variant="outline" size="sm" className="flex-1">
                      <BookOpen className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(plan)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(plan.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? "Edit Delivery Plan" : "Add Delivery Plan"}
            </DialogTitle>
            <DialogDescription>
              {editingPlan
                ? "Update delivery plan information"
                : "Create a new delivery plan"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="engagementId">Engagement</Label>
              <Select
                id="engagementId"
                value={formData.engagementId}
                onChange={(e) =>
                  setFormData({ ...formData, engagementId: e.target.value })
                }
                required
                disabled={!!editingPlan}
              >
                <option value="">Select an engagement</option>
                {engagements.map((engagement) => (
                  <option key={engagement.id} value={engagement.id}>
                    {engagement.customer.name} - {engagement.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                required
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="ARCHIVED">Archived</option>
              </Select>
            </div>
            {!editingPlan && (
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
                {editingPlan ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

