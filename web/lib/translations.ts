export const translations = {
  es: {
    nav: {
      about: "sobre mí",
      projects: "proyectos",
      blog: "blog",
      contact: "contacto",
    },
    hero: {
      bio: "Backend engineer con +7 años de experiencia. Actualmente en Cencosud liderando microservicios de e-commerce de alto tráfico con Go, NestJS y Kubernetes.",
      scroll: "scroll para explorar",
      cta_projects: "./projects.sh",
      cta_about: "./about.sh",
    },
    about: {
      title: "// sobre mí",
      experience_label: "+7 años",
      bio: "Backend engineer con +7 años en microservicios de alto tráfico. Dev Lead en Paris y White Label (Cencosud). Proyectos propios en SaaS, pagos y orquestación de agentes IA con múltiples LLMs (Claude, GPT, DeepSeek, Ollama).",
      experience_cmd: "$ cat experience.log",
      currently: "actualidad",
      skills_cmd: (cat: string) => `$ ls skills/${cat}/`,
    },
    projects: {
      cmd: "$ ls -la projects/",
      title: "// proyectos",
    },
    contact: {
      title: "// hablemos",
      bio: "Abierto a nuevas oportunidades, proyectos freelance y colaboraciones interesantes.",
    },
  },
  en: {
    nav: {
      about: "about",
      projects: "projects",
      blog: "blog",
      contact: "contact",
    },
    hero: {
      bio: "Backend engineer with 7+ years of experience. Currently at Cencosud leading high-traffic e-commerce microservices with Go, NestJS and Kubernetes.",
      scroll: "scroll to explore",
      cta_projects: "./projects.sh",
      cta_about: "./about.sh",
    },
    about: {
      title: "// about me",
      experience_label: "+7 years",
      bio: "Backend engineer specialised in high-traffic microservices. Dev Lead at Paris App (Cencosud). Personal projects in SaaS, payments and AI agent orchestration with multiple LLMs (Claude, GPT, DeepSeek, Ollama).",
      experience_cmd: "$ cat experience.log",
      currently: "present",
      skills_cmd: (cat: string) => `$ ls skills/${cat}/`,
    },
    projects: {
      cmd: "$ ls -la projects/",
      title: "// projects",
    },
    contact: {
      title: "// let's talk",
      bio: "Open to new opportunities, freelance projects and interesting collaborations.",
    },
  },
}

export type Language = "es" | "en"
