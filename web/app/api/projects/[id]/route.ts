import { auth } from "@/auth"
import { getProjectById, updateProject, deleteProject } from "@/lib/cms"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const projectId = parseInt(id)
  if (isNaN(projectId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  const project = await getProjectById(projectId)
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(project)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const projectId = parseInt(id)
  if (isNaN(projectId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  const body = await req.json()
  const { title, slug, description, techStack, demoUrl, repoUrl, imageUrl, featured, order } = body

  if (!title || !description || !slug) {
    return NextResponse.json({ error: "Title, description and slug are required" }, { status: 400 })
  }

  await updateProject(projectId, {
    title,
    slug,
    description,
    techStack: Array.isArray(techStack) ? techStack : [],
    demoUrl: demoUrl ?? "",
    repoUrl: repoUrl ?? "",
    imageUrl: imageUrl ?? "",
    featured: featured ?? false,
    order: order ?? 0,
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const projectId = parseInt(id)
  if (isNaN(projectId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  await deleteProject(projectId)
  return NextResponse.json({ ok: true })
}
