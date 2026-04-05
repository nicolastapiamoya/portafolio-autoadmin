"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

export default function AdminDeleteExperienceButton({ id }: { id: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm("¿Eliminar esta experiencia? Esta acción no se puede deshacer.")) return
    setLoading(true)
    await fetch(`/api/experiences/${id}`, { method: "DELETE" })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1 font-mono text-xs text-[#8b949e] hover:text-red-400 transition-colors px-2 py-1 border border-[rgba(255,0,0,0.1)] hover:border-red-900 disabled:opacity-50"
    >
      <Trash2 size={11} />
      {loading ? "..." : "borrar"}
    </button>
  )
}
