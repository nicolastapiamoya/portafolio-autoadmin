import { auth } from "@/auth"
import { getAllSocialLinks, createSocialLink } from "@/lib/cms"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const socials = await getAllSocialLinks()
  return NextResponse.json(socials)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { platform, url, icon, order, active } = body

  if (!platform || !url) {
    return NextResponse.json({ error: "Platform and url are required" }, { status: 400 })
  }

  const id = await createSocialLink({
    platform,
    url,
    icon: icon ?? "",
    order: order ?? 0,
    active: active ?? true,
  })

  return NextResponse.json({ id }, { status: 201 })
}
