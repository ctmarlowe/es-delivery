import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const engagements = await prisma.engagement.findMany({
      include: {
        customer: true,
        deliveryPlans: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(engagements)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch engagements" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, packageHours, customerId, startDate, endDate, createdByName } = body

    if (!name || !packageHours || !customerId) {
      return NextResponse.json(
        { error: "Name, packageHours, and customerId are required" },
        { status: 400 }
      )
    }

    const engagement = await prisma.engagement.create({
      data: {
        name,
        packageHours: parseFloat(packageHours),
        customerId,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        createdByName,
      },
      include: {
        customer: true,
      },
    })

    return NextResponse.json(engagement, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create engagement" },
      { status: 500 }
    )
  }
}

