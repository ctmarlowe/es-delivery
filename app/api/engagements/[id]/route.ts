import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const engagement = await prisma.engagement.findUnique({
      where: { id },
      include: {
        customer: true,
        deliveryPlans: {
          include: {
            sessions: true,
          },
        },
      },
    })

    if (!engagement) {
      return NextResponse.json(
        { error: "Engagement not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(engagement)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch engagement" },
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
    const { name, packageHours, startDate, endDate } = body

    const updateData: any = {}
    if (name) updateData.name = name
    if (packageHours !== undefined) updateData.packageHours = parseFloat(packageHours)
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null

    const engagement = await prisma.engagement.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
      },
    })

    return NextResponse.json(engagement)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update engagement" },
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
    await prisma.engagement.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete engagement" },
      { status: 500 }
    )
  }
}

