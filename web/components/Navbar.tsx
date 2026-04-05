"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { lang, t, setLang } = useLanguage()

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navLinks = [
    { label: t.nav.about, href: "/#about" },
    { label: t.nav.projects, href: "/#projects" },
    { label: t.nav.blog, href: "/blog" },
    { label: t.nav.contact, href: "/#contact" },
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-page/95 backdrop-blur-md border-b border-[var(--terminal-border)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono font-bold text-lg text-accent hover:text-[var(--green-bright)] transition-colors"
        >
          <span className="text-[var(--green-dim)]">~/</span>ntm
          <span className="cursor-blink text-accent">_</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-mono text-sm text-muted hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* Controls */}
          <div className="flex items-center gap-2 ml-2 border-l border-[var(--terminal-border)] pl-4">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              className="font-mono text-xs text-muted hover:text-accent transition-colors flex items-center gap-1 px-2 py-1 border border-[var(--terminal-border)] hover:border-[var(--green)]"
              aria-label="Toggle language"
              title={lang === "es" ? "Switch to English" : "Cambiar a Español"}
            >
              {lang === "es" ? "🇨🇱 ES" : "🇺🇸 EN"}
            </button>

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-muted hover:text-accent transition-colors p-1.5 border border-[var(--terminal-border)] hover:border-[var(--green)]"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile row */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="font-mono text-xs text-muted hover:text-accent transition-colors"
            aria-label="Toggle language"
          >
            {lang === "es" ? "🇨🇱" : "🇺🇸"}
          </button>
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted hover:text-accent transition-colors p-1"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          )}
          <button
            className="text-muted hover:text-accent transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-surface border-t border-[var(--terminal-border)] px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-mono text-sm text-muted hover:text-accent transition-colors"
            >
              <span className="text-[var(--green-dim)]">$</span> {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
