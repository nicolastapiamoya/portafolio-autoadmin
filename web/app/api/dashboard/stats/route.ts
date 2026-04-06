import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/cms"
import { getAllPostsAdmin } from "@/lib/posts"

export async function GET() {
  const session = await auth()
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const [posts, experiences, projects, socials, configs] = await Promise.all([
      getAllPostsAdmin(),
      prisma.experience.count(),
      prisma.project.count(),
      prisma.socialLink.count(),
      prisma.siteConfig.count(),
    ])

    const publishedPosts = posts.filter((p) => p.published).length
    const draftPosts = posts.filter((p) => !p.published).length

    return NextResponse.json({
      posts: {
        total: posts.length,
        published: publishedPosts,
        draft: draftPosts,
      },
      experiences,
      projects,
      socials,
      configs,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return new NextResponse("Error fetching stats", { status: 500 })
  }
}
