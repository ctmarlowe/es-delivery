"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"

interface Topic {
  id: string
  name: string
  color: string
}

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    color: "#3b82f6",
    createdByName: "",
  })

  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    const res = await fetch("/api/topics")
    const data = await res.json()
    setTopics(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingTopic
      ? `/api/topics/${editingTopic.id}`
      : "/api/topics"
    const method = editingTopic ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      setIsDialogOpen(false)
      setEditingTopic(null)
      setFormData({
        name: "",
        color: "#3b82f6",
        createdByName: "",
      })
      fetchTopics()
    }
  }

  const handleEdit = (topic: Topic) => {
    setEditingTopic(topic)
    setFormData({
      name: topic.name,
      color: topic.color,
      createdByName: "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this topic?")) {
      const res = await fetch(`/api/topics/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchTopics()
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Topics</h1>
          <p className="text-muted-foreground">
            Manage categorization tags
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingTopic(null)
            setFormData({
              name: "",
              color: "#3b82f6",
              createdByName: "",
            })
            setIsDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Topic
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <Card key={topic.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: topic.color }}
                />
                <CardTitle>{topic.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(topic)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(topic.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTopic ? "Edit Topic" : "Add Topic"}
            </DialogTitle>
            <DialogDescription>
              {editingTopic
                ? "Update topic information"
                : "Create a new categorization tag"}
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
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="w-20 h-10"
                />
                <Input
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  placeholder="#3b82f6"
                />
              </div>
            </div>
            {!editingTopic && (
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
                {editingTopic ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

