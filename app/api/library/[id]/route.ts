import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const libraryItem = await prisma.libraryItem.findUnique({
      where: { id },
      include: {
        topics: true,
        sessions: true,
      },
    })

    if (!libraryItem) {
      return NextResponse.json(
        { error: "Library item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(libraryItem)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch library item" },
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
    const { title, description, defaultHours, topicIds } = body

    const updateData: any = {}
    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (defaultHours !== undefined) updateData.defaultHours = parseFloat(defaultHours)

    const libraryItem = await prisma.libraryItem.update({
      where: { id },
      data: {
        ...updateData,
        topics: topicIds
          ? {
              set: topicIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: {
        topics: true,
      },
    })

    return NextResponse.json(libraryItem)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update library item" },
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
    await prisma.libraryItem.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete library item" },
      { status: 500 }
    )
  }
}

