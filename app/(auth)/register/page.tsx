import RegisterForm from '@/components/forms/RegisterForm'
import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://skillswap.com'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-primary-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-onyx-black mb-2">SkillSwap</h1>
          <h2 className="text-2xl md:text-3xl font-onyx-black mb-4">
            Регистрация
          </h2>
          <p className="text-primary-gray-text font-onyx-regular">
            Создайте новый аккаунт
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Регистрация - SkillSwap',
  description: 'Зарегистрируйтесь на платформе SkillSwap',
  openGraph: {
    title: 'Регистрация - SkillSwap',
    description: 'Зарегистрируйтесь на платформе SkillSwap',
    url: `${baseUrl}/register`,
    siteName: 'SkillSwap',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Регистрация - SkillSwap',
    description: 'Зарегистрируйтесь на платформе SkillSwap',
  },
}
