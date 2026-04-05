import { auth } from "@/auth"
import { getAllProjects, createProject } from "@/lib/cms"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const projects = await getAllProjects()
  return NextResponse.json(projects)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { title, description, techStack, demoUrl, repoUrl, imageUrl, featured, order } = body

  if (!title || !description) {
    return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
  }

  const slug = await createProject({
    title,
    description,
    techStack: Array.isArray(techStack) ? techStack : [],
    demoUrl: demoUrl ?? "",
    repoUrl: repoUrl ?? "",
    imageUrl: imageUrl ?? "",
    featured: featured ?? false,
    order: order ?? 0,
  })

  return NextResponse.json({ slug }, { status: 201 })
}
