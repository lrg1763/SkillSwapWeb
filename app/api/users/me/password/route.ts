import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { changePasswordSchema } from '@/lib/validations'
import { logError } from '@/lib/error-handler'

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
    const validatedData = changePasswordSchema.parse(body)

    // Получаем пользователя
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    // Проверяем текущий пароль
    const isCurrentPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      user.password
    )

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Неверный текущий пароль' },
        { status: 400 }
      )
    }

    // Хешируем новый пароль
    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 10)

    // Обновляем пароль
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    })

    return NextResponse.json({
      message: 'Пароль успешно изменен',
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: error.errors },
        { status: 400 }
      )
    }

    logError(error, { endpoint: '/api/users/me/password', method: 'PUT' })
    return NextResponse.json(
      { error: 'Ошибка при смене пароля' },
      { status: 500 }
    )
  }
}
