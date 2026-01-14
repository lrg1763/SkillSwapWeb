import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { registerSchema } from '@/lib/validations'
import { createErrorResponse, logError } from '@/lib/error-handler'
import { rateLimit, getIpAddress } from '@/lib/rate-limit'
import { RATE_LIMIT } from '@/lib/constants'
import { writeFile, appendFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'

export async function POST(request: NextRequest) {
  const logPath = '/Users/maxosavchuk/Documents/SkillSwapWeb/.cursor/debug.log'
  const logEntry = (location: string, message: string, data: any, hypothesisId: string = '') => {
    // Non-blocking logging
    (async () => {
      try {
        const entry = JSON.stringify({location,message,data,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId}) + '\n'
        console.error(`[DEBUG] ${location}: ${message}`, data)
        await appendFile(logPath, entry).catch((err) => console.error(`[DEBUG] Failed to write log file:`, err))
        fetch('http://127.0.0.1:7252/ingest/04941659-eed6-4b7f-aa82-90dc2d91e403',{method:'POST',headers:{'Content-Type':'application/json'},body:entry.trim()}).catch(()=>{})
      } catch (err) {
        console.error(`[DEBUG LOG ERROR] Failed to log:`, err)
      }
    })()
  }
  try {
    // #region agent log
    logEntry('route.ts:9', 'POST handler started', {})
    // #endregion
    // Rate limiting
    const ip = getIpAddress(request)
    // #region agent log
    logEntry('route.ts:13', 'Rate limit check', {ip,hasIp:!!ip}, 'D')
    // #endregion
    const limit = rateLimit(ip, RATE_LIMIT.REGISTRATION)

    // #region agent log
    logEntry('route.ts:14', 'Rate limit result', {allowed:limit.allowed,remaining:limit.remaining,reset:limit.reset}, 'D')
    // #endregion

    if (!limit.allowed) {
      // #region agent log
      logEntry('route.ts:16', 'Rate limit exceeded', {message:limit.message}, 'D')
      // #endregion
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

    // #region agent log
    logEntry('route.ts:30', 'Attempting to parse JSON body', {}, 'C')
    // #endregion
    const body = await request.json()
    
    // #region agent log
    logEntry('route.ts:33', 'JSON parsed successfully', {hasUsername:!!body.username,hasPassword:!!body.password,hasConfirmPassword:!!body.confirmPassword,username:body.username,passwordLength:body.password?.length}, 'C')
    // #endregion
    
    // Валидация данных
    // #region agent log
    logEntry('route.ts:35', 'Starting Zod validation', {username:body.username,passwordLength:body.password?.length}, 'A')
    // #endregion
    const validatedData = registerSchema.parse(body)

    // #region agent log
    logEntry('route.ts:36', 'Zod validation passed', {username:validatedData.username}, 'A')
    // #endregion

    // Проверка, существует ли пользователь
    // #region agent log
    logEntry('route.ts:38', 'Checking for existing user', {username:validatedData.username}, 'B')
    // #endregion
    const existingUser = await prisma.user.findUnique({
      where: { username: validatedData.username },
      select: { id: true, username: true },
    })

    // #region agent log
    logEntry('route.ts:42', 'Existing user check result', {userExists:!!existingUser}, 'B')
    // #endregion

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким именем уже существует' },
        { status: 409 }
      )
    }

    // Хеширование пароля
    // #region agent log
    logEntry('route.ts:48', 'Starting password hashing', {passwordLength:validatedData.password.length}, 'E')
    // #endregion
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // #region agent log
    logEntry('route.ts:49', 'Password hashed successfully', {hashedLength:hashedPassword.length}, 'E')
    // #endregion

    // Создание пользователя
    // #region agent log
    logEntry('route.ts:51', 'Creating user in database', {username:validatedData.username}, 'B')
    // #endregion
    // Create user using raw SQL to avoid Prisma trying to insert non-existent columns
    // The database doesn't have: portfolio, preferred_exchange_time, languages columns
    const result = await prisma.$queryRaw<Array<{id: number, username: string, created_at: Date}>>`
      INSERT INTO "User" (username, password, skills_offered, skills_needed, location, bio, avatar, rating, is_premium, is_online, last_seen, created_at)
      VALUES (${validatedData.username}, ${hashedPassword}, '', '', '', '', '', 0, false, false, NOW(), NOW())
      RETURNING id, username, created_at
    `
    const user = {
      id: result[0].id,
      username: result[0].username,
      createdAt: result[0].created_at,
    }

    // #region agent log
    logEntry('route.ts:62', 'User created successfully', {userId:user.id,username:user.username}, '')
    // #endregion

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
    // #region agent log
    try {
      const errorData = {errorType:error instanceof Error ? error.constructor.name : typeof error,errorName:error instanceof Error ? error.name : 'unknown',errorMessage:error instanceof Error ? error.message : String(error),hasStack:error instanceof Error ? !!error.stack : false,stack:error instanceof Error ? error.stack : undefined}
      console.error('[DEBUG] Exception caught in POST handler:', errorData)
      const errorEntry = JSON.stringify({location:'route.ts:130',message:'Exception caught in POST handler',data:errorData,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C,D,E'}) + '\n'
      await appendFile(logPath, errorEntry)
      fetch('http://127.0.0.1:7252/ingest/04941659-eed6-4b7f-aa82-90dc2d91e403',{method:'POST',headers:{'Content-Type':'application/json'},body:errorEntry.trim()}).catch(()=>{})
    } catch (logErr) {
      console.error('[DEBUG LOG ERROR] Failed to log error:', logErr)
    }
    // #endregion
    logError(error, { endpoint: '/api/auth/register', method: 'POST' })
    const errorResponse = createErrorResponse(error)
    
    // #region agent log
    try {
      const responseData = {error:errorResponse.error,status:errorResponse.status,hasDetails:!!errorResponse.details,details:errorResponse.details}
      console.error('[DEBUG] Error response created:', responseData)
      const responseEntry = JSON.stringify({location:'route.ts:137',message:'Error response created',data:responseData,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'}) + '\n'
      await appendFile(logPath, responseEntry)
      fetch('http://127.0.0.1:7252/ingest/04941659-eed6-4b7f-aa82-90dc2d91e403',{method:'POST',headers:{'Content-Type':'application/json'},body:responseEntry.trim()}).catch(()=>{})
    } catch (logErr) {
      console.error('[DEBUG LOG ERROR] Failed to log response:', logErr)
    }
    // #endregion
    
    return NextResponse.json(
      { error: errorResponse.error, ...(errorResponse.details && { details: errorResponse.details }) },
      { status: errorResponse.status }
    )
  }
}
