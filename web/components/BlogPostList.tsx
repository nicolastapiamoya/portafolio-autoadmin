"use client"
import { useState, useMemo } from "react"
import Link from "next/link"
import { Calendar, Tag, LayoutList, LayoutGrid, Search, X } from "lucide-react"
import type { Post } from "@/lib/posts"

export default function BlogPostList({ posts }: { posts: Post[] }) {
  const [view, setView] = useState<"list" | "grid">("list")
  const [query, setQuery] = useState("")
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [posts])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return posts.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      const matchesTag = !activeTag || p.tags.includes(activeTag)
      return matchesQuery && matchesTag
    })
  }, [posts, query, activeTag])

  return (
    <>
      {/* Search bar */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título, tag o contenido..."
          className="input-terminal w-full pl-9 pr-9 py-2 text-sm"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-white"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Tag filters */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setActiveTag(null)}
            className={`font-mono text-xs px-2.5 py-1 border transition-colors ${
              activeTag === null
                ? "border-[rgba(var(--green-rgb),0.5)] text-accent bg-[rgba(var(--green-rgb),0.07)]"
                : "border-[rgba(139,148,158,0.2)] text-[#8b949e] hover:text-accent hover:border-[rgba(var(--green-rgb),0.3)]"
            }`}
          >
            todos
          </button>
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag(activeTag === t ? null : t)}
              className={`font-mono text-xs px-2.5 py-1 border transition-colors ${
                activeTag === t
                  ? "border-[rgba(var(--green-rgb),0.5)] text-accent bg-[rgba(var(--green-rgb),0.07)]"
                  : "border-[rgba(139,148,158,0.2)] text-[#8b949e] hover:text-accent hover:border-[rgba(var(--green-rgb),0.3)]"
              }`}
            >
              #{t}
            </button>
          ))}
        </div>
      )}

      {/* Results count + view toggle */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-xs text-[#8b949e]">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          {(query || activeTag) && (
            <button
              onClick={() => { setQuery(""); setActiveTag(null) }}
              className="ml-3 text-accent hover:underline"
            >
              limpiar filtros
            </button>
          )}
        </span>
        {/* View toggle */}
        <div className="flex items-center gap-1">
        <button
          onClick={() => setView("list")}
          title="Vista lista"
          className={`p-1.5 border transition-colors ${
            view === "list"
              ? "border-[rgba(var(--green-rgb),0.5)] text-accent bg-[rgba(var(--green-rgb),0.07)]"
              : "border-transparent text-[#8b949e] hover:text-accent"
          }`}
        >
          <LayoutList size={16} />
        </button>
        <button
          onClick={() => setView("grid")}
          title="Vista cuadrícula"
          className={`p-1.5 border transition-colors ${
            view === "grid"
              ? "border-[rgba(var(--green-rgb),0.5)] text-accent bg-[rgba(var(--green-rgb),0.07)]"
              : "border-transparent text-[#8b949e] hover:text-accent"
          }`}
        >
          <LayoutGrid size={16} />
        </button>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <p className="font-mono text-[#8b949e] text-sm py-8 text-center">
          No se encontraron posts para{" "}
          <span className="text-accent">"{query || activeTag}"</span>.
        </p>
      )}

      {/* List view */}
      {view === "list" && filtered.length > 0 && (
        <div className="space-y-5">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="blog-card p-6 rounded group"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="font-mono font-bold text-white text-lg group-hover:text-accent transition-colors leading-snug">
                  {post.title}
                </h2>
                <span className="shrink-0 font-mono text-[var(--green-dim)] text-xs border border-[rgba(var(--green-rgb),0.2)] px-2 py-1">
                  [post]
                </span>
              </div>

              <p className="font-mono text-[#8b949e] text-sm leading-relaxed mb-4">
                {post.excerpt}
              </p>

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
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Grid view */}
      {view === "grid" && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="blog-card p-5 rounded group flex flex-col"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="font-mono text-[var(--green-dim)] text-xs border border-[rgba(var(--green-rgb),0.2)] px-2 py-0.5 shrink-0">
                  [post]
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-[#8b949e]">
                  <Calendar size={11} />
                  {new Date(post.date).toLocaleDateString("es-CL", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <h2 className="font-mono font-bold text-white text-base group-hover:text-accent transition-colors leading-snug mb-3 flex-1">
                {post.title}
              </h2>

              <p className="font-mono text-[#8b949e] text-xs leading-relaxed mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {post.tags.slice(0, 3).map((t) => (
                    <span key={t} className="tag text-[10px] px-1.5 py-0">{t}</span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="font-mono text-[10px] text-[#8b949e]">+{post.tags.length - 3}</span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
