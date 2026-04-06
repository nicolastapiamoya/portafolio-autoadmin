"use client"
import { useState } from "react"
import { Send } from "lucide-react"

interface SettingsFormProps {
  initialData: {
    email: string
    linkedin: string
    github: string
    location: string
    siteTitle: string
    siteDescription: string
    name: string
    tagline: string
    role: string
    company: string
    aboutBio: string
  }
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const [email, setEmail] = useState(initialData.email)
  const [linkedin, setLinkedin] = useState(initialData.linkedin)
  const [github, setGithub] = useState(initialData.github)
  const [location, setLocation] = useState(initialData.location)
  const [siteTitle, setSiteTitle] = useState(initialData.siteTitle)
  const [siteDescription, setSiteDescription] = useState(initialData.siteDescription)
  const [name, setName] = useState(initialData.name)
  const [tagline, setTagline] = useState(initialData.tagline)
  const [role, setRole] = useState(initialData.role)
  const [company, setCompany] = useState(initialData.company)
  const [aboutBio, setAboutBio] = useState(initialData.aboutBio)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  async function handleSave(key: string, value: string, description: string) {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value, description }),
      })
      if (!res.ok) throw new Error("Error al guardar")
      setSuccess(`✓ ${key} actualizado`)
      setTimeout(() => setSuccess(""), 2000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]/70" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/70" />
          <div className="w-3 h-3 rounded-full bg-[#28c940]/70" />
        </div>
        <span className="text-[#8b949e] text-xs font-mono">site_config.yml</span>
        <div className="w-14" />
      </div>

      <div className="terminal-body p-6 space-y-6">
        {/* Hero */}
        <div className="space-y-4">
          <h3 className="font-mono text-accent text-sm border-b border-[rgba(var(--green-rgb),0.2)] pb-2">hero:</h3>
          <div>
            <label className="font-mono text-[#8b949e] text-xs block mb-1.5">name:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nicolás Tapia Moya"
                className="input-terminal flex-1"
              />
              <button
                onClick={() => handleSave("name", name, "Nombre completo")}
                disabled={loading}
                className="btn-terminal-outline px-3"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
          <div>
            <label className="font-mono text-[#8b949e] text-xs block mb-1.5">tagline:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Software Engineer especializado en..."
                className="input-terminal flex-1"
              />
              <button
                onClick={() => handleSave("tagline", tagline, "Tagline / Bio corta")}
                disabled={loading}
                className="btn-terminal-outline px-3"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Site Info */}
        <div className="space-y-4">
          <h3 className="font-mono text-accent text-sm border-b border-[rgba(var(--green-rgb),0.2)] pb-2">site_info:</h3>
          <div>
            <label className="font-mono text-[#8b949e] text-xs block mb-1.5">title:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                placeholder="Nicolás Tapia Moya"
                className="input-terminal flex-1"
              />
              <button
                onClick={() => handleSave("siteTitle", siteTitle, "Título del sitio")}
                disabled={loading}
                className="btn-terminal-outline px-3"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
          <div>
            <label className="font-mono text-[#8b949e] text-xs block mb-1.5">description:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                placeholder="Software Engineer..."
                className="input-terminal flex-1"
              />
              <button
                onClick={() => handleSave("siteDescription", siteDescription, "Descripción SEO del sitio")}
                disabled={loading}
                className="btn-terminal-outline px-3"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="space-y-4">
          <h3 className="font-mono text-accent text-sm border-b border-[rgba(var(--green-rgb),0.2)] pb-2">about:</h3>
          <div>
            <label className="font-mono text-[#8b949e] text-xs block mb-1.5">role:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Software Engineer II"
                className="input-terminal flex-1"
              />
              <button
                onClick={() => handleSave("role", role, "Cargo / Rol")}
                disabled={loading}
                className="btn-terminal-outline px-3"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
          <div>
            <label className="font-mono text-[#8b949e] text-xs block mb-1.5">company:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Cencosud S.A."
                className="input-terminal flex-1"
              />
              <button
                onClick={() => handleSave("company", company, "Empresa actual")}
                disabled={loading}
                className="btn-terminal-outline px-3"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
          <div>
            <label className="font-mono text-[#8b949e] text-xs block mb-1.5">location:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Santiago, Chile"
                className="input-terminal flex-1"
              />
              <button
                onClick={() => handleSave("location", location, "Ubicación")}
                disabled={loading}
                className="btn-terminal-outline px-3"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
          <div>
            <label className="font-mono text-[#8b949e] text-xs block mb-1.5">bio:</label>
            <div className="flex gap-2">
              <textarea
                value={aboutBio}
                onChange={(e) => setAboutBio(e.target.value)}
                placeholder="Biografía para la sección About..."
                rows={3}
                className="input-terminal flex-1"
              />
              <button
                onClick={() => handleSave("aboutBio", aboutBio, "Biografía About")}
                disabled={loading}
                className="btn-terminal-outline px-3 self-start"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="font-mono text-accent text-sm border-b border-[rgba(var(--green-rgb),0.2)] pb-2">contact:</h3>
          <div>
            <label className="font-mono text-[#8b949e] text-xs block mb-1.5">email:</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nicousm46@gmail.com"
                className="input-terminal flex-1"
              />
              <button
                onClick={() => handleSave("email", email, "Email de contacto")}
                disabled={loading}
                className="btn-terminal-outline px-3"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
          <div>
            <label className="font-mono text-[#8b949e] text-xs block mb-1.5">linkedin:</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="input-terminal flex-1"
              />
              <button
                onClick={() => handleSave("linkedin", linkedin, "URL de LinkedIn")}
                disabled={loading}
                className="btn-terminal-outline px-3"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
          <div>
            <label className="font-mono text-[#8b949e] text-xs block mb-1.5">github:</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/nicolastapiamoya"
                className="input-terminal flex-1"
              />
              <button
                onClick={() => handleSave("github", github, "URL de GitHub")}
                disabled={loading}
                className="btn-terminal-outline px-3"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
          <div>
            <label className="font-mono text-[#8b949e] text-xs block mb-1.5">location:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Santiago, Chile"
                className="input-terminal flex-1"
              />
              <button
                onClick={() => handleSave("location", location, "Ubicación")}
                disabled={loading}
                className="btn-terminal-outline px-3"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

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
