import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const libraryItems = await prisma.libraryItem.findMany({
      include: {
        topics: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(libraryItems)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch library items" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, defaultHours, topicIds, createdByName } = body

    if (!title || !defaultHours) {
      return NextResponse.json(
        { error: "Title and defaultHours are required" },
        { status: 400 }
      )
    }

    const libraryItem = await prisma.libraryItem.create({
      data: {
        title,
        description,
        defaultHours: parseFloat(defaultHours),
        topics: topicIds
          ? {
              connect: topicIds.map((id: string) => ({ id })),
            }
          : undefined,
        createdByName,
      },
      include: {
        topics: true,
      },
    })

    return NextResponse.json(libraryItem, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create library item" },
      { status: 500 }
    )
  }
}

