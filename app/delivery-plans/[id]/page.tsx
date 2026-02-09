"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, ArrowLeft, Clock, Calendar } from "lucide-react"
import Link from "next/link"

interface Topic {
  id: string
  name: string
  color?: string
}

interface LibraryItem {
  id: string
  title: string
  defaultHours: number
}

interface Session {
  id: string
  title: string
  description?: string
  plannedHours: number
  actualHours?: number
  scheduledDate?: string
  libraryItem?: LibraryItem
  topics: Topic[]
}

interface DeliveryPlan {
  id: string
  title: string
  status: string
  engagement?: {
    id: string
    name: string
    packageHours: number | string
    customer?: {
      name: string
    }
  }
  sessions?: Session[]
  error?: string
}

export default function DeliveryPlanDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [plan, setPlan] = useState<DeliveryPlan | null>(null)
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    plannedHours: "",
    actualHours: "",
    scheduledDate: "",
    libraryItemId: "",
    topicIds: [] as string[],
    createdByName: "",
  })

  useEffect(() => {
    if (params.id) {
      fetchDeliveryPlan()
      fetchLibraryItems()
      fetchTopics()
    }
  }, [params.id])

  const fetchDeliveryPlan = async () => {
    try {
      const res = await fetch(`/api/delivery-plans/${params.id}`)
      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        console.error("Failed to fetch delivery plan:", {
          status: res.status,
          statusText: res.statusText,
          error
        })
        setPlan({ 
          id: params.id as string, 
          title: "", 
          status: "", 
          error: error.error || `Failed to fetch delivery plan (${res.status})` 
        } as DeliveryPlan)
        return
      }
      const data = await res.json()
      console.log("Fetched delivery plan:", data)
      setPlan(data)
    } catch (error) {
      console.error("Error fetching delivery plan:", error)
      setPlan({ 
        id: params.id as string, 
        title: "", 
        status: "", 
        error: error instanceof Error ? error.message : "Failed to fetch delivery plan" 
      } as DeliveryPlan)
    }
  }

  const fetchLibraryItems = async () => {
    const res = await fetch("/api/library")
    const data = await res.json()
    setLibraryItems(data)
  }

  const fetchTopics = async () => {
    const res = await fetch("/api/topics")
    const data = await res.json()
    setTopics(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingSession
      ? `/api/sessions/${editingSession.id}`
      : "/api/sessions"
    const method = editingSession ? "PUT" : "POST"

    const payload = {
      ...formData,
      deliveryPlanId: params.id,
      plannedHours: parseFloat(formData.plannedHours),
      actualHours: formData.actualHours ? parseFloat(formData.actualHours) : null,
      libraryItemId: formData.libraryItemId || null,
      topicIds: formData.topicIds,
    }

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      setIsDialogOpen(false)
      setEditingSession(null)
      setFormData({
        title: "",
        description: "",
        plannedHours: "",
        actualHours: "",
        scheduledDate: "",
        libraryItemId: "",
        topicIds: [],
        createdByName: "",
      })
      fetchDeliveryPlan()
    } else {
      const error = await res.json()
      alert(error.error || "Failed to save session")
    }
  }

  const handleEdit = (session: Session) => {
    setEditingSession(session)
    setFormData({
      title: session.title,
      description: session.description || "",
      plannedHours: session.plannedHours.toString(),
      actualHours: session.actualHours?.toString() || "",
      scheduledDate: session.scheduledDate
        ? session.scheduledDate.split("T")[0]
        : "",
      libraryItemId: session.libraryItem?.id || "",
      topicIds: session.topics.map((t) => t.id),
      createdByName: "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this session?")) {
      const res = await fetch(`/api/sessions/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchDeliveryPlan()
      }
    }
  }

  const handleLibraryItemSelect = (libraryItemId: string) => {
    const item = libraryItems.find((li) => li.id === libraryItemId)
    if (item) {
      setFormData({
        ...formData,
        libraryItemId,
        title: item.title,
        plannedHours: item.defaultHours.toString(),
      })
    }
  }

  if (!plan) {
    return <div>Loading...</div>
  }

  if (plan.error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-600">{plan.error}</p>
        <Link href="/delivery-plans">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Delivery Plans
          </Button>
        </Link>
      </div>
    )
  }

  if (!plan.engagement) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Error: Engagement data not found</h1>
        <p className="text-muted-foreground mb-4">
          The delivery plan exists but the engagement information is missing.
        </p>
        <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto mb-4">
          {JSON.stringify(plan, null, 2)}
        </pre>
        <Link href="/delivery-plans">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Delivery Plans
          </Button>
        </Link>
      </div>
    )
  }

  const sessions = plan.sessions || []
  const totalPlannedHours = sessions.reduce(
    (sum, s) => sum + parseFloat(s.plannedHours.toString()),
    0
  )
  const totalActualHours = sessions.reduce(
    (sum, s) => sum + (s.actualHours ? parseFloat(s.actualHours.toString()) : 0),
    0
  )
  const packageHours = parseFloat(plan.engagement.packageHours?.toString() || "0")
  const remainingHours = packageHours - totalPlannedHours

  return (
    <div>
      <div className="mb-8">
        <Link href="/delivery-plans">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Delivery Plans
          </Button>
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">{plan.title}</h1>
            <p className="text-muted-foreground">
              {plan.engagement.customer?.name || "Unknown"} • {plan.engagement.name}
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingSession(null)
              setFormData({
                title: "",
                description: "",
                plannedHours: "",
                actualHours: "",
                scheduledDate: "",
                libraryItemId: "",
                topicIds: [],
                createdByName: "",
              })
              setIsDialogOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Session
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Package Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {packageHours}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Planned Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPlannedHours.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Remaining Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${
                remainingHours < 0 ? "text-red-600" : ""
              }`}
            >
              {remainingHours.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Sessions</h2>
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No sessions yet. Add your first session to get started.
            </CardContent>
          </Card>
        ) : (
          sessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle>{session.title}</CardTitle>
                    {session.description && (
                      <CardDescription className="mt-2">
                        {session.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(session)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(session.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Planned</div>
                    <div className="text-lg font-semibold">
                      <Clock className="h-4 w-4 inline mr-1" />
                      {session.plannedHours}h
                    </div>
                  </div>
                  {session.actualHours && (
                    <div>
                      <div className="text-sm text-muted-foreground">Actual</div>
                      <div className="text-lg font-semibold">
                        {session.actualHours}h
                      </div>
                    </div>
                  )}
                  {session.scheduledDate && (
                    <div>
                      <div className="text-sm text-muted-foreground">Scheduled</div>
                      <div className="text-lg font-semibold">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {new Date(session.scheduledDate).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  {session.libraryItem && (
                    <div>
                      <div className="text-sm text-muted-foreground">From Library</div>
                      <div className="text-sm font-medium">
                        {session.libraryItem.title}
                      </div>
                    </div>
                  )}
                </div>
                {session.topics.length > 0 && (
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {session.topics.map((topic) => (
                      <span
                        key={topic.id}
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: topic.color || "#3b82f6",
                          color: "white",
                        }}
                      >
                        {topic.name}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSession ? "Edit Session" : "Add Session"}
            </DialogTitle>
            <DialogDescription>
              {editingSession
                ? "Update session information"
                : "Create a new session for this delivery plan"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="libraryItemId">From Library (optional)</Label>
              <Select
                id="libraryItemId"
                value={formData.libraryItemId}
                onChange={(e) => handleLibraryItemSelect(e.target.value)}
              >
                <option value="">None</option>
                {libraryItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} ({item.defaultHours}h)
                  </option>
                ))}
              </Select>
            </div>
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
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plannedHours">Planned Hours</Label>
                <Input
                  id="plannedHours"
                  type="number"
                  step="0.01"
                  value={formData.plannedHours}
                  onChange={(e) =>
                    setFormData({ ...formData, plannedHours: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="actualHours">Actual Hours (optional)</Label>
                <Input
                  id="actualHours"
                  type="number"
                  step="0.01"
                  value={formData.actualHours}
                  onChange={(e) =>
                    setFormData({ ...formData, actualHours: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="scheduledDate">Scheduled Date (optional)</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) =>
                  setFormData({ ...formData, scheduledDate: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Topics (optional)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                {topics.map((topic) => (
                  <label key={topic.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.topicIds.includes(topic.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            topicIds: [...formData.topicIds, topic.id],
                          })
                        } else {
                          setFormData({
                            ...formData,
                            topicIds: formData.topicIds.filter(
                              (id) => id !== topic.id
                            ),
                          })
                        }
                      }}
                    />
                    <span className="text-sm">{topic.name}</span>
                  </label>
                ))}
              </div>
            </div>
            {!editingSession && (
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
                {editingSession ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

