/**
 * Redis-based rate limiting с использованием Upstash
 * Falls back на in-memory решение, если Redis недоступен
 */

interface RateLimitOptions {
  windowMs: number
  max: number
  message?: string
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  reset: number
  message?: string
}

// Try to import Upstash (optional dependency)
let Ratelimit: any = null
let Redis: any = null

try {
  // Dynamic import to avoid errors if package is not installed
  // User needs to install: npm install @upstash/redis @upstash/ratelimit
  Ratelimit = require('@upstash/ratelimit').Ratelimit
  Redis = require('@upstash/redis').Redis
} catch (e) {
  // Upstash packages not installed, will use fallback
}

let ratelimitInstance: any = null

function getRatelimitInstance() {
  if (ratelimitInstance) return ratelimitInstance

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

  if (Ratelimit && Redis && redisUrl && redisToken) {
    const redis = new Redis({
      url: redisUrl,
      token: redisToken,
    })

    ratelimitInstance = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow,
      analytics: true,
    })
  }

  return ratelimitInstance
}

/**
 * Redis-based rate limiter (falls back to in-memory if Redis not available)
 */
export async function rateLimitRedis(
  identifier: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const instance = getRatelimitInstance()

  if (instance) {
    // Use Redis-based rate limiting
    try {
      const result = await instance.limit(identifier)
      return {
        allowed: result.success,
        remaining: result.remaining,
        reset: result.reset,
        message: !result.success ? options.message : undefined,
      }
    } catch (error) {
      console.error('Redis rate limit error:', error)
      // Fall through to in-memory fallback
    }
  }

  // Fallback to in-memory rate limiting
  // Import the in-memory rate limiter
  const { rateLimit } = await import('./rate-limit')
  return rateLimit(identifier, options)
}

/**
 * Get IP address from request
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

  return 'unknown'
}

/**
 * Middleware для rate limiting с Redis поддержкой
 */
export async function withRateLimitRedis(
  handler: (request: Request) => Promise<Response>,
  options: RateLimitOptions & { getIdentifier?: (request: Request) => string }
) {
  return async (request: Request): Promise<Response> => {
    const identifier = options.getIdentifier
      ? options.getIdentifier(request)
      : getIpAddress(request)

    const limit = await rateLimitRedis(identifier, options)

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

    response.headers.set('X-RateLimit-Limit', options.max.toString())
    response.headers.set('X-RateLimit-Remaining', limit.remaining.toString())
    response.headers.set('X-RateLimit-Reset', limit.reset.toString())

    return response
  }
}
