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

    const blockerId = parseInt(session.user.id)
    const blockedId = parseInt(params.userId)

    if (isNaN(blockedId)) {
      return NextResponse.json(
        { error: 'Неверный ID пользователя' },
        { status: 400 }
      )
    }

    if (blockerId === blockedId) {
      return NextResponse.json(
        { error: 'Нельзя заблокировать себя' },
        { status: 400 }
      )
    }

    // Проверяем, заблокирован ли уже
    const existing = await prisma.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId,
          blockedId,
        },
      },
    })

    if (existing) {
      // Разблокируем
      await prisma.block.delete({
        where: {
          blockerId_blockedId: {
            blockerId,
            blockedId,
          },
        },
      })

      // Удаляем из избранного при разблокировке не нужно, т.к. уже было удалено при блокировке

      return NextResponse.json({
        message: 'Пользователь разблокирован',
        isBlocked: false,
      })
    } else {
      // Блокируем
      await prisma.block.create({
        data: {
          blockerId,
          blockedId,
        },
      })

      // Автоматически удаляем из избранного при блокировке
      await prisma.favorite.deleteMany({
        where: {
          OR: [
            { userId: blockerId, favoriteId: blockedId },
            { userId: blockedId, favoriteId: blockerId },
          ],
        },
      })

      return NextResponse.json({
        message: 'Пользователь заблокирован',
        isBlocked: true,
      })
    }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Пользователь уже заблокирован' },
        { status: 400 }
      )
    }

    logError(error, { endpoint: '/api/blocks/[userId]', method: 'POST' })
    return NextResponse.json(
      { error: 'Ошибка при блокировке/разблокировке пользователя' },
      { status: 500 }
    )
  }
}
