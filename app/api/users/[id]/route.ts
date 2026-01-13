import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { logError } from '@/lib/error-handler'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    const targetUserId = parseInt(params.id)

    if (isNaN(targetUserId)) {
      return NextResponse.json(
        { error: 'Неверный ID пользователя' },
        { status: 400 }
      )
    }

    // Проверка блокировки
    const isBlocked = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: currentUserId, blockedId: targetUserId },
          { blockerId: targetUserId, blockedId: currentUserId },
        ],
      },
    })

    if (isBlocked) {
      return NextResponse.json(
        { error: 'Вы не можете просматривать профиль этого пользователя' },
        { status: 403 }
      )
    }

    // Получаем пользователя
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        username: true,
        skillsOffered: true,
        skillsNeeded: true,
        location: true,
        bio: true,
        avatar: true,
        rating: true,
        isPremium: true,
        createdAt: true,
        lastSeen: true,
        isOnline: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    // Проверяем, добавлен ли в избранное
    const isFavorite = await prisma.favorite.findUnique({
      where: {
        userId_favoriteId: {
          userId: currentUserId,
          favoriteId: targetUserId,
        },
      },
    })

    // Проверяем, заблокирован ли текущим пользователем
    const isBlockedByCurrent = await prisma.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: currentUserId,
          blockedId: targetUserId,
        },
      },
    })

    return NextResponse.json({
      ...user,
      isFavorite: !!isFavorite,
      isBlocked: !!isBlockedByCurrent,
    })
  } catch (error) {
    logError(error, { endpoint: '/api/users/[id]', method: 'GET' })
    return NextResponse.json(
      { error: 'Ошибка при получении данных пользователя' },
      { status: 500 }
    )
  }
}
