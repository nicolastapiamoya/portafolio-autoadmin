import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getAllSiteConfigs, getAllSocialLinksAdmin } from "@/lib/cms"
import AdminLogout from "@/components/AdminLogout"
import SettingsForm from "@/components/SettingsForm"
import SocialsManager from "@/components/SocialsManager"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const configs = await getAllSiteConfigs()
  const socials = await getAllSocialLinksAdmin()

  const configMap = Object.fromEntries(configs.map((c) => [c.key, c.value]))

  return (
    <main className="min-h-screen bg-page pt-8 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-mono text-sm text-[#8b949e] hover:text-accent transition-colors">
            <ArrowLeft size={14} />
            cd ~/home
          </Link>
          <AdminLogout />
        </div>

        <div className="font-mono text-[var(--green-dim)] text-sm mb-2">$ cat settings.yml</div>
        <h1 className="text-2xl font-mono font-bold text-white mb-8">
          <span className="text-accent">//</span> configuración
        </h1>

        <div className="space-y-8">
          <SettingsForm
            initialData={{
              email: configMap.email ?? "",
              linkedin: configMap.linkedin ?? "",
              github: configMap.github ?? "",
              location: configMap.location ?? "",
              siteTitle: configMap.siteTitle ?? "",
              siteDescription: configMap.siteDescription ?? "",
              name: configMap.name ?? "",
              tagline: configMap.tagline ?? "",
              role: configMap.role ?? "",
              company: configMap.company ?? "",
              aboutBio: configMap.aboutBio ?? "",
            }}
          />
          <SocialsManager socials={socials} />
        </div>
      </div>
    </main>
  )
}
