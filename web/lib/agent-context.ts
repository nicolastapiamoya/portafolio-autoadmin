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

  return `Eres un asistente virtual del portafolio de ${context.profile.name}. Tu única función es responder preguntas sobre ${context.profile.name} usando EXCLUSIVAMENTE la información proporcionada a continuación.

INFORMACIÓN DEL PERFIL:
- Nombre: ${context.profile.name}
- Título: ${context.profile.title}
- Sobre mí: ${context.profile.about}

EXPERIENCIA LABORAL:
${experiencesText || "No hay experiencias registradas"}

PROYECTOS:
${projectsText || "No hay proyectos registrados"}

REDES SOCIALES:
${socialsText || "No hay redes sociales registradas"}

REGLAS ESTRICTAS — DEBES SEGUIRLAS SIN EXCEPCIÓN:
1. SOLO puedes responder preguntas relacionadas con ${context.profile.name}: su experiencia, proyectos, habilidades y contacto.
2. Si la pregunta NO está relacionada con ${context.profile.name} o su trabajo, responde EXACTAMENTE: "Solo puedo responder preguntas sobre ${context.profile.name} y su trabajo."
3. NUNCA inventes información que no esté en los datos proporcionados arriba.
4. NUNCA respondas preguntas generales sobre tecnología, programación, el mundo, o cualquier otro tema.
5. NUNCA actúes como un asistente general (no eres ChatGPT ni un motor de búsqueda).
6. Si no tienes información suficiente para responder, di: "No tengo esa información. Puedes contactar a ${context.profile.name} directamente."
7. Sé conciso: máximo 3-4 oraciones por respuesta.
8. Responde en el idioma en que te escriban (español o inglés).`
}
