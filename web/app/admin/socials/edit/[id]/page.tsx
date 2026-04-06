"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send } from "lucide-react"

interface SocialLink {
  id: number
  platform: string
  url: string
  icon: string
  order: number
  active: boolean
}

interface EditSocialFormProps {
  social: SocialLink
}

function EditSocialForm({ social }: EditSocialFormProps) {
  const router = useRouter()
  const [platform, setPlatform] = useState(social.platform)
  const [url, setUrl] = useState(social.url)
  const [active, setActive] = useState(social.active)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/socials/${social.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, url, active }),
      })

      if (!res.ok) throw new Error("Error al actualizar")
      router.push("/admin/socials")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="terminal-window">
      <div className="terminal-header">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]/70" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/70" />
          <div className="w-3 h-3 rounded-full bg-[#28c940]/70" />
        </div>
        <span className="text-[#8b949e] text-xs font-mono">edit_social.sh</span>
        <div className="w-14" />
      </div>

      <div className="terminal-body p-6 space-y-4">
        {error && (
          <p className="font-mono text-red-400 text-xs border border-red-900/50 bg-red-900/10 px-3 py-2">
            ✗ {error}
          </p>
        )}

        <div>
          <label className="font-mono text-[#8b949e] text-xs block mb-1.5">platform:</label>
          <input
            type="text"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            placeholder="github"
            className="input-terminal w-full"
            required
          />
        </div>

        <div>
          <label className="font-mono text-[#8b949e] text-xs block mb-1.5">url:</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/username"
            className="input-terminal w-full"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="active"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="accent-[var(--green)]"
          />
          <label htmlFor="active" className="font-mono text-[#8b949e] text-xs">activo</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-terminal"
          >
            <Send size={14} />
            {loading ? "guardando..." : "guardar cambios"}
          </button>
          <Link href="/admin/socials" className="btn-terminal-outline">
            cancelar
          </Link>
        </div>
      </div>
    </form>
  )
}

export default function EditSocialPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="min-h-screen bg-page pt-8 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Link href="/admin/socials" className="inline-flex items-center gap-2 font-mono text-sm text-[#8b949e] hover:text-accent transition-colors">
            <ArrowLeft size={14} />
            cd ../socials
          </Link>
        </div>

        <div className="font-mono text-[var(--green-dim)] text-sm mb-2">$ nano social.md</div>
        <h1 className="text-2xl font-mono font-bold text-white mb-8">
          <span className="text-accent">//</span> editar red social
        </h1>

        <SocialLoader id={params.then(p => p.id)} />
      </div>
    </main>
  )
}

function SocialLoader({ id }: { id: Promise<string> }) {
  const [social, setSocial] = useState<SocialLink | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useState(() => {
    id.then(async (resolvedId) => {
      try {
        const res = await fetch(`/api/socials/${resolvedId}`)
        if (!res.ok) throw new Error("No encontrado")
        const data = await res.json()
        setSocial(data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error cargando red social")
      } finally {
        setLoading(false)
      }
    })
  })

  if (loading) return <p className="font-mono text-[#8b949e] text-sm">cargando...</p>
  if (error) return <p className="font-mono text-red-400 text-sm">✗ {error}</p>
  if (!social) return <p className="font-mono text-[#8b949e] text-sm">Red social no encontrada</p>

  return <EditSocialForm social={social} />
}
