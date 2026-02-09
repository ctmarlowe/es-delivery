"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Clock } from "lucide-react"

interface Topic {
  id: string
  name: string
  color?: string
}

interface LibraryItem {
  id: string
  title: string
  description?: string
  defaultHours: number
  topics: Topic[]
}

export default function LibraryPage() {
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    defaultHours: "",
    topicIds: [] as string[],
    createdByName: "",
  })

  useEffect(() => {
    fetchLibraryItems()
    fetchTopics()
  }, [])

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
    const url = editingItem
      ? `/api/library/${editingItem.id}`
      : "/api/library"
    const method = editingItem ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        defaultHours: parseFloat(formData.defaultHours),
        topicIds: formData.topicIds,
      }),
    })

    if (res.ok) {
      setIsDialogOpen(false)
      setEditingItem(null)
      setFormData({
        title: "",
        description: "",
        defaultHours: "",
        topicIds: [],
        createdByName: "",
      })
      fetchLibraryItems()
    }
  }

  const handleEdit = (item: LibraryItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description || "",
      defaultHours: item.defaultHours.toString(),
      topicIds: item.topics.map((t) => t.id),
      createdByName: "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this library item?")) {
      const res = await fetch(`/api/library/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchLibraryItems()
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Library</h1>
          <p className="text-muted-foreground">
            Manage reusable session templates
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingItem(null)
            setFormData({
              title: "",
              description: "",
              defaultHours: "",
              topicIds: [],
              createdByName: "",
            })
            setIsDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Library Item
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {libraryItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              {item.description && (
                <CardDescription>{item.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{item.defaultHours}h</span>
                  <span className="text-muted-foreground">default</span>
                </div>
                {item.topics.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {item.topics.map((topic) => (
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
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
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
              {editingItem ? "Edit Library Item" : "Add Library Item"}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Update library item information"
                : "Create a reusable session template"}
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
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="defaultHours">Default Hours</Label>
              <Input
                id="defaultHours"
                type="number"
                step="0.01"
                value={formData.defaultHours}
                onChange={(e) =>
                  setFormData({ ...formData, defaultHours: e.target.value })
                }
                required
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
            {!editingItem && (
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
                {editingItem ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

