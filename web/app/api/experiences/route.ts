import { auth } from "@/auth"
import { getAllExperiences, createExperience } from "@/lib/cms"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const experiences = await getAllExperiences()
  return NextResponse.json(experiences)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { company, role, location, startDate, endDate, current, description, techStack, order } = body

  if (!company || !role || !startDate) {
    return NextResponse.json({ error: "Company, role and startDate are required" }, { status: 400 })
  }

  const id = await createExperience({
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

  return NextResponse.json({ id }, { status: 201 })
}
