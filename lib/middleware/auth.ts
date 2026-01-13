/**
 * Middleware для проверки аутентификации в API routes
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

/**
 * Проверяет, аутентифицирован ли пользователь
 * Возвращает userId или null
 */
export async function requireAuth(request: NextRequest): Promise<{
  userId: number
  session: Awaited<ReturnType<typeof auth>>
} | null> {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  return {
    userId: parseInt(session.user.id),
    session,
  }
}

/**
 * Wrapper для API routes, требующих аутентификации
 */
export function withAuth(
  handler: (request: NextRequest, userId: number, session: Awaited<ReturnType<typeof auth>>) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const authResult = await requireAuth(request)

    if (!authResult) {
      return NextResponse.json(
        { error: 'Необходима аутентификация' },
        { status: 401 }
      )
    }

    return handler(request, authResult.userId, authResult.session)
  }
}
