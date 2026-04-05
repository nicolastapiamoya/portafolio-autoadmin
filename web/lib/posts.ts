import { PrismaClient } from "@prisma/client"

type PrismaPost = Awaited<ReturnType<PrismaClient["post"]["findFirst"]>>

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["error"] })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export interface Post {
  id: number
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  tags: string[]
  published: boolean
}

export async function getAllPosts(): Promise<Post[]> {
  const rows = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  })
  return rows.map((r: NonNullable<PrismaPost>) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    date: r.createdAt.toISOString(),
    excerpt: r.excerpt,
    content: r.content,
    tags: r.tags,
    published: r.published,
  }))
}

export async function getAllPostsAdmin(): Promise<Post[]> {
  const rows = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  })
  return rows.map((r: NonNullable<PrismaPost>) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    date: r.createdAt.toISOString(),
    excerpt: r.excerpt,
    content: r.content,
    tags: r.tags,
    published: r.published,
  }))
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const row = await prisma.post.findUnique({ where: { slug } })
  if (!row) return null
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: row.createdAt.toISOString(),
    excerpt: row.excerpt,
    content: row.content,
    tags: row.tags,
    published: row.published,
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

export async function updatePost(
  id: number,
  data: { title: string; content: string; excerpt: string; tags: string[]; published: boolean }
): Promise<string> {
  const post = await prisma.post.update({
    where: { id },
    data: {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      tags: data.tags,
      published: data.published,
    },
  })
  return post.slug
}

export async function deletePost(id: number): Promise<void> {
  await prisma.post.delete({ where: { id } })
}

export async function createPost(data: {
  title: string
  content: string
  excerpt: string
  tags: string[]
}): Promise<string> {
  const baseSlug = toSlug(data.title)
  let slug = baseSlug
  let attempt = 0
  while (await prisma.post.findUnique({ where: { slug } })) {
    attempt++
    slug = `${baseSlug}-${attempt}`
  }
  await prisma.post.create({
    data: {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      tags: data.tags,
    },
  })
  return slug
}
