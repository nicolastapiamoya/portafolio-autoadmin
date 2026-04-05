import { auth } from "@/auth"
import { getExperienceById, updateExperience, deleteExperience } from "@/lib/cms"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const experienceId = parseInt(id)
  if (isNaN(experienceId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  const experience = await getExperienceById(experienceId)
  if (!experience) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(experience)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const experienceId = parseInt(id)
  if (isNaN(experienceId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  const body = await req.json()
  const { company, role, location, startDate, endDate, current, description, techStack, order } = body

  if (!company || !role || !startDate) {
    return NextResponse.json({ error: "Company, role and startDate are required" }, { status: 400 })
  }

  await updateExperience(experienceId, {
    company,
    role,
    location: location ?? "",
    startDate,
    endDate: endDate ?? "",
    current: current ?? false,
    description: description ?? "",
    techStack: Array.isArray(techStack) ? techStack : [],
    order: order ?? 0,
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const experienceId = parseInt(id)
  if (isNaN(experienceId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  await deleteExperience(experienceId)
  return NextResponse.json({ ok: true })
}
