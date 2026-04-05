import Link from "next/link"
import { ArrowLeft, Plus, Pencil, Trash2, ExternalLink } from "lucide-react"
import AdminLogout from "@/components/AdminLogout"
import { getAllProjects } from "@/lib/cms"
import AdminDeleteProjectButton from "@/components/AdminDeleteProjectButton"

export const dynamic = "force-dynamic"

export default async function ProjectsAdminPage() {
  const projects = await getAllProjects()

  return (
    <main className="min-h-screen bg-page pt-8 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-mono text-sm text-[#8b949e] hover:text-accent transition-colors">
            <ArrowLeft size={14} />
            cd ~/home
          </Link>
          <AdminLogout />
        </div>

        <div className="font-mono text-[var(--green-dim)] text-sm mb-2">$ ls -la projects/</div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-mono font-bold text-white">
            <span className="text-accent">//</span> proyectos
          </h1>
          <Link href="/admin/projects/new" className="btn-terminal inline-flex items-center gap-2 text-sm">
            <Plus size={14} />
            nuevo
          </Link>
        </div>

        <div className="terminal-window">
          <div className="terminal-header">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]/70" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/70" />
              <div className="w-3 h-3 rounded-full bg-[#28c940]/70" />
            </div>
            <span className="text-[#8b949e] text-xs font-mono">projects.db — {projects.length} registros</span>
            <div className="w-14" />
          </div>

          <div className="terminal-body divide-y divide-[rgba(var(--green-rgb),0.08)]">
            {projects.length === 0 ? (
              <p className="p-6 font-mono text-[#8b949e] text-sm">
                No hay proyectos aún. <Link href="/admin/projects/new" className="text-accent hover:underline">Crear el primero →</Link>
              </p>
            ) : (
              projects.map((proj) => (
                <div key={proj.id} className="p-4 flex items-start justify-between gap-4 hover:bg-[rgba(var(--green-rgb),0.03)] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-white text-sm">{proj.title}</span>
                      {proj.featured && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-accent/10 text-accent border border-accent/30 rounded">
                          destacado
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-[#8b949e] text-xs truncate mb-2">{proj.description.slice(0, 100)}...</p>
                    <div className="flex gap-1 flex-wrap">
                      {proj.techStack.map((t) => (
                        <span key={t} className="tag text-[10px] px-1.5 py-0">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {proj.demoUrl && (
                      <a href={proj.demoUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-[#8b949e] hover:text-accent transition-colors" title="Ver demo">
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <Link href={`/admin/projects/edit/${proj.id}`} className="inline-flex items-center gap-1 font-mono text-xs text-[#8b949e] hover:text-accent transition-colors px-2 py-1 border border-[rgba(var(--green-rgb),0.2)] hover:border-[var(--green)]">
                      <Pencil size={11} />
                      editar
                    </Link>
                    <AdminDeleteProjectButton id={proj.id} />
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
