import { PrismaClient, Chat, Message } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["error"] })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export interface ChatWithMessages extends Chat {
  messages: Message[]
}

export interface CreateChatInput {
  ipAddress?: string
  userAgent?: string
  country?: string
  city?: string
  referrer?: string
}

export async function createChat(input: CreateChatInput): Promise<string> {
  const chat = await prisma.chat.create({
    data: {
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      country: input.country,
      city: input.city,
      referrer: input.referrer,
    },
  })
  return chat.sessionId
}

export async function getChatBySessionId(
  sessionId: string
): Promise<ChatWithMessages | null> {
  const chat = await prisma.chat.findUnique({
    where: { sessionId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  })
  return chat
}

export async function getChatHistory(sessionId: string): Promise<Message[]> {
  const chat = await prisma.chat.findUnique({
    where: { sessionId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  })
  return chat?.messages ?? []
}

export async function addMessage(
  sessionId: string,
  role: "user" | "assistant",
  content: string
): Promise<void> {
  const chat = await prisma.chat.findUnique({
    where: { sessionId },
  })

  if (!chat) {
    throw new Error("Chat not found")
  }

  await prisma.message.create({
    data: {
      chatId: chat.id,
      role,
      content,
    },
  })

  await prisma.chat.update({
    where: { id: chat.id },
    data: { updatedAt: new Date() },
  })
}

export async function getRecentChats(limit: number = 50): Promise<Chat[]> {
  return prisma.chat.findMany({
    orderBy: { updatedAt: "desc" },
    take: limit,
  })
}

export async function getChatStats(): Promise<{
  totalChats: number
  totalMessages: number
  todayChats: number
}> {
  const [totalChats, totalMessages, todayChats] = await Promise.all([
    prisma.chat.count(),
    prisma.message.count(),
    prisma.chat.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ])

  return { totalChats, totalMessages, todayChats }
}

export async function deleteChat(sessionId: string): Promise<void> {
  await prisma.chat.delete({
    where: { sessionId },
  })
}
