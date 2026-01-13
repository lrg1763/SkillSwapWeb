/**
 * Константы приложения
 */

// Rate limiting константы
export const RATE_LIMIT = {
  REGISTRATION: {
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 5,
    message: 'Слишком много попыток регистрации. Попробуйте позже.',
  },
  LOGIN: {
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 10,
    message: 'Слишком много попыток входа. Попробуйте позже.',
  },
  API: {
    windowMs: 60 * 1000, // 1 минута
    max: 100,
    message: 'Слишком много запросов. Попробуйте позже.',
  },
} as const

// Brute force protection константы
export const BRUTE_FORCE = {
  MAX_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 15 * 60 * 1000, // 15 минут
  RESET_TIME_MS: 60 * 60 * 1000, // 1 час
} as const

// File upload константы
export const FILE_UPLOAD = {
  MAX_AVATAR_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_AVATAR_TYPES: ['image/webp'] as const,
  AVATAR_DIMENSIONS: {
    width: 500,
    height: 500,
  },
  AVATAR_QUALITY: 85,
} as const

// Pagination константы
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const

// Validation константы
export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
  },
  BIO: {
    MAX_LENGTH: 1000,
  },
  SKILLS: {
    MAX_LENGTH: 500,
  },
  LOCATION: {
    MAX_LENGTH: 150,
  },
  PORTFOLIO: {
    MAX_LENGTH: 5000,
  },
  REVIEW_COMMENT: {
    MAX_LENGTH: 500,
  },
  MESSAGE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 2000,
  },
} as const

// Cache константы
export const CACHE = {
  STALE_TIME: 60 * 1000, // 1 минута
  GC_TIME: 5 * 60 * 1000, // 5 минут
} as const

// Socket.IO константы
export const SOCKET = {
  RECONNECTION_DELAY: 1000,
  RECONNECTION_ATTEMPTS: 10,
  RECONNECTION_DELAY_MAX: 5000,
  TIMEOUT: 20000,
} as const
