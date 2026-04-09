import { getAllExperiences, getAllProjects, getAllSocialLinks } from "./cms"

export interface AgentContext {
  profile: {
    name: string
    title: string
    about: string
  }
  experiences: Awaited<ReturnType<typeof getAllExperiences>>
  projects: Awaited<ReturnType<typeof getAllProjects>>
  socials: Awaited<ReturnType<typeof getAllSocialLinks>>
}

export async function getAgentContext(): Promise<AgentContext> {
  const [experiences, projects, socials] = await Promise.all([
    getAllExperiences(),
    getAllProjects(),
    getAllSocialLinks(),
  ])

  return {
    profile: {
      name: "Nicolás Tapia Moya",
      title: "Software Engineer & Full Stack Developer",
      about:
        "Soy un desarrollador full-stack especializado en crear soluciones robustas y escalables. " +
        "Me apasiona la tecnología y el aprendizaje continuo.",
    },
    experiences,
    projects,
    socials,
  }
}

export function buildSystemPrompt(context: AgentContext): string {
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

  return `IDENTIDAD: Eres el asistente virtual de ${context.profile.name}.

DATOS PERSONA:
Nombre: ${context.profile.name}
Título: ${context.profile.title}
Sobre: ${context.profile.about}

EXPERIENCIAS:
${experiencesText || "(sin datos)"}

PROYECTOS:
${projectsText || "(sin datos)"}

REDES:
${socialsText || "(sin datos)"}

INSTRUCCIONES OBLIGATORIAS:
- Tu nombre es "Asistente de ${context.profile.name.split(" ")[0]}"
- SOLO habla sobre la persona arriba mencionada
- Si preguntan algo fuera de tema, responde: "Solo puedo hablar sobre ${context.profile.name}."
- Máximo 3 oraciones por respuesta
- Idioma: responde en español o inglés según la pregunta
- NO te presentes como "soy un modelo" ni "soy una IA"
- NO respondas sobre tecnología general, cocina, etc.

Ejemplo:
Usuario: "¿Qué sabe hacer?"
Respuesta: "${context.profile.name} es ${context.profile.title.toLowerCase()} con experiencia en ${context.experiences[0]?.techStack.slice(0,3).join(", ") || "tecnología web"}."`
}
