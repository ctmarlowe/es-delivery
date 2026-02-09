import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Calendar, BookOpen, Library, Tag } from "lucide-react"
import { prisma } from "@/lib/prisma"

// Force dynamic rendering to prevent build-time database access
export const dynamic = 'force-dynamic'

export default async function Home() {
  // Wrap database calls in try-catch to handle build-time failures gracefully
  let customersCount = 0
  let engagementsCount = 0
  let plansCount = 0
  let libraryCount = 0
  let topicsCount = 0

  try {
    [customersCount, engagementsCount, plansCount, libraryCount, topicsCount] = await Promise.all([
      prisma.customer.count(),
      prisma.engagement.count(),
      prisma.deliveryPlan.count(),
      prisma.libraryItem.count(),
      prisma.topic.count(),
    ])
  } catch (error) {
    // During build or if database is unavailable, use default values
    console.error("Failed to fetch counts:", error)
  }

  const stats = [
    {
      title: "Customers",
      count: customersCount,
      icon: Package,
      href: "/customers",
      description: "Manage customer organizations",
    },
    {
      title: "Engagements",
      count: engagementsCount,
      icon: Calendar,
      href: "/engagements",
      description: "View consulting engagements",
    },
    {
      title: "Delivery Plans",
      count: plansCount,
      icon: BookOpen,
      href: "/delivery-plans",
      description: "Track delivery plans",
    },
    {
      title: "Library Items",
      count: libraryCount,
      icon: Library,
      href: "/library",
      description: "Reusable session templates",
    },
    {
      title: "Topics",
      count: topicsCount,
      icon: Tag,
      href: "/topics",
      description: "Categorization tags",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Delivery Plan Dashboard</h1>
        <p className="text-muted-foreground">
          Manage delivery plans for Expert Services engagements
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{stat.title}</CardTitle>
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardDescription>{stat.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.count}</div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

