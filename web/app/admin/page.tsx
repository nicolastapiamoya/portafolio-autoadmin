import { getAllPostsAdmin, type Post } from "@/lib/posts"
import Link from "next/link"
import { ArrowLeft, FilePlus, Pencil, Eye, EyeOff } from "lucide-react"
import AdminLogout from "@/components/AdminLogout"
import AdminDeleteButton from "@/components/AdminDeleteButton"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  let posts: Post[] = []
  try {
    posts = await getAllPostsAdmin()
  } catch {
    posts = []
  }

  return (
    <main className="min-h-screen bg-page pt-8 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-sm text-[#8b949e] hover:text-accent transition-colors"
          >
            <ArrowLeft size={14} />
            cd ~/home
          </Link>
          <AdminLogout />
        </div>

        {/* Header */}
        <div className="font-mono text-[var(--green-dim)] text-sm mb-2">$ ls -la posts/</div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-mono font-bold text-white">
            <span className="text-accent">//</span> posts
          </h1>
          <Link
            href="/admin/new"
            className="btn-terminal inline-flex items-center gap-2 text-sm"
          >
            <FilePlus size={14} />
            nuevo post
          </Link>
        </div>

        {/* Posts list */}
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]/70" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/70" />
              <div className="w-3 h-3 rounded-full bg-[#28c940]/70" />
            </div>
            <span className="text-[#8b949e] text-xs font-mono">posts.db — {posts.length} registros</span>
            <div className="w-14" />
          </div>

          <div className="terminal-body divide-y divide-[rgba(var(--green-rgb),0.08)]">
            {posts.length === 0 ? (
              <p className="p-6 font-mono text-[#8b949e] text-sm">
                No hay posts aún. <Link href="/admin/new" className="text-accent hover:underline">Crear el primero →</Link>
              </p>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="p-4 flex items-start justify-between gap-4 hover:bg-[rgba(var(--green-rgb),0.03)] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {post.published ? (
                        <Eye size={12} className="text-accent shrink-0" />
                      ) : (
                        <EyeOff size={12} className="text-[#8b949e] shrink-0" />
                      )}
                      <span className="font-mono text-white text-sm truncate">{post.title}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-mono text-[#8b949e] text-xs">
                        {new Date(post.date).toLocaleDateString("es-CL")}
                      </span>
                      <div className="flex gap-1 flex-wrap">
                        {post.tags.map((t) => (
                          <span key={t} className="tag text-[10px] px-1.5 py-0">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="font-mono text-xs text-[#8b949e] hover:text-accent transition-colors px-2 py-1 border border-transparent hover:border-[rgba(var(--green-rgb),0.3)]"
                    >
                      ver
                    </Link>
                    <Link
                      href={`/admin/edit/${post.id}`}
                      className="inline-flex items-center gap-1 font-mono text-xs text-[#8b949e] hover:text-accent transition-colors px-2 py-1 border border-[rgba(var(--green-rgb),0.2)] hover:border-[var(--green)]"
                    >
                      <Pencil size={11} />
                      editar
                    </Link>
                    <AdminDeleteButton id={post.id} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
