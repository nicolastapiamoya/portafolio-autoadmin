import { getAllChatsWithCount } from "@/lib/chat"
import Link from "next/link"
import { ArrowLeft, MessageCircle, User, Clock, Trash2 } from "lucide-react"
import AdminLogout from "@/components/AdminLogout"
import AdminChatDeleteButton from "@/components/AdminChatDeleteButton"

export const dynamic = "force-dynamic"

export default async function ChatsAdminPage() {
  let chats: Awaited<ReturnType<typeof getAllChatsWithCount>> = []
  try {
    chats = await getAllChatsWithCount()
  } catch {
    chats = []
  }

  return (
    <main className="min-h-screen bg-page pt-8 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 font-mono text-sm text-[#8b949e] hover:text-accent transition-colors"
          >
            <ArrowLeft size={14} />
            cd ~/admin
          </Link>
          <AdminLogout />
        </div>

        {/* Header */}
        <div className="font-mono text-[var(--green-dim)] text-sm mb-2">$ ls -la chats/</div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-mono font-bold text-white">
            <span className="text-accent">//</span> conversaciones IA
          </h1>
          <span className="font-mono text-xs text-[#8b949e] border border-[rgba(var(--green-rgb),0.2)] px-3 py-1 rounded">
            {chats.length} sesiones
          </span>
        </div>

        {/* Chat list */}
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]/70" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/70" />
              <div className="w-3 h-3 rounded-full bg-[#28c940]/70" />
            </div>
            <span className="text-[#8b949e] text-xs font-mono">chats.db — {chats.length} registros</span>
            <div className="w-14" />
          </div>

          <div className="terminal-body divide-y divide-[rgba(var(--green-rgb),0.08)]">
            {chats.length === 0 ? (
              <p className="p-6 font-mono text-[#8b949e] text-sm">
                No hay conversaciones aún.
              </p>
            ) : (
              chats.map((chat) => (
                <div key={chat.id} className="p-4 flex items-start justify-between gap-4 hover:bg-[rgba(var(--green-rgb),0.03)] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle size={12} className="text-accent shrink-0" />
                      <span className="font-mono text-white text-sm truncate">
                        Sesión #{chat.id}
                      </span>
                      <span className="font-mono text-xs text-[#8b949e]">
                        — {chat._count.messages} mensajes
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      {chat.ipAddress && (
                        <span className="font-mono text-[#8b949e] text-xs flex items-center gap-1">
                          <User size={10} />
                          {chat.ipAddress}
                        </span>
                      )}
                      {chat.country && (
                        <span className="font-mono text-[#8b949e] text-xs">
                          {chat.country}{chat.city ? `, ${chat.city}` : ""}
                        </span>
                      )}
                      <span className="font-mono text-[#8b949e] text-xs flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(chat.createdAt).toLocaleString("es-CL")}
                      </span>
                      {chat.referrer && (
                        <span className="font-mono text-[#8b949e] text-xs truncate max-w-[200px]">
                          ref: {chat.referrer}
                        </span>
                      )}
                    </div>
                    {chat.userAgent && (
                      <p className="font-mono text-[10px] text-[#8b949e]/60 mt-1 truncate">
                        {chat.userAgent}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/admin/chats/${chat.id}`}
                      className="inline-flex items-center gap-1 font-mono text-xs text-[#8b949e] hover:text-accent transition-colors px-2 py-1 border border-[rgba(var(--green-rgb),0.2)] hover:border-[var(--green)]"
                    >
                      <MessageCircle size={11} />
                      ver
                    </Link>
                    <AdminChatDeleteButton sessionId={chat.sessionId} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
