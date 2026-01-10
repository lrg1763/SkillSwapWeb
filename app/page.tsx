import { auth } from '@/lib/auth'
import HomePageClient from '@/components/home/HomePageClient'

export const metadata = {
  title: 'SkillSwap - Обмен навыками и услугами',
  description: 'Платформа для peer-to-peer обмена навыками и услугами без использования денег',
}

export default async function Home() {
  const session = await auth()
  const isAuthenticated = !!session?.user

  return <HomePageClient isAuthenticated={isAuthenticated} />
}
