"use client"
import { motion } from "motion/react"
import { useInView } from "@/hooks/useInView"
import { useLanguage } from "@/context/LanguageContext"

const SKILLS = [
  {
    category: "backend & APIs",
    items: ["Go (Gin / FX)", "Node.js", "NestJS", "TypeScript", "gRPC", "REST"],
  },
  {
    category: "AI & LLMs",
    items: ["Claude", "GPT", "DeepSeek", "Ollama", "Kokoro TTS", "Multi-Agent"],
  },
  {
    category: "databases",
    items: ["PostgreSQL", "MongoDB", "MariaDB", "DynamoDB", "MySQL", "Redis"],
  },
  {
    category: "devops & cloud",
    items: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "GitHub Actions"],
  },
  {
    category: "frontend & otros",
    items: ["React", "Next.js", "React Native", "Flutter", "Vue.js", "PHP", "Java"],
  },
]

const EXPERIENCE = [
  {
    company: "Cencosud S.A.",
    role: "Software Engineer II · Senior Backend Engineer",
    period: "jun. 2022 – actualidad",
    items: [
      "Dev Lead Backend en Paris App, Home Headless y Cart Headless",
      "Microservicios en Go (Gin, FX, gRPC) y Node.js / NestJS",
      "Proyectos White Label para Chile, Colombia y Argentina",
      "Integración con SFCC, Commerce Tools y VTEX",
      "Orquestación con Docker y Kubernetes",
    ],
  },
  {
    company: "BC Tecnología",
    role: "Full-stack Developer (Backend-focused)",
    period: "feb. 2021 – jun. 2022",
    items: [
      "Backend para Paris App en Cencosud",
      "Microservicios en Node.js / NestJS con Salesforce OCAPI",
      "APIs REST, Docker y Kubernetes en producción",
    ],
  },
  {
    company: "Cooperativa Lautaro Rosas",
    role: "Analista de Programación",
    period: "feb. 2020 – ene. 2021",
    items: ["Aplicaciones web con PHP y Vue.js", "Mantenimiento de sistemas"],
  },
  {
    company: "Trabajos anteriores (2017 – 2020)",
    role: "IT Arrow · Axia Tecnologia · Aligare · T&S S.A.",
    period: "abr. 2017 – ene. 2020",
    items: [
      "Java Android, PHP, JavaScript, C#, SQL Server",
      "Migración de servidores y BD a AWS",
      "Desarrollo web y soporte de red",
    ],
  },
]

function SkillGroup({
  group,
  delay,
  visible,
  skillsCmd,
}: {
  group: (typeof SKILLS)[0]
  delay: number
  visible: boolean
  skillsCmd: (cat: string) => string
}) {
  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 40 }}
      transition={{ duration: 0.6, delay: delay / 1000, ease: "easeOut" as const }}
      className="terminal-window p-4"
    >
      <p className="font-mono text-[var(--green-dim)] text-xs mb-3">
        {skillsCmd(group.category)}
      </p>
      <div className="flex flex-wrap gap-2">
        {group.items.map((item) => (
          <span key={item} className="tag">
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function About() {
  const { t } = useLanguage()
  const [ref, visible] = useInView()

  return (
    <section id="about" className="relative py-28 bg-page">
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      <div className="sep-line" />

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6 pt-8">
        <div className="font-mono text-[var(--green-dim)] text-sm mb-2">
          $ cat about.txt
        </div>
        <h2 className="text-3xl font-mono font-bold text-primary mb-12">
          <span className="text-accent">//</span> {t.about.title.replace("// ", "")}
        </h2>

          {/* Top row: info card + skills */}
          <div className="grid md:grid-cols-2 gap-10 items-start mb-14">
            <motion.div
              animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -40 }}
              transition={{ duration: 0.6, ease: "easeOut" as const }}
              className="terminal-window"
            >
              <div className="terminal-header">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]/70" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/70" />
                  <div className="w-3 h-3 rounded-full bg-[#28c940]/70" />
                </div>
                <span className="text-muted text-xs">about.md</span>
                <div className="w-14" />
              </div>
              <div className="terminal-body p-6 font-mono text-sm space-y-3">
                <p>
                  <span className="text-accent">name:</span>{" "}
                  <span className="text-primary">Nicolás Tapia Moya</span>
                </p>
                <p>
                  <span className="text-accent">location:</span>{" "}
                  <span className="text-primary">Santiago, Chile 🇨🇱</span>
                </p>
                <p>
                  <span className="text-accent">role:</span>{" "}
                  <span className="text-primary">Software Engineer II</span>
                </p>
                <p>
                  <span className="text-accent">company:</span>{" "}
                  <span className="text-primary">Cencosud S.A.</span>
                </p>
                <p>
                  <span className="text-accent">experience:</span>{" "}
                  <span className="text-primary">{t.about.experience_label}</span>
                </p>
                <div className="border-t border-[rgba(var(--green-rgb),0.12)] pt-3 mt-3">
                  <p className="text-muted leading-relaxed">
                    {"// "} {t.about.bio}
                  </p>
                </div>
                <p className="text-[var(--green-dim)] cursor-blink mt-1">_</p>
              </div>
            </motion.div>

            {/* Skills */}
            <div className="space-y-4">
              {SKILLS.map((group, i) => (
                <SkillGroup
                  key={group.category}
                  group={group}
                  delay={(i + 1) * 120}
                  visible={visible}
                  skillsCmd={t.about.skills_cmd}
                />
              ))}
            </div>
          </div>

          {/* Experience timeline */}
          <motion.div
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 30 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" as const }}
          >
            <div className="font-mono text-[var(--green-dim)] text-sm mb-6">
              {t.about.experience_cmd}
            </div>
            <div className="relative border-l border-[rgba(var(--green-rgb),0.2)] ml-3 space-y-8">
              {EXPERIENCE.map((job, i) => (
                <motion.div
                  key={job.company}
                  animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -20 }}
                  transition={{ duration: 0.5, delay: 0.35 + i * 0.1, ease: "easeOut" as const }}
                  className="relative pl-6"
                >
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--green)] border-2 border-[var(--bg)]" />
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 mb-1">
                    <span className="font-mono font-bold text-primary text-sm">
                      {job.company}
                    </span>
                    <span className="font-mono text-[var(--green-dim)] text-xs">
                      [{job.period}]
                    </span>
                  </div>
                  <p className="font-mono text-accent text-xs mb-2">
                    {job.role}
                  </p>
                  <ul className="space-y-1">
                    {job.items.map((item) => (
                      <li
                        key={item}
                        className="font-mono text-muted text-xs flex gap-2"
                      >
                        <span className="text-[var(--green-dim)] shrink-0">▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
      </div>
    </section>
  )
}
