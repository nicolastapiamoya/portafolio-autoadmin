"use client"

import { useState, useEffect, useRef, FormEvent } from "react"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  createdAt: string
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && !sessionId) {
      initializeChat()
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const initializeChat = async () => {
    try {
      setError(null)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create" }),
      })

      if (!response.ok) throw new Error("Failed to create chat")

      const data = await response.json()
      setSessionId(data.sessionId)

      setMessages([
        {
          id: Date.now(),
          role: "assistant",
          content: "¡Hola! Soy el asistente virtual de Nicolás. Puedo responder preguntas sobre su experiencia, proyectos y habilidades. ¿En qué puedo ayudarte?",
          createdAt: new Date().toISOString(),
        },
      ])
    } catch (err) {
      setError("No se pudo iniciar el chat. Intenta recargar la página.")
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !sessionId || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setIsLoading(true)
    setError(null)

    const tempUserMessage: Message = {
      id: Date.now(),
      role: "user",
      content: userMessage,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, tempUserMessage])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          sessionId,
          message: userMessage,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send message")
      }

      const data = await response.json()

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: data.message,
          createdAt: new Date().toISOString(),
        },
      ])
    } catch (err) {
      setError("Error al enviar el mensaje. Intenta de nuevo.")
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--green)] text-[var(--bg)] shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        aria-label="Abrir chat"
      >
        <MessageCircle size={24} />
      </button>
    )
  }

  return (
    <div
      className={`fixed ${
        isExpanded
          ? "inset-4 md:inset-10"
          : "bottom-6 right-6 w-[380px] h-[500px]"
      } z-50 flex flex-col overflow-hidden rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-bg)] shadow-2xl transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(var(--green-rgb),0.12)] bg-[var(--terminal-header)] px-4 py-3">
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-[var(--green)]" />
          <span className="font-mono text-sm text-[var(--text)]">Agente IA</span>
          <span className="rounded-full bg-[rgba(var(--green-rgb),0.15)] px-2 py-0.5 text-xs text-[var(--green)]">
            gemma4:e2b
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleExpand}
            className="rounded p-1 text-[var(--text-dim)] transition-colors hover:bg-[rgba(var(--green-rgb),0.1)] hover:text-[var(--green)]"
            aria-label={isExpanded ? "Contraer" : "Expandir"}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {isExpanded ? (
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              ) : (
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              )}
            </svg>
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded p-1 text-[var(--text-dim)] transition-colors hover:bg-[rgba(var(--green-rgb),0.1)] hover:text-[var(--green)]"
            aria-label="Cerrar chat"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded ${
                msg.role === "user"
                  ? "bg-[rgba(var(--green-rgb),0.2)]"
                  : "bg-[rgba(var(--green-rgb),0.1)]"
              }`}
            >
              {msg.role === "user" ? (
                <User size={16} className="text-[var(--green)]" />
              ) : (
                <Bot size={16} className="text-[var(--green)]" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 font-mono text-sm ${
                msg.role === "user"
                  ? "bg-[rgba(var(--green-rgb),0.15)] text-[var(--text)]"
                  : "bg-[var(--terminal-header)] text-[var(--text)] border border-[rgba(var(--green-rgb),0.1)]"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[rgba(var(--green-rgb),0.1)]">
              <Bot size={16} className="text-[var(--green)]" />
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-[var(--terminal-header)] px-3 py-2">
              <span
                className="h-2 w-2 rounded-full bg-[var(--green)] animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="h-2 w-2 rounded-full bg-[var(--green)] animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="h-2 w-2 rounded-full bg-[var(--green)] animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-900/20 border border-red-500/30 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-[rgba(var(--green-rgb),0.12)] bg-[var(--terminal-header)] p-3"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={isLoading}
            className="input-terminal flex-1"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn-terminal flex h-10 w-10 items-center justify-center p-0 disabled:opacity-50"
            aria-label="Enviar mensaje"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  )
}
