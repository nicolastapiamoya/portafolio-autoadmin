import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import AdminLogout from "@/components/AdminLogout"
import ProjectForm from "@/components/ProjectForm"
import { prisma } from "@/lib/posts"

export const dynamic = "force-dynamic"

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const projId = parseInt(id)
  if (isNaN(projId)) notFound()

  const proj = await prisma.project.findUnique({ where: { id: projId } }).catch(() => null)
  if (!proj) notFound()

  return (
    <main className="min-h-screen bg-page pt-8 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/admin/projects" className="inline-flex items-center gap-2 font-mono text-sm text-[#8b949e] hover:text-accent transition-colors">
            <ArrowLeft size={14} />
            cd ~/projects
          </Link>
          <AdminLogout />
        </div>

        <div className="font-mono text-[var(--green-dim)] text-sm mb-2">$ vim {proj.slug}.md</div>
        <h1 className="text-2xl font-mono font-bold text-white mb-8">
          <span className="text-accent">//</span> editar proyecto
        </h1>

        <ProjectForm
          mode="edit"
          initialData={{
            id: proj.id,
            title: proj.title,
            slug: proj.slug,
            description: proj.description,
            techStack: proj.techStack,
            demoUrl: proj.demoUrl,
            repoUrl: proj.repoUrl,
            imageUrl: proj.imageUrl,
            featured: proj.featured,
            order: proj.order,
          }}
        />
      </div>
    </main>
  )
}
