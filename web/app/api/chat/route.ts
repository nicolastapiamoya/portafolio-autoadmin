import { NextRequest, NextResponse } from "next/server"
import { createChat, getChatBySessionId, addMessage, getChatHistory, deleteChat } from "@/lib/chat"
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
        signal: AbortSignal.timeout(600_000),
        body: JSON.stringify({
          model,
          messages,
          stream: true,
          keep_alive: "24h",
          options: {
            temperature: 0.7,
            num_predict: 500,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Ollama error: ${response.status}`)
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split("\n")) {
          if (!line.trim()) continue
          try {
            const parsed = JSON.parse(line)
            if (parsed.message?.content) {
              assistantMessage += parsed.message.content
            }
          } catch {
          }
        }
      }

      if (!assistantMessage) {
        assistantMessage = "Lo siento, no pude procesar tu mensaje."
      }

      await addMessage(sessionId, "assistant", assistantMessage)

      return NextResponse.json({ message: assistantMessage })
    }

    if (action === "send-stream") {
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

      const encoder = new TextEncoder()
      let fullMessage = ""

      const stream = new ReadableStream({
        async start(controller) {
          try {
            const ollamaRes = await fetch(`${ollamaUrl}/api/chat`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              signal: AbortSignal.timeout(600_000),
              body: JSON.stringify({
                model,
                messages,
                stream: true,
                keep_alive: "24h",
                options: {
                  temperature: 0.7,
                  num_predict: 500,
                },
              }),
            })

            if (!ollamaRes.ok) {
              controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: "Ollama error" })}\n\n`))
              controller.close()
              return
            }

            const reader = ollamaRes.body!.getReader()
            const decoder = new TextDecoder()

            while (true) {
              const { done, value } = await reader.read()
              if (done) break
              const chunk = decoder.decode(value, { stream: true })
              for (const line of chunk.split("\n")) {
                if (!line.trim()) continue
                try {
                  const parsed = JSON.parse(line)
                  if (parsed.message?.content) {
                    fullMessage += parsed.message.content
                    controller.enqueue(encoder.encode(`event: token\ndata: ${JSON.stringify({ token: parsed.message.content })}\n\n`))
                  }
                } catch {
                }
              }
            }

            await addMessage(sessionId, "assistant", fullMessage || "Lo siento, no pude procesar tu mensaje.")
            controller.enqueue(encoder.encode(`event: done\ndata: ${JSON.stringify({ fullMessage })}\n\n`))
            controller.close()
          } catch (err) {
            controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: "Failed to stream" })}\n\n`))
            controller.close()
          }
        },
      })

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          "Connection": "keep-alive",
          "X-Accel-Buffering": "no",
        },
      })
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

export async function DELETE(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("sessionId")
    if (!sessionId) {
      return NextResponse.json({ error: "SessionId is required" }, { status: 400 })
    }
    await deleteChat(sessionId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete chat error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
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
