import { z } from 'zod'

/**
 * Валидация environment переменных
 */
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  
  // NextAuth
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  
  // Socket.IO
  NEXT_PUBLIC_SOCKET_SERVER_URL: z.string().url().optional(),
  SOCKET_PORT: z.string().regex(/^\d+$/).optional(),
  
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

type Env = z.infer<typeof envSchema>

/**
 * Валидированные environment переменные
 */
export const env: Env = (() => {
  try {
    return envSchema.parse({
      DATABASE_URL: process.env.DATABASE_URL,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXT_PUBLIC_SOCKET_SERVER_URL: process.env.NEXT_PUBLIC_SOCKET_SERVER_URL,
      SOCKET_PORT: process.env.SOCKET_PORT,
      NODE_ENV: process.env.NODE_ENV || 'development',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.errors.map((e) => e.path.join('.')).join(', ')
      throw new Error(
        `❌ Missing or invalid environment variables: ${missing}\n` +
        'Please check your .env.local file.'
      )
    }
    throw error
  }
})()

/**
 * Проверка наличия обязательных переменных окружения при старте
 */
if (typeof window === 'undefined') {
  // Запускаем только на сервере
  try {
    envSchema.parse({
      DATABASE_URL: process.env.DATABASE_URL,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXT_PUBLIC_SOCKET_SERVER_URL: process.env.NEXT_PUBLIC_SOCKET_SERVER_URL,
      SOCKET_PORT: process.env.SOCKET_PORT,
      NODE_ENV: process.env.NODE_ENV || 'development',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const { logError } = require('./logger')
      logError('Environment validation failed', error, { errors: error.errors })
    }
  }
}
