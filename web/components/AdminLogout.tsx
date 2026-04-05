"use client"
import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export default function AdminLogout() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="inline-flex items-center gap-2 font-mono text-xs text-[#8b949e] hover:text-red-400 transition-colors border border-[rgba(255,0,0,0.15)] px-3 py-1.5 hover:border-red-900"
    >
      <LogOut size={12} />
      logout
    </button>
  )
}
