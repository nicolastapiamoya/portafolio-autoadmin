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
              location_en: configMap.location_en ?? "",
              siteTitle: configMap.siteTitle ?? "",
              siteTitle_en: configMap.siteTitle_en ?? "",
              siteDescription: configMap.siteDescription ?? "",
              siteDescription_en: configMap.siteDescription_en ?? "",
              name: configMap.name ?? "",
              name_en: configMap.name_en ?? "",
              tagline: configMap.tagline ?? "",
              tagline_en: configMap.tagline_en ?? "",
              role: configMap.role ?? "",
              role_en: configMap.role_en ?? "",
              company: configMap.company ?? "",
              aboutBio: configMap.aboutBio ?? "",
              aboutBio_en: configMap.aboutBio_en ?? "",
              experienceLabel: configMap.experienceLabel ?? "",
              experienceLabel_en: configMap.experienceLabel_en ?? "",
            }}
          />
          <SocialsManager socials={socials} />
        </div>
      </div>
    </main>
  )
}
