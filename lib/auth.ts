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
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          const validatedData = loginSchema.parse({
            username: credentials.username,
            password: credentials.password,
          })

          const user = await prisma.user.findUnique({
            where: { username: validatedData.username },
          })

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            validatedData.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id.toString(),
            name: user.username,
            email: user.email || undefined,
          }
        } catch (error) {
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
