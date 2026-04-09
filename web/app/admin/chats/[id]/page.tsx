import { getChatById } from "@/lib/chat"
import Link from "next/link"
import { ArrowLeft, User, Bot } from "lucide-react"
import AdminLogout from "@/components/AdminLogout"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function ChatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params
  const id = parseInt(idStr)
  if (isNaN(id)) notFound()

  const chat = await getChatById(id)
  if (!chat) notFound()

  return (
    <main className="min-h-screen bg-page pt-8 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/admin/chats" className="inline-flex items-center gap-2 font-mono text-sm text-[#8b949e] hover:text-accent transition-colors">
            <ArrowLeft size={14} /> cd ~/chats
          </Link>
          <AdminLogout />
        </div>

        <div className="font-mono text-[var(--green-dim)] text-sm mb-2">$ cat chat_{chat.id}.log</div>
        <h1 className="text-2xl font-mono font-bold text-white mb-2">
          <span className="text-accent">//</span> sesión #{chat.id}
        </h1>
        <div className="flex flex-wrap gap-4 font-mono text-xs text-[#8b949e] mb-8">
          {chat.ipAddress && <span>ip: {chat.ipAddress}</span>}
          {chat.country && <span>país: {chat.country}{chat.city ? `, ${chat.city}` : ""}</span>}
          <span>inicio: {new Date(chat.createdAt).toLocaleString("es-CL")}</span>
          {chat.referrer && <span>ref: {chat.referrer}</span>}
        </div>

        <div className="terminal-window">
          <div className="terminal-header">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]/70" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/70" />
              <div className="w-3 h-3 rounded-full bg-[#28c940]/70" />
            </div>
            <span className="text-[#8b949e] text-xs font-mono">{chat.messages.length} mensajes</span>
            <div className="w-14" />
          </div>
          <div className="terminal-body p-4 space-y-4">
            {chat.messages.length === 0 ? (
              <p className="font-mono text-[#8b949e] text-sm">Sin mensajes.</p>
            ) : (
              chat.messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-[rgba(var(--green-rgb),0.15)] flex items-center justify-center shrink-0 mt-1">
                      <Bot size={14} className="text-accent" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-4 py-2 rounded font-mono text-sm ${
                    msg.role === "user"
                      ? "bg-[rgba(var(--green-rgb),0.12)] text-white"
                      : "bg-[#0d1117] border border-[rgba(var(--green-rgb),0.15)] text-[#c9d1d9]"
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-[10px] text-[#8b949e] mt-1">{new Date(msg.createdAt).toLocaleTimeString("es-CL")}</p>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-[rgba(var(--green-rgb),0.1)] flex items-center justify-center shrink-0 mt-1">
                      <User size={14} className="text-[#8b949e]" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {chat.userAgent && (
          <p className="font-mono text-[10px] text-[#8b949e]/50 mt-4">{chat.userAgent}</p>
        )}
      </div>
    </main>
  )
}
