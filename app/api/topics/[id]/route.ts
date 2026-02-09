import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const topic = await prisma.topic.findUnique({
      where: { id: params.id },
      include: {
        libraryItems: true,
        sessions: true,
      },
    })

    if (!topic) {
      return NextResponse.json(
        { error: "Topic not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(topic)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch topic" },
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
    const { name, color } = body

    const updateData: any = {}
    if (name) updateData.name = name
    if (color) updateData.color = color

    const topic = await prisma.topic.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(topic)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update topic" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.topic.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete topic" },
      { status: 500 }
    )
  }
}

