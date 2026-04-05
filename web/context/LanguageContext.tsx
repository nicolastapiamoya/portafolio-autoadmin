"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { translations, Language } from "@/lib/translations"

interface LanguageContextType {
  lang: Language
  t: typeof translations.es
  setLang: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "es",
  t: translations.es,
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("es")

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Language | null
    if (stored === "es" || stored === "en") setLangState(stored)
  }, [])

  const setLang = (l: Language) => {
    setLangState(l)
    localStorage.setItem("lang", l)
  }

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
