"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, FileText, Briefcase, Folder, Share2, Settings, Eye, TrendingUp, Star } from "lucide-react"
import AdminLogout from "@/components/AdminLogout"

interface DashboardStats {
  posts: {
    total: number
    published: number
    draft: number
  }
  experiences: number
  projects: number
  socials: number
  configs: number
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  href, 
  subtitle 
}: { 
  title: string
  value: number
  icon: React.ElementType
  href: string
  subtitle?: string
}) {
  return (
    <Link href={href} className="terminal-window hover:border-[rgba(var(--green-rgb),0.3)] transition-colors block">
      <div className="terminal-body p-5">
        <div className="flex items-center justify-between mb-3">
          <Icon size={20} className="text-accent" />
          <span className="font-mono text-2xl font-bold text-white">{value}</span>
        </div>
        <p className="font-mono text-sm text-white">{title}</p>
        {subtitle && <p className="font-mono text-xs text-[#8b949e] mt-1">{subtitle}</p>}
      </div>
    </Link>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-page pt-8 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
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
        <div className="font-mono text-[var(--green-dim)] text-sm mb-2">$ system_status --overview</div>
        <h1 className="text-2xl font-mono font-bold text-white mb-8">
          <span className="text-accent">//</span> dashboard
        </h1>

        {/* Quick Actions */}
        <div className="terminal-window mb-8">
          <div className="terminal-header">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]/70" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/70" />
              <div className="w-3 h-3 rounded-full bg-[#28c940]/70" />
            </div>
            <span className="text-[#8b949e] text-xs font-mono">quick_actions.sh</span>
            <div className="w-14" />
          </div>
          <div className="terminal-body p-4">
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/blog/new" className="btn-terminal text-sm inline-flex items-center gap-2">
                <FileText size={14} />
                nuevo post
              </Link>
              <Link href="/admin/experiences/new" className="btn-terminal-outline text-sm inline-flex items-center gap-2">
                <Briefcase size={14} />
                nueva experiencia
              </Link>
              <Link href="/admin/projects/new" className="btn-terminal-outline text-sm inline-flex items-center gap-2">
                <Folder size={14} />
                nuevo proyecto
              </Link>
              <Link href="/admin/settings" className="btn-terminal-outline text-sm inline-flex items-center gap-2">
                <Settings size={14} />
                configuración
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="terminal-window animate-pulse">
                <div className="terminal-body p-5">
                  <div className="h-10 bg-[rgba(var(--green-rgb),0.1)] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Posts"
              value={stats.posts.total}
              icon={FileText}
              href="/admin/blog"
              subtitle={`${stats.posts.published} publicados, ${stats.posts.draft} borradores`}
            />
            <StatCard
              title="Experiencias"
              value={stats.experiences}
              icon={Briefcase}
              href="/admin/experiences"
            />
            <StatCard
              title="Proyectos"
              value={stats.projects}
              icon={Folder}
              href="/admin/projects"
            />
            <StatCard
              title="Redes Sociales"
              value={stats.socials}
              icon={Share2}
              href="/admin/socials"
            />
          </div>
        ) : null}

        {/* Placeholder Metrics */}
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]/70" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/70" />
              <div className="w-3 h-3 rounded-full bg-[#28c940]/70" />
            </div>
            <span className="text-[#8b949e] text-xs font-mono">analytics.log</span>
            <div className="w-14" />
          </div>
          <div className="terminal-body p-6">
            <div className="flex items-center gap-3 mb-4 text-[#8b949e]">
              <TrendingUp size={18} />
              <span className="font-mono text-sm">Métricas (próximamente)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-[rgba(var(--green-rgb),0.15)] rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Eye size={16} className="text-accent" />
                  <span className="font-mono text-xs text-[#8b949e]">Visitas totales</span>
                </div>
                <p className="font-mono text-lg text-white">—</p>
              </div>
              <div className="p-4 border border-[rgba(var(--green-rgb),0.15)] rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Star size={16} className="text-accent" />
                  <span className="font-mono text-xs text-[#8b949e]">Valoración media</span>
                </div>
                <p className="font-mono text-lg text-white">—</p>
              </div>
              <div className="p-4 border border-[rgba(var(--green-rgb),0.15)] rounded">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={16} className="text-accent" />
                  <span className="font-mono text-xs text-[#8b949e]">Posts populares</span>
                </div>
                <p className="font-mono text-lg text-white">—</p>
              </div>
            </div>
            <p className="font-mono text-xs text-[#8b949e] mt-4 pt-4 border-t border-[rgba(var(--green-rgb),0.1)]">
              Las métricas de visitas y valoraciones requieren implementación de analytics.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
