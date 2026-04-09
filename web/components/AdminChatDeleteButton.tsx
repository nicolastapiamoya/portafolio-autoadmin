"use client"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { useState } from "react"

export default function AdminChatDeleteButton({ sessionId }: { sessionId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm("¿Eliminar esta conversación?")) return
    setLoading(true)
    await fetch(`/api/chat?sessionId=${sessionId}`, { method: "DELETE" })
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1 font-mono text-xs text-[#8b949e] hover:text-red-400 transition-colors px-2 py-1 border border-[rgba(var(--green-rgb),0.2)] hover:border-red-400/40 disabled:opacity-50"
    >
      <Trash2 size={11} />
      {loading ? "..." : "borrar"}
    </button>
  )
}
