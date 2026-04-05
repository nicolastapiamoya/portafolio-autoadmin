"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Terminal, Lock } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    })
    setLoading(false)
    if (res?.ok) {
      router.push("/admin")
    } else {
      setError("Credenciales incorrectas. Intenta de nuevo.")
    }
  }

  return (
    <main className="min-h-screen bg-page flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="terminal-window shadow-[0_0_40px_rgba(var(--green-rgb),0.06)]">
          <div className="terminal-header">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]/70" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/70" />
              <div className="w-3 h-3 rounded-full bg-[#28c940]/70" />
            </div>
            <span className="text-[#8b949e] text-xs font-mono flex items-center gap-1.5">
              <Lock size={11} /> admin — auth required
            </span>
            <div className="w-14" />
          </div>

          <div className="terminal-body p-8">
            <div className="flex items-center gap-3 mb-6">
              <Terminal size={22} className="text-accent" />
              <div>
                <p className="font-mono text-[var(--green-dim)] text-xs">$ sudo login</p>
                <p className="font-mono text-white font-bold text-lg">
                  Admin Access
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-mono text-accent text-xs block mb-1.5">
                  username:
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="enter username"
                  required
                  className="input-terminal rounded"
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="font-mono text-accent text-xs block mb-1.5">
                  password:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-terminal rounded"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <p className="font-mono text-red-400 text-xs border border-red-900/50 bg-red-900/10 px-3 py-2">
                  ✗ {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-terminal w-full text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "authenticating..." : "./login.sh"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
