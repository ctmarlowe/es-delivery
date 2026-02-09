import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        deliveryPlan: {
          include: {
            engagement: {
              include: {
                customer: true,
              },
            },
          },
        },
        libraryItem: true,
        topics: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(sessions)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      plannedHours,
      actualHours,
      scheduledDate,
      deliveryPlanId,
      libraryItemId,
      topicIds,
      createdByName,
    } = body

    if (!title || !plannedHours || !deliveryPlanId) {
      return NextResponse.json(
        { error: "Title, plannedHours, and deliveryPlanId are required" },
        { status: 400 }
      )
    }

    // Validate hours don't exceed engagement package hours
    const deliveryPlan = await prisma.deliveryPlan.findUnique({
      where: { id: deliveryPlanId },
      include: {
        engagement: true,
        sessions: true,
      },
    })

    if (!deliveryPlan) {
      return NextResponse.json(
        { error: "Delivery plan not found" },
        { status: 404 }
      )
    }

    const totalPlannedHours = deliveryPlan.sessions.reduce(
      (sum, s) => sum + parseFloat(s.plannedHours.toString()),
      0
    )
    const newTotal = totalPlannedHours + parseFloat(plannedHours)

    if (newTotal > parseFloat(deliveryPlan.engagement.packageHours.toString())) {
      return NextResponse.json(
        {
          error: `Total planned hours (${newTotal}) exceeds package hours (${deliveryPlan.engagement.packageHours})`,
        },
        { status: 400 }
      )
    }

    const session = await prisma.session.create({
      data: {
        title,
        description,
        plannedHours: parseFloat(plannedHours),
        actualHours: actualHours ? parseFloat(actualHours) : null,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        deliveryPlanId,
        libraryItemId: libraryItemId || null,
        topics: topicIds
          ? {
              connect: topicIds.map((id: string) => ({ id })),
            }
          : undefined,
        createdByName,
      },
      include: {
        deliveryPlan: {
          include: {
            engagement: {
              include: {
                customer: true,
              },
            },
          },
        },
        libraryItem: true,
        topics: true,
      },
    })

    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    )
  }
}

