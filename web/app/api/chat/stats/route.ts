import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getChatStats, getRecentChats } from "@/lib/chat"

export async function GET() {
  const session = await auth()
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const [stats, recentChats] = await Promise.all([
      getChatStats(),
      getRecentChats(10),
    ])

    return NextResponse.json({
      ...stats,
      recentChats,
    })
  } catch (error) {
    console.error("Chat stats error:", error)
    return new NextResponse("Error fetching stats", { status: 500 })
  }
}
