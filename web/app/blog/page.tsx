import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { getAllPosts, type Post } from "@/lib/posts"
import { ArrowLeft } from "lucide-react"
import BlogPostList from "@/components/BlogPostList"

export const dynamic = "force-dynamic"

export default async function BlogPage() {
  let posts: Post[] = []
  try {
    posts = await getAllPosts()
  } catch {
    // DB unavailable (no local PostgreSQL) — render empty state
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-page pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          {/* Header */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            cd ~/home
          </Link>

          <div className="font-mono text-[var(--green-dim)] text-sm mb-2">
            $ ls -la blog/
          </div>
          <h1 className="text-3xl font-mono font-bold text-primary mb-2">
            <span className="text-accent">//</span> blog
          </h1>
          <p className="font-mono text-muted text-sm mb-10">
            {posts.length} post{posts.length !== 1 ? "s" : ""} encontrado
            {posts.length !== 1 ? "s" : ""}
          </p>

          <div className="sep-line mb-10" />

          {posts.length === 0 ? (
            <div className="terminal-window p-8 text-center">
              <p className="font-mono text-[var(--green-dim)] text-sm mb-2">
                $ cat empty.txt
              </p>
              <p className="font-mono text-muted">
                No hay posts todavía. ¡Pronto habrá contenido!
              </p>
              <p className="font-mono text-accent mt-3 cursor-blink">_</p>
            </div>
          ) : (
            <BlogPostList posts={posts} />
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
