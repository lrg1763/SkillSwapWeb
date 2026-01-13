import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { reviewSchema } from '@/lib/validations'
import { logError } from '@/lib/error-handler'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Необходима аутентификация' },
        { status: 401 }
      )
    }

    const reviewerId = parseInt(session.user.id)
    const body = await request.json()

    // Валидация данных
    const validatedData = reviewSchema.parse(body)
    const reviewedId = parseInt(body.reviewed_id)

    if (isNaN(reviewedId)) {
      return NextResponse.json(
        { error: 'Неверный ID пользователя' },
        { status: 400 }
      )
    }

    if (reviewerId === reviewedId) {
      return NextResponse.json(
        { error: 'Нельзя оставить отзыв самому себе' },
        { status: 400 }
      )
    }

    // Проверка блокировки
    const isBlocked = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: reviewerId, blockedId: reviewedId },
          { blockerId: reviewedId, blockedId: reviewerId },
        ],
      },
    })

    if (isBlocked) {
      return NextResponse.json(
        { error: 'Нельзя оставить отзыв заблокированному пользователю' },
        { status: 403 }
      )
    }

    // Проверяем, существует ли уже отзыв
    const existingReview = await prisma.review.findUnique({
      where: {
        reviewerId_reviewedId: {
          reviewerId,
          reviewedId,
        },
      },
    })

    // Создаем или обновляем отзыв
    const review = existingReview
      ? await prisma.review.update({
          where: { id: existingReview.id },
          data: {
            rating: validatedData.rating,
            comment: validatedData.comment || null,
          },
        })
      : await prisma.review.create({
          data: {
            reviewerId,
            reviewedId,
            rating: validatedData.rating,
            comment: validatedData.comment || null,
          },
        })

    // Пересчитываем средний рейтинг
    const allReviews = await prisma.review.findMany({
      where: { reviewedId },
      select: { rating: true },
    })

    const averageRating =
      allReviews.reduce((sum, r) => sum + parseFloat(r.rating.toString()), 0) /
      allReviews.length

    await prisma.user.update({
      where: { id: reviewedId },
      data: {
        rating: averageRating.toFixed(1),
      },
    })

    return NextResponse.json({
      message: existingReview ? 'Отзыв обновлен' : 'Отзыв создан',
      review,
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Отзыв уже существует' },
        { status: 400 }
      )
    }

    logError(error, { endpoint: '/api/reviews', method: 'POST' })
    return NextResponse.json(
      { error: 'Ошибка при создании отзыва' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Необходима аутентификация' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const reviewId = parseInt(searchParams.get('id') || '0')

    if (isNaN(reviewId) || reviewId === 0) {
      return NextResponse.json(
        { error: 'Неверный ID отзыва' },
        { status: 400 }
      )
    }

    const reviewerId = parseInt(session.user.id)

    // Проверяем, что отзыв принадлежит текущему пользователю
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Отзыв не найден' },
        { status: 404 }
      )
    }

    if (review.reviewerId !== reviewerId) {
      return NextResponse.json(
        { error: 'Недостаточно прав для удаления отзыва' },
        { status: 403 }
      )
    }

    const reviewedId = review.reviewedId

    // Удаляем отзыв
    await prisma.review.delete({
      where: { id: reviewId },
    })

    // Пересчитываем средний рейтинг
    const allReviews = await prisma.review.findMany({
      where: { reviewedId },
      select: { rating: true },
    })

    const averageRating =
      allReviews.length > 0
        ? allReviews.reduce(
            (sum, r) => sum + parseFloat(r.rating.toString()),
            0
          ) / allReviews.length
        : 0

    await prisma.user.update({
      where: { id: reviewedId },
      data: {
        rating: averageRating.toFixed(1),
      },
    })

    return NextResponse.json({
      message: 'Отзыв удален',
    })
  } catch (error) {
    logError(error, { endpoint: '/api/reviews', method: 'DELETE' })
    return NextResponse.json(
      { error: 'Ошибка при удалении отзыва' },
      { status: 500 }
    )
  }
}
