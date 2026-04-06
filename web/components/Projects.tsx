"use client"
import { motion } from "motion/react"
import { useInView } from "@/hooks/useInView"
import { ExternalLink, Terminal } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  )
}

interface Project {
  id: number
  title: string
  slug: string
  description: string
  techStack: string[]
  demoUrl: string
  repoUrl: string
  imageUrl: string
  featured: boolean
  order: number
}

interface ProjectsProps {
  projects?: Project[]
}

const STATUS_COLORS: Record<string, string> = {
  production: "var(--green)",
  beta: "#ffbd2e",
  development: "#8b949e",
  "open source": "var(--green)",
  "en desarrollo": "#ffbd2e",
  completado: "var(--green-dim)",
}

function ProjectCard({ project }: { project: Project }) {
  const status = project.featured ? "destacado" : "en desarrollo"

  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(var(--green-rgb),0.12)" }}
      transition={{ duration: 0.2 }}
      className="terminal-window h-full flex flex-col"
    >
      {/* Card header */}
      <div className="terminal-header">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]/70" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/70" />
          <div className="w-3 h-3 rounded-full bg-[#28c940]/70" />
        </div>
        <span className="text-muted text-xs font-mono">
          {project.slug}.sh
        </span>
        <div className="flex gap-3 items-center">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent transition-colors"
            >
              <GithubIcon size={14} />
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent transition-colors"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="terminal-body p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3 gap-2">
          <h3 className="font-mono font-bold text-primary text-base leading-snug">
            {project.title}
          </h3>
          <span
            className="text-xs font-mono px-2 py-0.5 border shrink-0"
            style={{
              color: STATUS_COLORS[status] ?? "#8b949e",
              borderColor: (STATUS_COLORS[status] ?? "#8b949e") + "55",
            }}
          >
            [{status}]
          </span>
        </div>

        <p className="font-mono text-muted text-xs leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {project.techStack.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects({ projects = [] }: ProjectsProps) {
  const { t } = useLanguage()
  const [ref, visible] = useInView({ threshold: 0.05 })

  const displayProjects = projects.length > 0 ? projects : null

  return (
    <section id="projects" className="py-28 bg-page2">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <motion.div
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <div className="font-mono text-[var(--green-dim)] text-sm mb-2 flex items-center gap-2">
            <Terminal size={14} />{t.projects.cmd}
          </div>
          <h2 className="text-3xl font-mono font-bold text-primary mb-12">
            <span className="text-accent">//</span> {t.projects.title.replace("// ", "")}
          </h2>
        </motion.div>

        {displayProjects ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayProjects.map((project, i) => (
              <motion.div
                key={project.id}
                animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 40 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: "easeOut" as const }}
                className="flex"
              >
                <div className="w-full">
                  <ProjectCard project={project} />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="terminal-window p-8 text-center">
            <p className="font-mono text-[#8b949e] text-sm">
              No hay proyectos registrados. Agrégalos desde el admin.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
