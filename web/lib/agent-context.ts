import { getAllExperiences, getAllProjects, getAllSocialLinks, getSiteConfig } from "./cms"
import { getAllPosts } from "./posts"

export interface AgentContext {
  profile: {
    name: string
    title: string
    about: string
    siteUrl: string
  }
  experiences: Awaited<ReturnType<typeof getAllExperiences>>
  projects: Awaited<ReturnType<typeof getAllProjects>>
  socials: Awaited<ReturnType<typeof getAllSocialLinks>>
  posts: Awaited<ReturnType<typeof getAllPosts>>
}

export async function getAgentContext(): Promise<AgentContext> {
  const [experiences, projects, socials, posts, nameConfig, titleConfig, aboutConfig, siteUrlConfig] =
    await Promise.all([
      getAllExperiences(),
      getAllProjects(),
      getAllSocialLinks(),
      getAllPosts(),
      getSiteConfig("name"),
      getSiteConfig("role"),
      getSiteConfig("aboutBio"),
      getSiteConfig("siteUrl"),
    ])

  return {
    profile: {
      name: nameConfig?.value || "",
      title: titleConfig?.value || "",
      about: aboutConfig?.value || "",
      siteUrl: siteUrlConfig?.value || process.env.NEXTAUTH_URL || "",
    },
    experiences,
    projects,
    socials,
    posts,
  }
}

export function buildSystemPrompt(context: AgentContext): string {
  const hasProfile = context.profile.name || context.profile.title || context.profile.about

  if (!hasProfile && context.experiences.length === 0 && context.projects.length === 0) {
    return `Eres un asistente virtual de portafolio. El administrador aún no ha configurado la información del perfil.
INSTRUCCIÓN CRÍTICA: NO inventes ningún dato, nombre, habilidad ni experiencia.
Cuando te pregunten sobre la persona, responde EXACTAMENTE: "El administrador aún no ha configurado la información de este portafolio."
No digas nada más sobre la persona.`
  }

  const experiencesText = context.experiences
    .map(
      (e) =>
        `- ${e.role} en ${e.company} (${e.location}) desde ${e.startDate}${
          e.current ? " - presente" : ` hasta ${e.endDate}`
        }. ${e.description}. Tecnologías: ${e.techStack.join(", ")}`
    )
    .join("\n")

  const projectsText = context.projects
    .map(
      (p) =>
        `- ${p.title}: ${p.description}. Demo: ${p.demoUrl || "N/A"}, Repo: ${
          p.repoUrl || "N/A"
        }. Tech: ${p.techStack.join(", ")}`
    )
    .join("\n")

  const socialsText = context.socials
    .map((s) => `- ${s.platform}: ${s.url}`)
    .join("\n")

  const postsText = context.posts
    .map((p) => {
      const url = context.profile.siteUrl
        ? `${context.profile.siteUrl.replace(/\/$/, "")}/blog/${p.slug}`
        : `/blog/${p.slug}`
      const tags = p.tags.length ? ` [${p.tags.join(", ")}]` : ""
      return `- "${p.title}"${tags}: ${p.excerpt || "(sin resumen)"}. Link: ${url}`
    })
    .join("\n")

  const displayName = context.profile.name || "esta persona"
  const firstName = context.profile.name.split(" ")[0] || "el portafolio"

  return `IDENTIDAD: Eres el asistente virtual de ${displayName}.

DATOS PERSONA:
Nombre: ${context.profile.name || "(no configurado)"}
Título: ${context.profile.title || "(no configurado)"}
Sobre: ${context.profile.about || "(no configurado)"}

EXPERIENCIAS:
${experiencesText || "(sin datos registrados)"}

PROYECTOS:
${projectsText || "(sin datos registrados)"}

ARTÍCULOS DEL BLOG:
${postsText || "(sin artículos publicados)"}

REDES:
${socialsText || "(sin datos registrados)"}

INSTRUCCIONES CRÍTICAS - DEBES SEGUIRLAS EXACTAMENTE:
- NUNCA inventes, supongas ni agregues información que no esté en los datos de arriba
- Si un campo dice "(no configurado)" o "(sin datos registrados)", responde que esa información no está disponible
- Tu nombre es "Asistente de ${firstName}"
- SOLO habla sobre la información que aparece explícitamente arriba
- Si preguntan algo que no está en los datos, responde: "No tengo esa información disponible."
- Cuando menciones un artículo del blog, incluye siempre su link completo
- Máximo 3 oraciones por respuesta
- Idioma: responde en español o inglés según la pregunta
- NO te presentes como "soy un modelo" ni "soy una IA"
- NO respondas sobre tecnología general, cocina, ni temas fuera del perfil`
}
