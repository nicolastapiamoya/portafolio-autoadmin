import { auth } from "@/auth"
import { createPost } from "@/lib/posts"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { title, content, excerpt, tags } = body

  if (!title || !content) {
    return NextResponse.json(
      { error: "Title and content are required" },
      { status: 400 }
    )
  }

  const slug = await createPost({
    title,
    content,
    excerpt: excerpt ?? "",
    tags: Array.isArray(tags) ? tags : [],
  })

  return NextResponse.json({ slug }, { status: 201 })
}
