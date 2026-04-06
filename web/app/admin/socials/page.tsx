import Link from "next/link"
import { ArrowLeft, Plus, Pencil, Trash2, ExternalLink } from "lucide-react"
import AdminLogout from "@/components/AdminLogout"
import { getAllSocialLinksAdmin } from "@/lib/cms"
import AdminDeleteSocialButton from "@/components/AdminDeleteSocialButton"

export const dynamic = "force-dynamic"

export default async function SocialsAdminPage() {
  const socials = await getAllSocialLinksAdmin()

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

        <div className="font-mono text-[var(--green-dim)] text-sm mb-2">$ ls -la socials/</div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-mono font-bold text-white">
            <span className="text-accent">//</span> redes sociales
          </h1>
        </div>

        <div className="terminal-window">
          <div className="terminal-header">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]/70" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/70" />
              <div className="w-3 h-3 rounded-full bg-[#28c940]/70" />
            </div>
            <span className="text-[#8b949e] text-xs font-mono">socials.db — {socials.length} registros</span>
            <div className="w-14" />
          </div>

          <div className="terminal-body divide-y divide-[rgba(var(--green-rgb),0.08)]">
            {socials.length === 0 ? (
              <p className="p-6 font-mono text-[#8b949e] text-sm">
                No hay redes sociales configuradas. Las redes se agregan desde Settings.
              </p>
            ) : (
              socials.map((social) => (
                <div key={social.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[rgba(var(--green-rgb),0.03)] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${social.active ? "bg-accent" : "bg-[#8b949e]"}`} />
                    <span className="font-mono text-white text-sm capitalize">{social.platform}</span>
                    <span className="font-mono text-[#8b949e] text-xs truncate max-w-xs">{social.url}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a href={social.url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-[#8b949e] hover:text-accent transition-colors" title="Ver">
                      <ExternalLink size={14} />
                    </a>
                    <Link href={`/admin/socials/edit/${social.id}`} className="p-1.5 text-[#8b949e] hover:text-accent transition-colors" title="Editar">
                      <Pencil size={14} />
                    </Link>
                    <AdminDeleteSocialButton id={social.id} />
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
