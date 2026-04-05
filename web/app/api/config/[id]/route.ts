import { auth } from "@/auth"
import { deleteSiteConfig } from "@/lib/cms"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const configId = parseInt(id)
  if (isNaN(configId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  await deleteSiteConfig(configId)
  return NextResponse.json({ ok: true })
}
