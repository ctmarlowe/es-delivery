import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const topics = await prisma.topic.findMany({
      orderBy: {
        name: "asc",
      },
    })
    return NextResponse.json(topics)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, color, createdByName } = body

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    const topic = await prisma.topic.create({
      data: {
        name,
        color: color || "#3b82f6",
        createdByName,
      },
    })

    return NextResponse.json(topic, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create topic" },
      { status: 500 }
    )
  }
}

