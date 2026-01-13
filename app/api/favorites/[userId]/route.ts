import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { logError } from '@/lib/error-handler'

export async function POST(
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

    const userId = parseInt(session.user.id)
    const favoriteId = parseInt(params.userId)

    if (isNaN(favoriteId)) {
      return NextResponse.json(
        { error: 'Неверный ID пользователя' },
        { status: 400 }
      )
    }

    if (userId === favoriteId) {
      return NextResponse.json(
        { error: 'Нельзя добавить себя в избранное' },
        { status: 400 }
      )
    }

    // Проверяем, существует ли уже в избранном
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_favoriteId: {
          userId,
          favoriteId,
        },
      },
    })

    if (existing) {
      // Удаляем из избранного
      await prisma.favorite.delete({
        where: {
          userId_favoriteId: {
            userId,
            favoriteId,
          },
        },
      })

      return NextResponse.json({
        message: 'Пользователь удален из избранного',
        isFavorite: false,
      })
    } else {
      // Добавляем в избранное
      await prisma.favorite.create({
        data: {
          userId,
          favoriteId,
        },
      })

      return NextResponse.json({
        message: 'Пользователь добавлен в избранное',
        isFavorite: true,
      })
    }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Пользователь уже в избранном' },
        { status: 400 }
      )
    }

    logError(error, { endpoint: '/api/favorites/[userId]', method: 'POST' })
    return NextResponse.json(
      { error: 'Ошибка при изменении избранного' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    const userId = parseInt(session.user.id)
    const favoriteId = parseInt(params.userId)

    if (isNaN(favoriteId)) {
      return NextResponse.json(
        { error: 'Неверный ID пользователя' },
        { status: 400 }
      )
    }

    await prisma.favorite.delete({
      where: {
        userId_favoriteId: {
          userId,
          favoriteId,
        },
      },
    })

    return NextResponse.json({
      message: 'Пользователь удален из избранного',
    })
  } catch (error) {
    logError(error, { endpoint: '/api/favorites/[userId]', method: 'DELETE' })
    return NextResponse.json(
      { error: 'Ошибка при удалении из избранного' },
      { status: 500 }
    )
  }
}
