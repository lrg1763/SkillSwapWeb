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

    // Получаем заблокированных пользователей
    const blocks = await prisma.block.findMany({
      where: { blockerId: userId },
      include: {
        blocked: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const users = blocks.map((block) => block.blocked)

    return NextResponse.json({ users })
  } catch (error) {
    logError(error, { endpoint: '/api/blocks', method: 'GET' })
    return NextResponse.json(
      { error: 'Ошибка при получении заблокированных пользователей' },
      { status: 500 }
    )
  }
}
