import { prisma } from "@/lib/posts"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import AdminLogout from "@/components/AdminLogout"
import PostForm from "@/components/PostForm"

export const dynamic = "force-dynamic"

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const postId = parseInt(id)
  if (isNaN(postId)) notFound()

  const post = await prisma.post.findUnique({ where: { id: postId } }).catch(() => null)
  if (!post) notFound()

  return (
    <main className="min-h-screen bg-page pt-8 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 font-mono text-sm text-[#8b949e] hover:text-accent transition-colors"
          >
            <ArrowLeft size={14} />
            cd ~/admin
          </Link>
          <AdminLogout />
        </div>

        <div className="font-mono text-[var(--green-dim)] text-sm mb-2">$ vim {post.slug}.md</div>
        <h1 className="text-2xl font-mono font-bold text-white mb-8">
          <span className="text-accent">//</span> editar post
        </h1>

        <PostForm
          mode="edit"
          initialData={{
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            tags: post.tags,
            published: post.published,
          }}
        />
      </div>
    </main>
  )
}
