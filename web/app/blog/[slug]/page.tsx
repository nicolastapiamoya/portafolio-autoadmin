import { notFound } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MermaidInit from "@/components/MermaidInit"
import { getPostBySlug } from "@/lib/posts"
import { remark } from "remark"
import remarkHtml from "remark-html"
import { ArrowLeft, Calendar, Tag } from "lucide-react"

export const dynamic = "force-dynamic"

async function markdownToHtml(markdown: string) {
  const result = await remark().use(remarkHtml, { sanitize: false }).process(markdown)
  const html = result.toString()
  return html.replace(
    /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
    (_, code) => `<div class="mermaid">${code.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")}</div>`
  )
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  let post = null
  try {
    post = await getPostBySlug(slug)
  } catch {
    // DB unavailable
  }
  if (!post) notFound()

  const contentHtml = await markdownToHtml(post.content)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-page pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-sm text-[#8b949e] hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            cd ../blog
          </Link>

          {/* Post header */}
          <div className="terminal-window mb-8">
            <div className="terminal-header">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]/70" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/70" />
                <div className="w-3 h-3 rounded-full bg-[#28c940]/70" />
              </div>
              <span className="text-[#8b949e] text-xs font-mono">
                {post.slug}.md
              </span>
              <div className="w-14" />
            </div>
            <div className="terminal-body p-6">
              <p className="font-mono text-[var(--green-dim)] text-sm mb-3">
                $ cat {post.slug}.md
              </p>
              <h1 className="font-mono font-bold text-white text-2xl sm:text-3xl leading-snug mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5 font-mono text-xs text-[#8b949e]">
                  <Calendar size={12} />
                  {new Date(post.date).toLocaleDateString("es-CL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                {post.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Tag size={12} className="text-[#8b949e]" />
                    {post.tags.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Post content */}
          <MermaidInit />
          <div
            className="prose-terminal font-mono text-sm leading-relaxed text-[#e6edf3]"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
            style={{
              ["--tw-prose-body" as string]: "#e6edf3",
            }}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
