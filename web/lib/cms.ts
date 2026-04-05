import { PrismaClient } from "@prisma/client"

type PrismaExperience = Awaited<ReturnType<PrismaClient["experience"]["findFirst"]>>
type PrismaProject = Awaited<ReturnType<PrismaClient["project"]["findFirst"]>>
type PrismaSocialLink = Awaited<ReturnType<PrismaClient["socialLink"]["findFirst"]>>
type PrismaSiteConfig = Awaited<ReturnType<PrismaClient["siteConfig"]["findFirst"]>>

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["error"] })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// ── Experience ──
export interface Experience {
  id: number
  company: string
  role: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  techStack: string[]
  order: number
}

export async function getAllExperiences(): Promise<Experience[]> {
  const rows = await prisma.experience.findMany({
    orderBy: [{ current: "desc" }, { order: "asc" }, { startDate: "desc" }],
  })
  return rows.map((r) => ({
    id: r.id,
    company: r.company,
    role: r.role,
    location: r.location,
    startDate: r.startDate,
    endDate: r.endDate,
    current: r.current,
    description: r.description,
    techStack: r.techStack,
    order: r.order,
  }))
}

export async function getExperienceById(id: number): Promise<Experience | null> {
  const r = await prisma.experience.findUnique({ where: { id } })
  if (!r) return null
  return {
    id: r.id,
    company: r.company,
    role: r.role,
    location: r.location,
    startDate: r.startDate,
    endDate: r.endDate,
    current: r.current,
    description: r.description,
    techStack: r.techStack,
    order: r.order,
  }
}

export async function createExperience(data: Omit<Experience, "id">): Promise<number> {
  const result = await prisma.experience.create({
    data: {
      company: data.company,
      role: data.role,
      location: data.location,
      startDate: data.startDate,
      endDate: data.endDate,
      current: data.current,
      description: data.description,
      techStack: data.techStack,
      order: data.order,
    },
  })
  return result.id
}

export async function updateExperience(
  id: number,
  data: Omit<Experience, "id">
): Promise<void> {
  await prisma.experience.update({
    where: { id },
    data: {
      company: data.company,
      role: data.role,
      location: data.location,
      startDate: data.startDate,
      endDate: data.endDate,
      current: data.current,
      description: data.description,
      techStack: data.techStack,
      order: data.order,
    },
  })
}

export async function deleteExperience(id: number): Promise<void> {
  await prisma.experience.delete({ where: { id } })
}

// ── Project ──
export interface Project {
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

export async function getAllProjects(): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }],
  })
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    description: r.description,
    techStack: r.techStack,
    demoUrl: r.demoUrl,
    repoUrl: r.repoUrl,
    imageUrl: r.imageUrl,
    featured: r.featured,
    order: r.order,
  }))
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const r = await prisma.project.findUnique({ where: { slug } })
  if (!r) return null
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    description: r.description,
    techStack: r.techStack,
    demoUrl: r.demoUrl,
    repoUrl: r.repoUrl,
    imageUrl: r.imageUrl,
    featured: r.featured,
    order: r.order,
  }
}

export async function getProjectById(id: number): Promise<Project | null> {
  const r = await prisma.project.findUnique({ where: { id } })
  if (!r) return null
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    description: r.description,
    techStack: r.techStack,
    demoUrl: r.demoUrl,
    repoUrl: r.repoUrl,
    imageUrl: r.imageUrl,
    featured: r.featured,
    order: r.order,
  }
}

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60)
    .replace(/-$/, "")
}

export async function createProject(data: Omit<Project, "id" | "slug">): Promise<string> {
  const baseSlug = toSlug(data.title)
  let slug = baseSlug
  let attempt = 0
  while (await prisma.project.findUnique({ where: { slug } })) {
    attempt++
    slug = `${baseSlug}-${attempt}`
  }
  await prisma.project.create({
    data: {
      slug,
      title: data.title,
      description: data.description,
      techStack: data.techStack,
      demoUrl: data.demoUrl,
      repoUrl: data.repoUrl,
      imageUrl: data.imageUrl,
      featured: data.featured,
      order: data.order,
    },
  })
  return slug
}

export async function updateProject(id: number, data: Omit<Project, "id">): Promise<void> {
  await prisma.project.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      techStack: data.techStack,
      demoUrl: data.demoUrl,
      repoUrl: data.repoUrl,
      imageUrl: data.imageUrl,
      featured: data.featured,
      order: data.order,
    },
  })
}

export async function deleteProject(id: number): Promise<void> {
  await prisma.project.delete({ where: { id } })
}

// ── SocialLink ──
export interface SocialLink {
  id: number
  platform: string
  url: string
  icon: string
  order: number
  active: boolean
}

export async function getAllSocialLinks(): Promise<SocialLink[]> {
  const rows = await prisma.socialLink.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  })
  return rows.map((r) => ({
    id: r.id,
    platform: r.platform,
    url: r.url,
    icon: r.icon,
    order: r.order,
    active: r.active,
  }))
}

export async function getAllSocialLinksAdmin(): Promise<SocialLink[]> {
  const rows = await prisma.socialLink.findMany({
    orderBy: { order: "asc" },
  })
  return rows.map((r) => ({
    id: r.id,
    platform: r.platform,
    url: r.url,
    icon: r.icon,
    order: r.order,
    active: r.active,
  }))
}

export async function createSocialLink(data: Omit<SocialLink, "id">): Promise<number> {
  const result = await prisma.socialLink.create({
    data: {
      platform: data.platform,
      url: data.url,
      icon: data.icon,
      order: data.order,
      active: data.active,
    },
  })
  return result.id
}

export async function updateSocialLink(id: number, data: Omit<SocialLink, "id">): Promise<void> {
  await prisma.socialLink.update({
    where: { id },
    data: {
      platform: data.platform,
      url: data.url,
      icon: data.icon,
      order: data.order,
      active: data.active,
    },
  })
}

export async function deleteSocialLink(id: number): Promise<void> {
  await prisma.socialLink.delete({ where: { id } })
}

// ── SiteConfig ──
export interface SiteConfig {
  id: number
  key: string
  value: string
  description: string
}

export async function getAllSiteConfigs(): Promise<SiteConfig[]> {
  const rows = await prisma.siteConfig.findMany({ orderBy: { key: "asc" } })
  return rows.map((r) => ({
    id: r.id,
    key: r.key,
    value: r.value,
    description: r.description,
  }))
}

export async function getSiteConfig(key: string): Promise<SiteConfig | null> {
  const r = await prisma.siteConfig.findUnique({ where: { key } })
  if (!r) return null
  return { id: r.id, key: r.key, value: r.value, description: r.description }
}

export async function setSiteConfig(key: string, value: string, description?: string): Promise<void> {
  await prisma.siteConfig.upsert({
    where: { key },
    create: { key, value, description: description ?? "" },
    update: { value, ...(description && { description }) },
  })
}

export async function deleteSiteConfig(id: number): Promise<void> {
  await prisma.siteConfig.delete({ where: { id } })
}
