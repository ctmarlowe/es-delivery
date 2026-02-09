import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const deliveryPlan = await prisma.deliveryPlan.findUnique({
      where: { id },
      include: {
        engagement: {
          include: {
            customer: true,
          },
        },
        sessions: {
          include: {
            libraryItem: true,
            topics: true,
          },
        },
      },
    })

    if (!deliveryPlan) {
      return NextResponse.json(
        { error: "Delivery plan not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(deliveryPlan)
  } catch (error) {
    console.error("Error fetching delivery plan:", error)
    return NextResponse.json(
      { error: "Failed to fetch delivery plan", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, status } = body

    const updateData: any = {}
    if (title) updateData.title = title
    if (status) updateData.status = status

    const deliveryPlan = await prisma.deliveryPlan.update({
      where: { id },
      data: updateData,
      include: {
        engagement: {
          include: {
            customer: true,
          },
        },
        sessions: true,
      },
    })

    return NextResponse.json(deliveryPlan)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update delivery plan" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.deliveryPlan.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete delivery plan" },
      { status: 500 }
    )
  }
}

