import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import AdminLogout from "@/components/AdminLogout"
import ExperienceForm from "@/components/ExperienceForm"
import { prisma } from "@/lib/posts"

export const dynamic = "force-dynamic"

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const expId = parseInt(id)
  if (isNaN(expId)) notFound()

  const exp = await prisma.experience.findUnique({ where: { id: expId } }).catch(() => null)
  if (!exp) notFound()

  return (
    <main className="min-h-screen bg-page pt-8 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/admin/experiences"
            className="inline-flex items-center gap-2 font-mono text-sm text-[#8b949e] hover:text-accent transition-colors"
          >
            <ArrowLeft size={14} />
            cd ~/experiences
          </Link>
          <AdminLogout />
        </div>

        <div className="font-mono text-[var(--green-dim)] text-sm mb-2">$ vim {exp.company.toLowerCase().replace(/\s+/g, "-")}.md</div>
        <h1 className="text-2xl font-mono font-bold text-white mb-8">
          <span className="text-accent">//</span> editar experiencia
        </h1>

        <ExperienceForm
          mode="edit"
          initialData={{
            id: exp.id,
            company: exp.company,
            role: exp.role,
            location: exp.location,
            startDate: exp.startDate,
            endDate: exp.endDate,
            current: exp.current,
            description: exp.description,
            techStack: exp.techStack,
            order: exp.order,
          }}
        />
      </div>
    </main>
  )
}
