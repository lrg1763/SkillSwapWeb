import LoginForm from '@/components/forms/LoginForm'
import LoginPageClient from './LoginPageClient'
import { Suspense } from 'react'
import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://skillswap.com'

export const metadata: Metadata = {
  title: 'Вход - SkillSwap',
  description: 'Войдите в свой аккаунт SkillSwap',
  openGraph: {
    title: 'Вход - SkillSwap',
    description: 'Войдите в свой аккаунт SkillSwap',
    url: `${baseUrl}/login`,
    siteName: 'SkillSwap',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Вход - SkillSwap',
    description: 'Войдите в свой аккаунт SkillSwap',
  },
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <LoginPageClient />
    </Suspense>
  )
}
