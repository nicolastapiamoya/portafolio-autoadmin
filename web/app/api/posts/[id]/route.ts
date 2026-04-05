import { auth } from "@/auth"
import { updatePost, deletePost } from "@/lib/posts"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const postId = parseInt(id)
  if (isNaN(postId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  const body = await req.json()
  const { title, content, excerpt, tags, published } = body

  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
  }

  const slug = await updatePost(postId, {
    title,
    content,
    excerpt: excerpt ?? "",
    tags: Array.isArray(tags) ? tags : [],
    published: published ?? true,
  })

  return NextResponse.json({ slug })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const postId = parseInt(id)
  if (isNaN(postId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  await deletePost(postId)
  return NextResponse.json({ ok: true })
}
