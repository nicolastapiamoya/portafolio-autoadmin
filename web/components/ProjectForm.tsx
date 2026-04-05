"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Send, Plus, X } from "lucide-react"

interface ProjectFormProps {
  mode: "create" | "edit"
  initialData?: {
    id?: number
    title?: string
    slug?: string
    description?: string
    techStack?: string[]
    demoUrl?: string
    repoUrl?: string
    imageUrl?: string
    featured?: boolean
    order?: number
  }
}

export default function ProjectForm({ mode, initialData = {} }: ProjectFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData.title ?? "")
  const [slug, setSlug] = useState(initialData.slug ?? "")
  const [description, setDescription] = useState(initialData.description ?? "")
  const [techInput, setTechInput] = useState("")
  const [techStack, setTechStack] = useState<string[]>(initialData.techStack ?? [])
  const [demoUrl, setDemoUrl] = useState(initialData.demoUrl ?? "")
  const [repoUrl, setRepoUrl] = useState(initialData.repoUrl ?? "")
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl ?? "")
  const [featured, setFeatured] = useState(initialData.featured ?? false)
  const [order, setOrder] = useState(initialData.order ?? 0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  function addTech() {
    const t = techInput.trim()
    if (t && !techStack.includes(t)) setTechStack([...techStack, t])
    setTechInput("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      const url = mode === "edit" ? `/api/projects/${initialData.id}` : "/api/projects"
      const method = mode === "edit" ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: mode === "edit" ? slug : undefined,
          description,
          techStack,
          demoUrl,
          repoUrl,
          imageUrl,
          featured,
          order,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error al guardar")
      setSuccess(mode === "edit" ? "Proyecto actualizado correctamente." : `Proyecto creado: /projects/${data.slug}`)
      if (mode === "create") {
        setTitle("")
        setDescription("")
        setTechStack([])
        setDemoUrl("")
        setRepoUrl("")
        setImageUrl("")
        setFeatured(false)
        setOrder(0)
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
          {mode === "edit" ? "edit_project.md — INSERT" : "new_project.md — INSERT"}
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
            placeholder="Nombre del proyecto"
            required
            className="input-terminal"
          />
        </div>

        {/* Slug (solo en edit) */}
        {mode === "edit" && (
          <div>
            <label className="font-mono text-accent text-xs block mb-1.5">slug:</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="nombre-del-proyecto"
              required
              className="input-terminal"
            />
          </div>
        )}

        {/* Description */}
        <div>
          <label className="font-mono text-accent text-xs block mb-1.5">description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción del proyecto..."
            required
            rows={4}
            className="input-terminal resize-y leading-relaxed"
          />
        </div>

        {/* Tech Stack */}
        <div>
          <label className="font-mono text-accent text-xs block mb-1.5">techStack:</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTech() } }}
              placeholder="tecnología + Enter"
              className="input-terminal flex-1"
            />
            <button type="button" onClick={addTech} className="btn-terminal-outline px-3 flex items-center">
              <Plus size={14} />
            </button>
          </div>
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {techStack.map((t) => (
                <span key={t} onClick={() => setTechStack(techStack.filter((x) => x !== t))} className="tag inline-flex items-center gap-1.5 cursor-pointer hover:border-red-500 hover:text-red-400 transition-colors">
                  {t}<X size={10} />
                </span>
              ))}
            </div>
          )}
        </div>

        {/* URLs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-accent text-xs block mb-1.5">demoUrl:</label>
            <input
              type="url"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://..."
              className="input-terminal"
            />
          </div>
          <div>
            <label className="font-mono text-accent text-xs block mb-1.5">repoUrl:</label>
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="input-terminal"
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="font-mono text-accent text-xs block mb-1.5">imageUrl: <span className="text-[#8b949e]">(opcional)</span></label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://... o /images/..."
            className="input-terminal"
          />
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3">
          <label className="font-mono text-accent text-xs">featured:</label>
          <button
            type="button"
            onClick={() => setFeatured(!featured)}
            className={`font-mono text-xs px-3 py-1 border transition-colors ${
              featured
                ? "text-accent border-[rgba(var(--green-rgb),0.4)] bg-[rgba(var(--green-rgb),0.05)]"
                : "text-[#8b949e] border-[rgba(139,148,158,0.2)]"
            }`}
          >
            {featured ? "true" : "false"}
          </button>
        </div>

        {/* Order */}
        <div>
          <label className="font-mono text-accent text-xs block mb-1.5">order:</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
            className="input-terminal w-24"
          />
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
            <Link href="/admin/projects" className="underline hover:text-white transition-colors mt-1 inline-block">
              ← volver a proyectos
            </Link>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-terminal flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={14} />
          {loading ? "guardando..." : mode === "edit" ? "./save.sh" : "./create.sh"}
        </button>
      </form>
    </div>
  )
}
