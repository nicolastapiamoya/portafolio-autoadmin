"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Briefcase, Folder, Share2, Settings } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"

  if (isLoginPage) {
    return <div className="min-h-screen bg-page">{children}</div>
  }

  return (
    <div className="min-h-screen bg-page">
      <nav className="fixed left-0 top-0 h-screen w-16 bg-[#060c12] border-r border-[rgba(var(--green-rgb),0.1)] flex flex-col items-center py-6 gap-4 z-50">
        <Link href="/admin" className="p-2.5 rounded-lg text-[#8b949e] hover:text-accent hover:bg-[rgba(var(--green-rgb),0.05)] transition-colors" title="Posts">
          <FileText size={20} />
        </Link>
        <Link href="/admin/experiences" className="p-2.5 rounded-lg text-[#8b949e] hover:text-accent hover:bg-[rgba(var(--green-rgb),0.05)] transition-colors" title="Experiencias">
          <Briefcase size={20} />
        </Link>
        <Link href="/admin/projects" className="p-2.5 rounded-lg text-[#8b949e] hover:text-accent hover:bg-[rgba(var(--green-rgb),0.05)] transition-colors" title="Proyectos">
          <Folder size={20} />
        </Link>
        <Link href="/admin/socials" className="p-2.5 rounded-lg text-[#8b949e] hover:text-accent hover:bg-[rgba(var(--green-rgb),0.05)] transition-colors" title="Redes Sociales">
          <Share2 size={20} />
        </Link>
        <div className="flex-1" />
        <Link href="/admin/settings" className="p-2.5 rounded-lg text-[#8b949e] hover:text-accent hover:bg-[rgba(var(--green-rgb),0.05)] transition-colors" title="Configuración">
          <Settings size={20} />
        </Link>
      </nav>
      <div className="pl-16">{children}</div>
    </div>
  )
}
