import { NextRequest, NextResponse } from "next/server"
import { createChat, getChatBySessionId, addMessage, getChatHistory } from "@/lib/chat"
import { getAgentContext, buildSystemPrompt } from "@/lib/agent-context"

function getClientInfo(req: NextRequest) {
  const headers = req.headers
  return {
    ipAddress: headers.get("x-forwarded-for")?.split(",")[0] ||
               headers.get("x-real-ip") ||
               "unknown",
    userAgent: headers.get("user-agent") || "unknown",
    referrer: headers.get("referer") || undefined,
    country: headers.get("cf-ipcountry") || undefined,
    city: headers.get("cf-ipcity") || undefined,
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action } = body

    if (action === "create") {
      const clientInfo = getClientInfo(req)
      const sessionId = await createChat(clientInfo)
      return NextResponse.json({ sessionId })
    }

    if (action === "send") {
      const { sessionId, message } = body

      if (!sessionId || !message) {
        return NextResponse.json(
          { error: "SessionId and message are required" },
          { status: 400 }
        )
      }

      const chat = await getChatBySessionId(sessionId)
      if (!chat) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 })
      }

      await addMessage(sessionId, "user", message)

      const history = await getChatHistory(sessionId)
      const context = await getAgentContext()
      const systemPrompt = buildSystemPrompt(context)

      const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434"
      const model = process.env.OLLAMA_MODEL || "gemma3:4b"

      const messages = [
        { role: "system", content: systemPrompt },
        ...history.map((m) => ({ role: m.role, content: m.content })),
      ]

      const response = await fetch(`${ollamaUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 500,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Ollama error: ${response.status}`)
      }

      const data = await response.json()
      const assistantMessage = data.message?.content || "Lo siento, no pude procesar tu mensaje."

      await addMessage(sessionId, "assistant", assistantMessage)

      return NextResponse.json({ message: assistantMessage })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json(
        { error: "SessionId is required" },
        { status: 400 }
      )
    }

    const chat = await getChatBySessionId(sessionId)

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    return NextResponse.json({ messages: chat.messages })
  } catch (error) {
    console.error("Get chat history error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
