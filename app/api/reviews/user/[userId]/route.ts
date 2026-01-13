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

    const userId = parseInt(params.userId)
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = Math.min(
      parseInt(searchParams.get('pageSize') || String(PAGINATION.DEFAULT_PAGE_SIZE)),
      PAGINATION.MAX_PAGE_SIZE
    )
    const skip = (page - 1) * pageSize

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Неверный ID пользователя' },
        { status: 400 }
      )
    }

    // Получаем отзывы (уже используем select вместо include - оптимизировано)
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { reviewedId: userId },
        select: {
          id: true,
          reviewerId: true,
          reviewedId: true,
          rating: true,
          comment: true,
          createdAt: true,
          reviewer: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: pageSize,
        skip,
      }),
      prisma.review.count({
        where: { reviewedId: userId },
      }),
    ])

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    logError(error, { endpoint: '/api/reviews/user/[userId]', method: 'GET' })
    return NextResponse.json(
      { error: 'Ошибка при получении отзывов' },
      { status: 500 }
    )
  }
}
