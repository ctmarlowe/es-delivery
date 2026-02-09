import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const deliveryPlans = await prisma.deliveryPlan.findMany({
      include: {
        engagement: {
          include: {
            customer: true,
          },
        },
        sessions: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(deliveryPlans)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch delivery plans" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, status, engagementId, createdByName } = body

    if (!title || !engagementId) {
      return NextResponse.json(
        { error: "Title and engagementId are required" },
        { status: 400 }
      )
    }

    const deliveryPlan = await prisma.deliveryPlan.create({
      data: {
        title,
        status: status || "DRAFT",
        engagementId,
        createdByName,
      },
      include: {
        engagement: {
          include: {
            customer: true,
          },
        },
      },
    })

    return NextResponse.json(deliveryPlan, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create delivery plan" },
      { status: 500 }
    )
  }
}

