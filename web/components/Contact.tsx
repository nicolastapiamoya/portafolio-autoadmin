"use client"
import { motion } from "motion/react"
import { useInView } from "@/hooks/useInView"
import { Mail } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  )
}

function TwitterIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

interface SocialLink {
  id: number
  platform: string
  url: string
  icon: string
  order: number
  active: boolean
}

interface ContactProps {
  socials?: SocialLink[]
  config?: Record<string, string>
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  github: <GithubIcon size={18} />,
  linkedin: <LinkedinIcon size={18} />,
  twitter: <TwitterIcon size={18} />,
  x: <TwitterIcon size={18} />,
}

export default function Contact({ socials = [], config = {} }: ContactProps) {
  const { t } = useLanguage()
  const [ref, visible] = useInView()

  const email = config.email ?? "nicousm46@gmail.com"
  const activeSocials = socials.filter((s: SocialLink) => s.active)

  return (
    <section id="contact" className="py-28 bg-page">
      <div className="sep-line mb-16" />
      <motion.div
        ref={ref}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 30 }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
        className="max-w-2xl mx-auto px-6 text-center"
      >
        <div className="font-mono text-[var(--green-dim)] text-sm mb-2">
          $ contact --help
        </div>
        <h2 className="text-3xl font-mono font-bold text-primary mb-4">
          <span className="text-accent">//</span> {t.contact.title.replace("// ", "")}
        </h2>
        <p className="font-mono text-muted text-sm mb-10 leading-relaxed">
          {"//"} {t.contact.bio}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={`mailto:${email}`}
            className="social-link"
          >
            <Mail size={18} />
            <span>{email}</span>
          </a>

          {activeSocials.map((social: SocialLink) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              {PLATFORM_ICONS[social.platform.toLowerCase()] || <GithubIcon size={18} />}
              <span>{social.platform}</span>
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
