"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Send, Plus, X } from "lucide-react"

interface PostFormProps {
  mode: "create" | "edit"
  initialData?: {
    id?: number
    title?: string
    excerpt?: string
    content?: string
    tags?: string[]
    published?: boolean
  }
}

export default function PostForm({ mode, initialData = {} }: PostFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData.title ?? "")
  const [content, setContent] = useState(initialData.content ?? "")
  const [excerpt, setExcerpt] = useState(initialData.excerpt ?? "")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>(initialData.tags ?? [])
  const [published, setPublished] = useState(initialData.published ?? true)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  function addTag() {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setTagInput("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      const url = mode === "edit" ? `/api/posts/${initialData.id}` : "/api/posts"
      const method = mode === "edit" ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, excerpt, tags, published }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error al guardar")
      setSuccess(mode === "edit" ? "Post actualizado correctamente." : `Post publicado: /blog/${data.slug}`)
      if (mode === "create") {
        setTitle(""); setContent(""); setExcerpt(""); setTags([])
      }
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]/70" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/70" />
          <div className="w-3 h-3 rounded-full bg-[#28c940]/70" />
        </div>
        <span className="text-[#8b949e] text-xs font-mono">
          {mode === "edit" ? "edit_post.md — INSERT" : "new_post.md — INSERT"}
        </span>
        <div className="w-14" />
      </div>

      <form onSubmit={handleSubmit} className="terminal-body p-6 space-y-5">
        {/* Title */}
        <div>
          <label className="font-mono text-accent text-xs block mb-1.5">title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título del post"
            required
            className="input-terminal"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="font-mono text-accent text-xs block mb-1.5">
            excerpt: <span className="text-[#8b949e]">(resumen breve)</span>
          </label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Breve descripción del post..."
            className="input-terminal"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="font-mono text-accent text-xs block mb-1.5">tags:</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag() }
              }}
              placeholder="tag + Enter"
              className="input-terminal flex-1"
            />
            <button type="button" onClick={addTag} className="btn-terminal-outline px-3 flex items-center">
              <Plus size={14} />
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((t) => (
                <span
                  key={t}
                  onClick={() => setTags(tags.filter((x) => x !== t))}
                  className="tag inline-flex items-center gap-1.5 cursor-pointer hover:border-red-500 hover:text-red-400 transition-colors"
                >
                  {t}<X size={10} />
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="font-mono text-accent text-xs block mb-1.5">
            content: <span className="text-[#8b949e]">(markdown)</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={"# Mi Post\n\nEscribe aquí en **Markdown**..."}
            required
            rows={18}
            className="input-terminal resize-y leading-relaxed"
          />
        </div>

        {/* Published toggle */}
        <div className="flex items-center gap-3">
          <label className="font-mono text-accent text-xs">published:</label>
          <button
            type="button"
            onClick={() => setPublished(!published)}
            className={`font-mono text-xs px-3 py-1 border transition-colors ${
              published
                ? "text-accent border-[rgba(var(--green-rgb),0.4)] bg-[rgba(var(--green-rgb),0.05)]"
                : "text-[#8b949e] border-[rgba(139,148,158,0.2)]"
            }`}
          >
            {published ? "true" : "false"}
          </button>
        </div>

        {/* Feedback */}
        {error && (
          <p className="font-mono text-red-400 text-xs border border-red-900/50 bg-red-900/10 px-3 py-2">
            ✗ {error}
          </p>
        )}
        {success && (
          <div className="font-mono text-accent text-xs border border-[rgba(var(--green-rgb),0.3)] bg-[rgba(var(--green-rgb),0.05)] px-3 py-2">
            <p>✓ {success}</p>
            <Link href="/admin" className="underline hover:text-white transition-colors mt-1 inline-block">
              ← volver a posts
            </Link>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-terminal flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={14} />
          {loading ? "guardando..." : mode === "edit" ? "./save.sh" : "./publish.sh"}
        </button>
      </form>
    </div>
  )
}
