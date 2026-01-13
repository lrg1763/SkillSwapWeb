import { auth } from '@/lib/auth'
import HomePageClient from '@/components/home/HomePageClient'
import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://skillswap.com'

export const metadata: Metadata = {
  title: 'SkillSwap - Обмен навыками и услугами',
  description: 'Платформа для peer-to-peer обмена навыками и услугами без использования денег',
  openGraph: {
    title: 'SkillSwap - Обмен навыками и услугами',
    description: 'Платформа для peer-to-peer обмена навыками и услугами без использования денег',
    url: baseUrl,
    siteName: 'SkillSwap',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkillSwap - Обмен навыками и услугами',
    description: 'Платформа для peer-to-peer обмена навыками и услугами без использования денег',
  },
}

export default async function Home() {
  const session = await auth()
  const isAuthenticated = !!session?.user

  return <HomePageClient isAuthenticated={isAuthenticated} />
}
