"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, X } from "lucide-react"

interface Social {
  id: number
  platform: string
  url: string
  icon: string
  order: number
  active: boolean
}

export default function SocialsManager({ socials: initialSocials }: { socials: Social[] }) {
  const router = useRouter()
  const [socials, setSocials] = useState(initialSocials)
  const [newPlatform, setNewPlatform] = useState("")
  const [newUrl, setNewUrl] = useState("")
  const [newIcon, setNewIcon] = useState("")
  const [loading, setLoading] = useState(false)

  async function addSocial() {
    if (!newPlatform || !newUrl) return
    setLoading(true)
    await fetch("/api/socials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform: newPlatform.toLowerCase(),
        url: newUrl,
        icon: newIcon,
        order: socials.length,
        active: true,
      }),
    })
    setNewPlatform("")
    setNewUrl("")
    setNewIcon("")
    setLoading(false)
    router.refresh()
  }

  async function toggleActive(social: Social) {
    await fetch(`/api/socials/${social.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...social, active: !social.active }),
    })
    router.refresh()
  }

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]/70" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/70" />
          <div className="w-3 h-3 rounded-full bg-[#28c940]/70" />
        </div>
        <span className="text-[#8b949e] text-xs font-mono">socials.yml</span>
        <div className="w-14" />
      </div>

      <div className="terminal-body p-6 space-y-6">
        {/* Add new */}
        <div className="space-y-3">
          <h3 className="font-mono text-accent text-sm">add_social:</h3>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
              placeholder="platform (twitter)"
              className="input-terminal"
            />
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="url"
              className="input-terminal"
            />
            <input
              type="text"
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              placeholder="icon (opcional)"
              className="input-terminal"
            />
          </div>
          <button
            onClick={addSocial}
            disabled={loading || !newPlatform || !newUrl}
            className="btn-terminal inline-flex items-center gap-2 text-sm disabled:opacity-50"
          >
            <Plus size={14} />
            {loading ? "agregando..." : "agregar red social"}
          </button>
        </div>

        {/* List */}
        <div className="space-y-2">
          <h3 className="font-mono text-accent text-sm border-b border-[rgba(var(--green-rgb),0.2)] pb-2">
            current_socials: ({socials.length})
          </h3>
          {socials.length === 0 ? (
            <p className="font-mono text-[#8b949e] text-xs">No hay redes sociales configuradas.</p>
          ) : (
            socials.map((social) => (
              <div key={social.id} className="flex items-center justify-between py-2 border-b border-[rgba(var(--green-rgb),0.05)] last:border-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleActive(social)}
                    className={`w-2 h-2 rounded-full ${social.active ? "bg-accent" : "bg-[#8b949e]"}`}
                    title={social.active ? "Activo" : "Inactivo"}
                  />
                  <span className="font-mono text-white text-sm capitalize">{social.platform}</span>
                  <span className="font-mono text-[#8b949e] text-xs truncate max-w-[200px]">{social.url}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
