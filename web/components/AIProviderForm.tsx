"use client"
import { useState } from "react"
import { Send, Eye, EyeOff } from "lucide-react"

type AIProvider = "ollama" | "deepseek" | "openai"

const PROVIDER_DEFAULTS: Record<AIProvider, { model: string; label: string; needsKey: boolean }> = {
  ollama:   { model: "llama3.2:1b",   label: "Ollama (local)",  needsKey: false },
  deepseek: { model: "deepseek-chat", label: "DeepSeek",        needsKey: true  },
  openai:   { model: "gpt-4o-mini",   label: "OpenAI",          needsKey: true  },
}

interface AIProviderFormProps {
  initialProvider: string
  initialModel: string
  initialApiKey: string
}

export default function AIProviderForm({ initialProvider, initialModel, initialApiKey }: AIProviderFormProps) {
  const [provider, setProvider] = useState<AIProvider>((initialProvider || "ollama") as AIProvider)
  const [model, setModel] = useState(initialModel)
  const [apiKey, setApiKey] = useState(initialApiKey)
  const [showKey, setShowKey] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  async function saveConfig(key: string, value: string, description: string) {
    const res = await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value, description }),
    })
    if (!res.ok) throw new Error("Error al guardar")
  }

  async function handleSave() {
    setLoading(true)
    setError("")
    try {
      const effectiveModel = model || PROVIDER_DEFAULTS[provider].model
      await Promise.all([
        saveConfig("ai_provider", provider, "Proveedor de IA para el chat"),
        saveConfig("ai_model", effectiveModel, "Modelo de IA para el chat"),
        saveConfig("ai_api_key", apiKey, "API key del proveedor de IA"),
      ])
      setModel(effectiveModel)
      setSuccess("✓ Configuración de IA guardada")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar")
    } finally {
      setLoading(false)
    }
  }

  function handleProviderChange(p: AIProvider) {
    setProvider(p)
    if (!model || model === PROVIDER_DEFAULTS[provider].model) {
      setModel(PROVIDER_DEFAULTS[p].model)
    }
  }

  const { needsKey } = PROVIDER_DEFAULTS[provider]

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]/70" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/70" />
          <div className="w-3 h-3 rounded-full bg-[#28c940]/70" />
        </div>
        <span className="text-[#8b949e] text-xs font-mono">ai_config.yml</span>
        <div className="w-14" />
      </div>

      <div className="terminal-body p-6 space-y-5">
        <h3 className="font-mono text-accent text-sm border-b border-[rgba(var(--green-rgb),0.2)] pb-2">
          ai_provider:
        </h3>

        {/* Provider selector */}
        <div>
          <label className="font-mono text-[#8b949e] text-xs block mb-2">provider:</label>
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(PROVIDER_DEFAULTS) as AIProvider[]).map((p) => (
              <button
                key={p}
                onClick={() => handleProviderChange(p)}
                className={`font-mono text-xs px-3 py-1.5 border transition-colors ${
                  provider === p
                    ? "border-[var(--green)] text-accent bg-[rgba(var(--green-rgb),0.1)]"
                    : "border-[rgba(var(--green-rgb),0.2)] text-[#8b949e] hover:border-[rgba(var(--green-rgb),0.5)]"
                }`}
              >
                {PROVIDER_DEFAULTS[p].label}
              </button>
            ))}
          </div>
        </div>

        {/* Model */}
        <div>
          <label className="font-mono text-[#8b949e] text-xs block mb-1.5">model:</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder={PROVIDER_DEFAULTS[provider].model}
            className="input-terminal w-full"
          />
          {provider === "ollama" && (
            <p className="font-mono text-[10px] text-[#8b949e]/70 mt-1">
              El modelo debe estar descargado en Ollama. Ejemplos: llama3.2:1b, phi3:mini, qwen2.5:0.5b
            </p>
          )}
          {provider === "deepseek" && (
            <p className="font-mono text-[10px] text-[#8b949e]/70 mt-1">
              Modelos disponibles: deepseek-chat, deepseek-reasoner
            </p>
          )}
          {provider === "openai" && (
            <p className="font-mono text-[10px] text-[#8b949e]/70 mt-1">
              Modelos disponibles: gpt-4o-mini, gpt-4o, gpt-3.5-turbo
            </p>
          )}
        </div>

        {/* API Key */}
        {needsKey && (
          <div>
            <label className="font-mono text-[#8b949e] text-xs block mb-1.5">api_key:</label>
            <div className="flex gap-2">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="input-terminal flex-1"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="btn-terminal-outline px-3"
                title={showKey ? "Ocultar" : "Mostrar"}
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <p className="font-mono text-[10px] text-[#8b949e]/70 mt-1">
              Se guarda en la base de datos. No se expone al frontend.
            </p>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-terminal flex items-center gap-2 text-sm"
        >
          <Send size={14} />
          {loading ? "Guardando..." : "Guardar configuración IA"}
        </button>

        {error && (
          <p className="font-mono text-red-400 text-xs border border-red-900/50 bg-red-900/10 px-3 py-2">
            ✗ {error}
          </p>
        )}
        {success && (
          <p className="font-mono text-accent text-xs border border-[rgba(var(--green-rgb),0.3)] bg-[rgba(var(--green-rgb),0.05)] px-3 py-2">
            {success}
          </p>
        )}
      </div>
    </div>
  )
}
