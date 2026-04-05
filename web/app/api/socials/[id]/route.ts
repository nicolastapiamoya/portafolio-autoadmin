import { auth } from "@/auth"
import { updateSocialLink, deleteSocialLink } from "@/lib/cms"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const socialId = parseInt(id)
  if (isNaN(socialId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  const body = await req.json()
  const { platform, url, icon, order, active } = body

  if (!platform || !url) {
    return NextResponse.json({ error: "Platform and url are required" }, { status: 400 })
  }

  await updateSocialLink(socialId, {
    platform,
    url,
    icon: icon ?? "",
    order: order ?? 0,
    active: active ?? true,
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const socialId = parseInt(id)
  if (isNaN(socialId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  await deleteSocialLink(socialId)
  return NextResponse.json({ ok: true })
}
