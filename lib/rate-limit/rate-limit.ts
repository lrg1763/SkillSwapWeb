/**
 * Простой rate limiting для API routes
 * Для production рекомендуется использовать Redis-based решение (Upstash, etc.)
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

/**
 * Очистка устаревших записей (каждые 5 минут)
 */
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
}, 5 * 60 * 1000)

interface RateLimitOptions {
  windowMs: number // Окно времени в миллисекундах
  max: number // Максимальное количество запросов
  message?: string
}

/**
 * Простой in-memory rate limiter
 * @param identifier - Уникальный идентификатор (например, IP или userId)
 * @param options - Опции rate limiting
 * @returns { allowed: boolean, remaining: number, reset: number }
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions
): { allowed: boolean; remaining: number; reset: number; message?: string } {
  const { windowMs, max, message } = options
  const now = Date.now()
  const key = identifier

  // Получаем или создаем запись
  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 0,
      resetTime: now + windowMs,
    }
  }

  const record = store[key]
  record.count++

  const allowed = record.count <= max
  const remaining = Math.max(0, max - record.count)
  const reset = record.resetTime

  return {
    allowed,
    remaining,
    reset,
    ...(message && !allowed && { message }),
  }
}

/**
 * Получить IP адрес из NextRequest или Request
 */
export function getIpAddress(request: Request | { headers: Headers }): string {
  const headers = 'headers' in request ? request.headers : (request as Request).headers
  const forwarded = headers.get('x-forwarded-for')
  const realIp = headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIp) {
    return realIp
  }
  
  // Fallback для development
  return 'unknown'
}

/**
 * Middleware для rate limiting в API routes
 */
export function withRateLimit(
  handler: (request: Request) => Promise<Response>,
  options: RateLimitOptions & { getIdentifier?: (request: Request) => string }
) {
  return async (request: Request): Promise<Response> => {
    const identifier = options.getIdentifier
      ? options.getIdentifier(request)
      : getIpAddress(request)

    const limit = rateLimit(identifier, options)

    if (!limit.allowed) {
      return new Response(
        JSON.stringify({
          error: options.message || 'Слишком много запросов. Попробуйте позже.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': options.max.toString(),
            'X-RateLimit-Remaining': limit.remaining.toString(),
            'X-RateLimit-Reset': limit.reset.toString(),
            'Retry-After': Math.ceil((limit.reset - Date.now()) / 1000).toString(),
          },
        }
      )
    }

    const response = await handler(request)

    // Добавляем rate limit headers
    response.headers.set('X-RateLimit-Limit', options.max.toString())
    response.headers.set('X-RateLimit-Remaining', limit.remaining.toString())
    response.headers.set('X-RateLimit-Reset', limit.reset.toString())

    return response
  }
}
