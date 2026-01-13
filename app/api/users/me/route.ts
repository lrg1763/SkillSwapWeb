import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { updateProfileSchema } from '@/lib/validations'
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
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
      prisma.message
        .findMany({
          where: {
            OR: [{ senderId: userId }, { receiverId: userId }],
            isDeleted: false,
          },
          select: {
            senderId: true,
            receiverId: true,
          },
        })
        .then((messages) => {
          const uniqueIds = new Set<number>()
          messages.forEach((msg) => {
            if (msg.senderId !== userId) uniqueIds.add(msg.senderId)
            if (msg.receiverId !== userId) uniqueIds.add(msg.receiverId)
          })
          return uniqueIds.size
        }),
    ])

    return NextResponse.json({
      ...user,
      stats: {
        reviewsCount,
        messagesCount,
        exchangesCount,
      },
    })
  } catch (error) {
    logError(error, { endpoint: '/api/users/me', method: 'GET' })
    return NextResponse.json(
      { error: 'Ошибка при получении данных пользователя' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Необходима аутентификация' },
        { status: 401 }
      )
    }

    const userId = parseInt(session.user.id)
    const body = await request.json()

    // Валидация данных
    const validatedData = updateProfileSchema.parse(body)

    // Проверка уникальности username (если изменился)
    if (validatedData.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username: validatedData.username },
      })

      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json(
          { error: 'Пользователь с таким именем уже существует' },
          { status: 400 }
        )
      }
    }

    // Обновление пользователя
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: validatedData.username,
        skillsOffered: validatedData.skillsOffered || '',
        skillsNeeded: validatedData.skillsNeeded || '',
        location: validatedData.location || '',
        bio: validatedData.bio || '',
        portfolio: validatedData.portfolio || null,
        availabilitySchedule: validatedData.availabilitySchedule || null,
        preferredExchangeTime: validatedData.preferredExchangeTime || '',
        languages: validatedData.languages || '',
      },
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
        portfolio: true,
        availabilitySchedule: true,
        preferredExchangeTime: true,
        languages: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      message: 'Профиль успешно обновлен',
      user: updatedUser,
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: error.errors },
        { status: 400 }
      )
    }

    logError(error, { endpoint: '/api/users/me', method: 'PUT' })
    return NextResponse.json(
      { error: 'Ошибка при обновлении профиля' },
      { status: 500 }
    )
  }
}
