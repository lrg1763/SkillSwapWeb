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

    // Получаем избранных пользователей
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        favorite: {
          select: {
            id: true,
            username: true,
            avatar: true,
            rating: true,
            location: true,
            skillsOffered: true,
            skillsNeeded: true,
            isOnline: true,
            lastSeen: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const users = favorites.map((fav) => fav.favorite)

    return NextResponse.json({ users })
  } catch (error) {
    logError(error, { endpoint: '/api/favorites', method: 'GET' })
    return NextResponse.json(
      { error: 'Ошибка при получении избранных пользователей' },
      { status: 500 }
    )
  }
}
