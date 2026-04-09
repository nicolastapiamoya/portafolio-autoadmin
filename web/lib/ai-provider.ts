import { getSiteConfig } from "./cms"

export type AIProvider = "ollama" | "deepseek" | "openai"

export interface AIConfig {
  provider: AIProvider
  model: string
  apiKey?: string
}

export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export async function getAIConfig(): Promise<AIConfig> {
  const [providerConfig, modelConfig, apiKeyConfig] = await Promise.all([
    getSiteConfig("ai_provider"),
    getSiteConfig("ai_model"),
    getSiteConfig("ai_api_key"),
  ])

  const provider = (providerConfig?.value || "ollama") as AIProvider
  const defaultModel =
    provider === "ollama"
      ? process.env.OLLAMA_MODEL || "llama3.2:1b"
      : provider === "deepseek"
      ? "deepseek-chat"
      : "gpt-4o-mini"

  return {
    provider,
    model: modelConfig?.value || defaultModel,
    apiKey: apiKeyConfig?.value || undefined,
  }
}

export async function streamChat(
  config: AIConfig,
  messages: ChatMessage[],
  ollamaUrl: string,
  onToken: (token: string) => void
): Promise<string> {
  if (config.provider === "ollama") {
    return streamOllama(config, messages, ollamaUrl, onToken)
  }
  return streamOpenAICompatible(config, messages, onToken)
}

async function streamOllama(
  config: AIConfig,
  messages: ChatMessage[],
  ollamaUrl: string,
  onToken: (token: string) => void
): Promise<string> {
  const response = await fetch(`${ollamaUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(600_000),
    body: JSON.stringify({
      model: config.model,
      messages,
      stream: true,
      keep_alive: "24h",
      options: { temperature: 0.7, num_predict: 500 },
    }),
  })

  if (!response.ok) throw new Error(`Ollama error: ${response.status}`)

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let fullMessage = ""

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
          onToken(parsed.message.content)
        }
      } catch {}
    }
  }

  return fullMessage
}

async function streamOpenAICompatible(
  config: AIConfig,
  messages: ChatMessage[],
  onToken: (token: string) => void
): Promise<string> {
  const baseUrl =
    config.provider === "deepseek"
      ? "https://api.deepseek.com/v1"
      : "https://api.openai.com/v1"

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    signal: AbortSignal.timeout(120_000),
    body: JSON.stringify({
      model: config.model,
      messages,
      stream: true,
      max_tokens: 500,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`${config.provider} error: ${response.status} — ${err}`)
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let fullMessage = ""
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    const lines = buffer.split("\n")
    buffer = lines.pop() || ""

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue
      const data = line.slice(6).trim()
      if (data === "[DONE]") continue
      try {
        const parsed = JSON.parse(data)
        const token = parsed.choices?.[0]?.delta?.content
        if (token) {
          fullMessage += token
          onToken(token)
        }
      } catch {}
    }
  }

  return fullMessage
}