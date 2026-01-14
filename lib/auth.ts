import NextAuth, { DefaultSession } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from './db'
import bcrypt from 'bcryptjs'
import { loginSchema } from './validations'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'Имя пользователя', type: 'text' },
        password: { label: 'Пароль', type: 'password' },
      },
      async authorize(credentials) {
        const logPath = '/Users/maxosavchuk/Documents/SkillSwapWeb/.cursor/debug.log'
        const logEntry = (location: string, message: string, data: any) => {
          (async () => {
            try {
              const entry = JSON.stringify({location,message,data,timestamp:Date.now(),sessionId:'debug-session',runId:'login',hypothesisId:''}) + '\n'
              console.error(`[DEBUG] ${location}: ${message}`, data)
              await require('fs/promises').appendFile(logPath, entry).catch(() => {})
            } catch (err) {
              console.error(`[DEBUG LOG ERROR] Failed to log:`, err)
            }
          })()
        }
        
        if (!credentials?.username || !credentials?.password) {
          // #region agent log
          logEntry('auth.ts:30', 'Missing credentials', {hasUsername:!!credentials?.username,hasPassword:!!credentials?.password})
          // #endregion
          return null
        }

        try {
          // #region agent log
          logEntry('auth.ts:34', 'Starting authorization', {username:credentials.username})
          // #endregion
          const validatedData = loginSchema.parse({
            username: credentials.username,
            password: credentials.password,
          })

          // #region agent log
          logEntry('auth.ts:40', 'Looking up user', {username:validatedData.username})
          // #endregion
          const user = await prisma.user.findUnique({
            where: { username: validatedData.username },
            select: { id: true, username: true, password: true, email: true },
          })

          // #region agent log
          logEntry('auth.ts:44', 'User lookup result', {userFound:!!user,userId:user?.id,username:user?.username})
          // #endregion

          if (!user) {
            // #region agent log
            logEntry('auth.ts:45', 'User not found', {username:validatedData.username})
            // #endregion
            return null
          }

          // #region agent log
          logEntry('auth.ts:48', 'Comparing password', {hasPassword:!!user.password,passwordLength:user.password?.length})
          // #endregion
          const isPasswordValid = await bcrypt.compare(
            validatedData.password,
            user.password
          )

          // #region agent log
          logEntry('auth.ts:53', 'Password comparison result', {isValid:isPasswordValid})
          // #endregion

          if (!isPasswordValid) {
            // #region agent log
            logEntry('auth.ts:54', 'Password invalid', {username:validatedData.username})
            // #endregion
            return null
          }

          // #region agent log
          logEntry('auth.ts:57', 'Authorization successful', {userId:user.id,username:user.username})
          // #endregion
          return {
            id: user.id.toString(),
            name: user.username,
            email: user.email || undefined,
          }
        } catch (error) {
          // #region agent log
          logEntry('auth.ts:62', 'Authorization error', {errorType:error instanceof Error ? error.constructor.name : typeof error,errorMessage:error instanceof Error ? error.message : String(error)})
          // #endregion
          const { logError } = require('./logger')
          logError('Auth error', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/',
  },
})
