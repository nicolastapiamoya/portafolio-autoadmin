import { auth } from "@/auth"
import { getAllSiteConfigs, setSiteConfig } from "@/lib/cms"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const configs = await getAllSiteConfigs()
  return NextResponse.json(configs)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { key, value, description } = body

  if (!key || value === undefined) {
    return NextResponse.json({ error: "Key and value are required" }, { status: 400 })
  }

  await setSiteConfig(key, value, description)
  return NextResponse.json({ ok: true }, { status: 201 })
}
