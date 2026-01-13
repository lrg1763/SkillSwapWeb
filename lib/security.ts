/**
 * Утилиты для безопасности
 */

import { BRUTE_FORCE } from './constants'

/**
 * Sanitize HTML - простая функция для очистки HTML от потенциально опасных тегов
 * Для production рекомендуется использовать библиотеку DOMPurify
 */
export function sanitizeHtml(html: string): string {
  // Удаляем script теги
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // Удаляем javascript: протоколы из href и src
  sanitized = sanitized.replace(/javascript:/gi, '')
  
  // Удаляем onerror, onclick и другие event handlers
  sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
  
  return sanitized
}

/**
 * Escape HTML - экранирование специальных символов HTML
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  
  return text.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * Валидация и очистка пользовательского ввода
 */
export function sanitizeInput(input: string): string {
  // Trim whitespace
  let sanitized = input.trim()
  
  // Удаляем нулевые байты
  sanitized = sanitized.replace(/\0/g, '')
  
  // Нормализуем unicode (защита от homograph атак)
  sanitized = sanitized.normalize('NFKC')
  
  return sanitized
}

/**
 * Генерация CSRF токена (простая реализация)
 * Для production рекомендуется использовать библиотеку csurf или crypto
 */
export function generateCSRFToken(): string {
  if (typeof window === 'undefined') {
    // Server-side
    const crypto = require('crypto')
    return crypto.randomBytes(32).toString('hex')
  } else {
    // Client-side
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
  }
}

/**
 * Проверка CSRF токена
 */
export function verifyCSRFToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) {
    return false
  }
  return token === sessionToken
}

/**
 * Валидация URL для защиты от открытых редиректов
 */
export function isValidRedirectUrl(url: string, allowedHosts: string[] = []): boolean {
  try {
    const parsedUrl = new URL(url, 'http://localhost')
    
    // Разрешаем только относительные URL или разрешенные хосты
    if (!parsedUrl.hostname || parsedUrl.hostname === 'localhost') {
      return true
    }
    
    if (allowedHosts.length === 0) {
      return false
    }
    
    return allowedHosts.includes(parsedUrl.hostname)
  } catch {
    return false
  }
}

/**
 * Защита от brute force - проверка количества попыток
 */
interface AttemptStore {
  [key: string]: {
    count: number
    resetTime: number
    lockedUntil?: number
  }
}

const attemptStore: AttemptStore = {}

export function checkBruteForce(
  identifier: string,
  maxAttempts: number = BRUTE_FORCE.MAX_ATTEMPTS,
  lockoutDurationMs: number = BRUTE_FORCE.LOCKOUT_DURATION_MS
): { allowed: boolean; remainingAttempts: number; lockedUntil?: number } {
  const now = Date.now()
  const key = identifier

  // Получаем или создаем запись
  if (!attemptStore[key] || attemptStore[key].resetTime < now) {
    attemptStore[key] = {
      count: 0,
      resetTime: now + BRUTE_FORCE.RESET_TIME_MS,
    }
  }

  const record = attemptStore[key]

  // Проверяем блокировку
  if (record.lockedUntil && record.lockedUntil > now) {
    return {
      allowed: false,
      remainingAttempts: 0,
      lockedUntil: record.lockedUntil,
    }
  }

  // Если блокировка истекла, сбрасываем счетчик
  if (record.lockedUntil && record.lockedUntil <= now) {
    record.count = 0
    delete record.lockedUntil
  }

  return {
    allowed: record.count < maxAttempts,
    remainingAttempts: Math.max(0, maxAttempts - record.count),
    lockedUntil: record.lockedUntil,
  }
}

export function recordFailedAttempt(
  identifier: string,
  maxAttempts: number = BRUTE_FORCE.MAX_ATTEMPTS,
  lockoutDurationMs: number = BRUTE_FORCE.LOCKOUT_DURATION_MS
): void {
  const now = Date.now()
  const key = identifier

  if (!attemptStore[key] || attemptStore[key].resetTime < now) {
    attemptStore[key] = {
      count: 0,
      resetTime: now + BRUTE_FORCE.RESET_TIME_MS,
    }
  }

  const record = attemptStore[key]
  record.count++

  // Блокируем после превышения лимита
  if (record.count >= maxAttempts) {
    record.lockedUntil = now + lockoutDurationMs
  }
}

export function resetFailedAttempts(identifier: string): void {
  delete attemptStore[identifier]
}
