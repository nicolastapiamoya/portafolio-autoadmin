"use client"
import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { ChevronDown } from "lucide-react"
import ParticlesBackground from "./ParticlesBackground"
import { useLanguage } from "@/context/LanguageContext"

const TYPING_TEXTS = [
  "Software Engineer II",
  "Senior Backend Engineer",
  "Go & Node.js Developer",
  "Microservices Architect",
]

interface HeroProps {
  config?: Record<string, string>
}

export default function Hero({ config = {} }: HeroProps) {
  const { t, lang } = useLanguage()
  const [displayText, setDisplayText] = useState("")
  const [textIndex, setTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [waiting, setWaiting] = useState(false)

  const nameKey = lang === 'en' && config.name_en ? 'name_en' : 'name'
  const taglineKey = lang === 'en' && config.tagline_en ? 'tagline_en' : 'tagline'
  
  const name = config[nameKey] ?? "Name"
  const tagline = config[taglineKey] ?? t.hero.bio
  const siteTitle = config.siteTitle ?? "yourwebsite.com"
  
  const nameParts = name.split(" ")
  const firstName = nameParts[0] ?? "Name"
  const lastNames = nameParts.slice(1).join(" ") ?? "Lastname"

  useEffect(() => {
    if (waiting) return
    const text = TYPING_TEXTS[textIndex]
    const speed = isDeleting ? 45 : 95

    const timeout = setTimeout(() => {
      if (!isDeleting && displayText.length < text.length) {
        setDisplayText(text.slice(0, displayText.length + 1))
      } else if (!isDeleting && displayText.length === text.length) {
        setWaiting(true)
        setTimeout(() => {
          setWaiting(false)
          setIsDeleting(true)
        }, 2200)
      } else if (isDeleting && displayText.length > 0) {
        setDisplayText(displayText.slice(0, -1))
      } else {
        setIsDeleting(false)
        setTextIndex((i) => (i + 1) % TYPING_TEXTS.length)
      }
    }, speed)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, textIndex, waiting])

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: delay / 1000, ease: "easeOut" as const },
  })

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-page scanlines">
      <ParticlesBackground />

      {/* Radial green glow centre */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(var(--green-rgb),0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-3xl w-full mx-4 sm:mx-6">
        {/* Terminal window */}
        <div className="terminal-window shadow-[0_0_60px_rgba(var(--green-rgb),0.08)]">
          {/* Header */}
          <div className="terminal-header">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c940]" />
            </div>
            <span className="text-muted text-xs">
              bash — {config.siteTitle ?? "yourwebsite.com"} — 80x24
            </span>
            <div className="w-14" />
          </div>

          {/* Body */}
          <div className="terminal-body px-6 py-8 sm:px-10 sm:py-10">
            <motion.div {...fadeUp(200)}>
              <p className="text-[var(--green-dim)] text-sm mb-2">$ whoami</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-primary">
                {firstName}{" "}
                <span className="text-accent glow-green">{lastNames}</span>
              </h1>
            </motion.div>

            <motion.div {...fadeUp(500)} className="mt-6">
              <p className="text-[var(--green-dim)] text-sm mb-2">$ cat role.txt</p>
              <div className="flex items-center gap-1 min-h-[2rem]">
                <span className="text-accent text-xl">{">"}</span>
                <span className="text-primary text-xl ml-2 font-mono">
                  {displayText}
                </span>
                <span className="cursor-blink text-accent text-xl ml-0.5">
                  |
                </span>
              </div>
              <p className="mt-4 text-muted text-sm leading-relaxed max-w-lg">
                {"//"} {config.tagline ?? t.hero.bio}
              </p>
            </motion.div>

            <motion.div {...fadeUp(800)} className="mt-8 flex flex-wrap gap-3">
              <a href="/#projects" className="btn-terminal">
                {t.hero.cta_projects}
              </a>
              <a href="/#about" className="btn-terminal-outline">
                {t.hero.cta_about}
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[var(--green-dim)]"
      >
        <span className="font-mono text-xs">{t.hero.scroll}</span>
        <ChevronDown size={16} className="animate-bounce" />
      </motion.div>
    </section>
  )
}
