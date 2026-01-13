import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { logError } from '@/lib/error-handler'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Необходима аутентификация' },
        { status: 401 }
      )
    }

    const userId = parseInt(session.user.id)

    // Получаем последние сообщения для каждого чата (оптимизированная версия)
    // Используем raw query для получения последнего сообщения каждого чата
    const latestMessages = await prisma.$queryRaw<Array<{
      id: number
      senderId: number
      receiverId: number
      content: string
      timestamp: Date
      isRead: boolean
    }>>`
      SELECT DISTINCT ON (
        CASE 
          WHEN "sender_id" = ${userId} THEN "receiver_id"
          ELSE "sender_id"
        END
      ) 
      id, "sender_id" as "senderId", "receiver_id" as "receiverId", 
      content, timestamp, "is_read" as "isRead"
      FROM "Message"
      WHERE ("sender_id" = ${userId} OR "receiver_id" = ${userId})
        AND "is_deleted" = false
      ORDER BY 
        CASE 
          WHEN "sender_id" = ${userId} THEN "receiver_id"
          ELSE "sender_id"
        END,
        timestamp DESC
    `

    // Получаем уникальные ID собеседников
    const otherUserIds = new Set<number>()
    latestMessages.forEach((msg) => {
      const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId
      otherUserIds.add(otherId)
    })

    // Получаем информацию о пользователях одним запросом
    const users = await prisma.user.findMany({
      where: {
        id: { in: Array.from(otherUserIds) },
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        isOnline: true,
        lastSeen: true,
      },
    })

    const userMap = new Map(users.map((u) => [u.id, u]))

    // Получаем непрочитанные сообщения для каждого чата
    const unreadCounts = await prisma.message.groupBy({
      by: ['senderId'],
      where: {
        receiverId: userId,
        isRead: false,
        isDeleted: false,
      },
      _count: {
        id: true,
      },
    })

    const unreadMap = new Map(
      unreadCounts.map((u) => [u.senderId, u._count.id])
    )

    // Создаем мапу чатов из оптимизированных данных
    const chatMap = new Map<number, {
      userId: number
      username: string
      avatar: string | null
      isOnline: boolean
      lastSeen: Date
      lastMessage: string
      lastMessageTime: Date
      unreadCount: number
    }>()

    latestMessages.forEach((message) => {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId
      const otherUser = userMap.get(otherUserId)

      if (otherUser) {
        chatMap.set(otherUserId, {
          userId: otherUserId,
          username: otherUser.username,
          avatar: otherUser.avatar,
          isOnline: otherUser.isOnline,
          lastSeen: otherUser.lastSeen,
          lastMessage: message.content.substring(0, 50),
          lastMessageTime: message.timestamp,
          unreadCount: unreadMap.get(otherUserId) || 0,
        })
      }
    })

    // Получаем список заблокированных пользователей
    const blocks = await prisma.block.findMany({
      where: {
        OR: [{ blockerId: userId }, { blockedId: userId }],
      },
    })

    const blockedUserIds = new Set<number>()
    blocks.forEach((block) => {
      if (block.blockerId !== userId) blockedUserIds.add(block.blockerId)
      if (block.blockedId !== userId) blockedUserIds.add(block.blockedId)
    })

    // Фильтруем заблокированных пользователей
    const chats = Array.from(chatMap.values())
      .filter((chat) => !blockedUserIds.has(chat.userId))
      .sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime())

    return NextResponse.json({ chats })
  } catch (error) {
    logError(error, { endpoint: '/api/messages/chats', method: 'GET' })
    return NextResponse.json(
      { error: 'Ошибка при получении списка чатов' },
      { status: 500 }
    )
  }
}
