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

    const userId = parseInt(params.id)

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Неверный ID пользователя' },
        { status: 400 }
      )
    }

    // Получаем статистику
    const [reviewsCount, messagesCount, exchangesCount] = await Promise.all([
      prisma.review.count({
        where: { reviewedId: userId },
      }),
      prisma.message.count({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
          isDeleted: false,
        },
      }),
      // Оптимизированный запрос для подсчета уникальных собеседников
      prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(DISTINCT CASE 
          WHEN "sender_id" = ${userId} THEN "receiver_id"
          ELSE "sender_id"
        END) as count
        FROM "Message"
        WHERE ("sender_id" = ${userId} OR "receiver_id" = ${userId})
          AND "is_deleted" = false
      `.then((result) => Number(result[0]?.count || 0)),
    ])

    return NextResponse.json({
      reviewsCount,
      messagesCount,
      exchangesCount,
    })
  } catch (error) {
    logError(error, { endpoint: '/api/users/[id]/stats', method: 'GET' })
    return NextResponse.json(
      { error: 'Ошибка при получении статистики' },
      { status: 500 }
    )
  }
}
