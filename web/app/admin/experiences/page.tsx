import Link from "next/link"
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react"
import AdminLogout from "@/components/AdminLogout"
import { getAllExperiences } from "@/lib/cms"
import AdminDeleteExperienceButton from "@/components/AdminDeleteExperienceButton"

export const dynamic = "force-dynamic"

export default async function ExperiencesAdminPage() {
  const experiences = await getAllExperiences()

  return (
    <main className="min-h-screen bg-page pt-8 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-sm text-[#8b949e] hover:text-accent transition-colors"
          >
            <ArrowLeft size={14} />
            cd ~/home
          </Link>
          <AdminLogout />
        </div>

        {/* Header */}
        <div className="font-mono text-[var(--green-dim)] text-sm mb-2">$ ls -la experiences/</div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-mono font-bold text-white">
            <span className="text-accent">//</span> experiencias
          </h1>
          <Link
            href="/admin/experiences/new"
            className="btn-terminal inline-flex items-center gap-2 text-sm"
          >
            <Plus size={14} />
            nueva
          </Link>
        </div>

        {/* Experiences list */}
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]/70" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/70" />
              <div className="w-3 h-3 rounded-full bg-[#28c940]/70" />
            </div>
            <span className="text-[#8b949e] text-xs font-mono">experiences.db — {experiences.length} registros</span>
            <div className="w-14" />
          </div>

          <div className="terminal-body divide-y divide-[rgba(var(--green-rgb),0.08)]">
            {experiences.length === 0 ? (
              <p className="p-6 font-mono text-[#8b949e] text-sm">
                No hay experiencias aún. <Link href="/admin/experiences/new" className="text-accent hover:underline">Crear la primera →</Link>
              </p>
            ) : (
              experiences.map((exp) => (
                <div key={exp.id} className="p-4 flex items-start justify-between gap-4 hover:bg-[rgba(var(--green-rgb),0.03)] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-white text-sm">{exp.role}</span>
                      <span className="text-[#8b949e]">@</span>
                      <span className="font-mono text-accent text-sm">{exp.company}</span>
                      {exp.current && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-accent/10 text-accent border border-accent/30 rounded">
                          actual
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-mono text-[#8b949e] text-xs">
                        {exp.startDate} — {exp.current ? "presente" : exp.endDate}
                      </span>
                      <span className="font-mono text-[#8b949e] text-xs">· {exp.location}</span>
                    </div>
                    <div className="flex gap-1 flex-wrap mt-2">
                      {exp.techStack.map((t) => (
                        <span key={t} className="tag text-[10px] px-1.5 py-0">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/admin/experiences/edit/${exp.id}`}
                      className="inline-flex items-center gap-1 font-mono text-xs text-[#8b949e] hover:text-accent transition-colors px-2 py-1 border border-[rgba(var(--green-rgb),0.2)] hover:border-[var(--green)]"
                    >
                      <Pencil size={11} />
                      editar
                    </Link>
                    <AdminDeleteExperienceButton id={exp.id} />
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
