/**
 * Централизованная конфигурация приложения
 */

import { env } from './env'
import { RATE_LIMIT, BRUTE_FORCE, FILE_UPLOAD, PAGINATION, CACHE, SOCKET } from './constants'

export const config = {
  // Environment
  env: env.NODE_ENV,
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',

  // Database
  database: {
    url: env.DATABASE_URL,
  },

  // Auth
  auth: {
    url: env.NEXTAUTH_URL,
    secret: env.NEXTAUTH_SECRET,
  },

  // Socket.IO
  socket: {
    serverUrl: env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:3001',
    port: env.SOCKET_PORT || '3001',
    ...SOCKET,
  },

  // Rate limiting
  rateLimit: RATE_LIMIT,

  // Brute force protection
  bruteForce: BRUTE_FORCE,

  // File upload
  fileUpload: FILE_UPLOAD,

  // Pagination
  pagination: PAGINATION,

  // Cache
  cache: CACHE,

  // Sentry
  sentry: {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
} as const

export type Config = typeof config
