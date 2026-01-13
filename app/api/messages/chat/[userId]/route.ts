import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PAGINATION } from '@/lib/constants'
import { logError } from '@/lib/error-handler'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Необходима аутентификация' },
        { status: 401 }
      )
    }

    const currentUserId = parseInt(session.user.id)
    const otherUserId = parseInt(params.userId)

    if (isNaN(otherUserId)) {
      return NextResponse.json(
        { error: 'Неверный ID пользователя' },
        { status: 400 }
      )
    }

    // Проверка блокировки
    const isBlocked = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: currentUserId, blockedId: otherUserId },
          { blockerId: otherUserId, blockedId: currentUserId },
        ],
      },
    })

    if (isBlocked) {
      return NextResponse.json(
        { error: 'Вы не можете общаться с этим пользователем' },
        { status: 403 }
      )
    }

    // Получаем параметры пагинации
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || String(PAGINATION.DEFAULT_PAGE_SIZE))
    const skip = (page - 1) * pageSize

    // Получаем сообщения между двумя пользователями с пагинацией
    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: {
          OR: [
            { senderId: currentUserId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: currentUserId },
          ],
          isDeleted: false,
        },
        select: {
          id: true,
          senderId: true,
          receiverId: true,
          content: true,
          timestamp: true,
          isRead: true,
          isEdited: true,
          editedAt: true,
          sender: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: { timestamp: 'desc' },
        take: pageSize,
        skip,
      }),
      prisma.message.count({
        where: {
          OR: [
            { senderId: currentUserId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: currentUserId },
          ],
          isDeleted: false,
        },
      }),
    ])

    // Помечаем все сообщения как прочитанные
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: currentUserId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })

    // Получаем информацию о собеседнике
    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
      select: {
        id: true,
        username: true,
        avatar: true,
        isOnline: true,
        lastSeen: true,
      },
    })

    if (!otherUser) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      messages: messages.reverse().map((msg) => ({
        id: msg.id,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        content: msg.content,
        timestamp: msg.timestamp,
        isRead: msg.isRead,
        isEdited: msg.isEdited,
        editedAt: msg.editedAt,
        sender: msg.sender,
      })),
      otherUser,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    logError(error, { endpoint: '/api/messages/chat/[userId]', method: 'GET' })
    return NextResponse.json(
      { error: 'Ошибка при получении сообщений' },
      { status: 500 }
    )
  }
}
