"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Send, Plus, X } from "lucide-react"

interface ExperienceFormProps {
  mode: "create" | "edit"
  initialData?: {
    id?: number
    company?: string
    role?: string
    location?: string
    startDate?: string
    endDate?: string
    current?: boolean
    description?: string
    techStack?: string[]
    order?: number
  }
}

export default function ExperienceForm({ mode, initialData = {} }: ExperienceFormProps) {
  const router = useRouter()
  const [company, setCompany] = useState(initialData.company ?? "")
  const [role, setRole] = useState(initialData.role ?? "")
  const [location, setLocation] = useState(initialData.location ?? "")
  const [startDate, setStartDate] = useState(initialData.startDate ?? "")
  const [endDate, setEndDate] = useState(initialData.endDate ?? "")
  const [current, setCurrent] = useState(initialData.current ?? false)
  const [description, setDescription] = useState(initialData.description ?? "")
  const [techInput, setTechInput] = useState("")
  const [techStack, setTechStack] = useState<string[]>(initialData.techStack ?? [])
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
      const url = mode === "edit" ? `/api/experiences/${initialData.id}` : "/api/experiences"
      const method = mode === "edit" ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          role,
          location,
          startDate,
          endDate: current ? "" : endDate,
          current,
          description,
          techStack,
          order,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error al guardar")
      setSuccess(mode === "edit" ? "Experiencia actualizada correctamente." : "Experiencia creada correctamente.")
      if (mode === "create") {
        setCompany("")
        setRole("")
        setLocation("")
        setStartDate("")
        setEndDate("")
        setCurrent(false)
        setDescription("")
        setTechStack([])
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
          {mode === "edit" ? "edit_experience.md — INSERT" : "new_experience.md — INSERT"}
        </span>
        <div className="w-14" />
      </div>

      <form onSubmit={handleSubmit} className="terminal-body p-6 space-y-5">
        {/* Company */}
        <div>
          <label className="font-mono text-accent text-xs block mb-1.5">company:</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Nombre de la empresa"
            required
            className="input-terminal"
          />
        </div>

        {/* Role */}
        <div>
          <label className="font-mono text-accent text-xs block mb-1.5">role:</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Cargo / Rol"
            required
            className="input-terminal"
          />
        </div>

        {/* Location */}
        <div>
          <label className="font-mono text-accent text-xs block mb-1.5">location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ubicación (opcional)"
            className="input-terminal"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-accent text-xs block mb-1.5">startDate:</label>
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Ej: 2022-01 o Ene 2022"
              required
              className="input-terminal"
            />
          </div>
          <div>
            <label className="font-mono text-accent text-xs block mb-1.5">endDate:</label>
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Ej: 2024-12 o Dic 2024"
              disabled={current}
              className="input-terminal disabled:opacity-50"
            />
          </div>
        </div>

        {/* Current checkbox */}
        <div className="flex items-center gap-3">
          <label className="font-mono text-accent text-xs">current:</label>
          <button
            type="button"
            onClick={() => setCurrent(!current)}
            className={`font-mono text-xs px-3 py-1 border transition-colors ${
              current
                ? "text-accent border-[rgba(var(--green-rgb),0.4)] bg-[rgba(var(--green-rgb),0.05)]"
                : "text-[#8b949e] border-[rgba(139,148,158,0.2)]"
            }`}
          >
            {current ? "true" : "false"}
          </button>
        </div>

        {/* Description */}
        <div>
          <label className="font-mono text-accent text-xs block mb-1.5">description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción de las responsabilidades y logros..."
            required
            rows={6}
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
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTech() }
              }}
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
                <span
                  key={t}
                  onClick={() => setTechStack(techStack.filter((x) => x !== t))}
                  className="tag inline-flex items-center gap-1.5 cursor-pointer hover:border-red-500 hover:text-red-400 transition-colors"
                >
                  {t}<X size={10} />
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Order */}
        <div>
          <label className="font-mono text-accent text-xs block mb-1.5">order: <span className="text-[#8b949e]">(para ordenar, menor = primero)</span></label>
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
            <Link href="/admin/experiences" className="underline hover:text-white transition-colors mt-1 inline-block">
              ← volver a experiencias
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
