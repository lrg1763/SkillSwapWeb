import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { registerSchema } from '@/lib/validations'
import { createErrorResponse, logError } from '@/lib/error-handler'
import { rateLimit, getIpAddress } from '@/lib/rate-limit'
import { RATE_LIMIT } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getIpAddress(request)
    const limit = rateLimit(ip, RATE_LIMIT.REGISTRATION)

    if (!limit.allowed) {
      return NextResponse.json(
        { error: limit.message || 'Слишком много попыток регистрации. Попробуйте позже.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': limit.remaining.toString(),
            'X-RateLimit-Reset': limit.reset.toString(),
            'Retry-After': Math.ceil((limit.reset - Date.now()) / 1000).toString(),
          },
        }
      )
    }

    const body = await request.json()
    
    // Валидация данных
    const validatedData = registerSchema.parse(body)

    // Проверка, существует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { username: validatedData.username },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким именем уже существует' },
        { status: 409 }
      )
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Создание пользователя
    const user = await prisma.user.create({
      data: {
        username: validatedData.username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      { message: 'Регистрация успешна', user },
      {
        status: 201,
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': limit.remaining.toString(),
          'X-RateLimit-Reset': limit.reset.toString(),
        },
      }
    )
  } catch (error) {
    logError(error, { endpoint: '/api/auth/register', method: 'POST' })
    const errorResponse = createErrorResponse(error)
    
    return NextResponse.json(
      { error: errorResponse.error, ...(errorResponse.details && { details: errorResponse.details }) },
      { status: errorResponse.status }
    )
  }
}
