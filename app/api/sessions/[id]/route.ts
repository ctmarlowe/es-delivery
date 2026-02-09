import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await prisma.session.findUnique({
      where: { id: params.id },
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

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(session)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      plannedHours,
      actualHours,
      scheduledDate,
      topicIds,
    } = body

    const session = await prisma.session.findUnique({
      where: { id: params.id },
      include: {
        deliveryPlan: {
          include: {
            engagement: true,
            sessions: true,
          },
        },
      },
    })

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    // Validate hours if plannedHours is being updated
    if (plannedHours !== undefined) {
      const otherSessions = session.deliveryPlan.sessions.filter(
        (s) => s.id !== params.id
      )
      const totalPlannedHours = otherSessions.reduce(
        (sum, s) => sum + parseFloat(s.plannedHours.toString()),
        0
      )
      const newTotal = totalPlannedHours + parseFloat(plannedHours)

      if (newTotal > parseFloat(session.deliveryPlan.engagement.packageHours.toString())) {
        return NextResponse.json(
          {
            error: `Total planned hours (${newTotal}) exceeds package hours (${session.deliveryPlan.engagement.packageHours})`,
          },
          { status: 400 }
        )
      }
    }

    const updateData: any = {}
    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (plannedHours !== undefined) updateData.plannedHours = parseFloat(plannedHours)
    if (actualHours !== undefined) updateData.actualHours = actualHours ? parseFloat(actualHours) : null
    if (scheduledDate !== undefined) updateData.scheduledDate = scheduledDate ? new Date(scheduledDate) : null

    const updatedSession = await prisma.session.update({
      where: { id: params.id },
      data: {
        ...updateData,
        topics: topicIds
          ? {
              set: topicIds.map((id: string) => ({ id })),
            }
          : undefined,
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

    return NextResponse.json(updatedSession)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.session.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    )
  }
}

