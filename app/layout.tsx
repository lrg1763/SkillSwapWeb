import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'
import QueryProvider from '@/components/providers/QueryProvider'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

const onyxSemiMonoRegular = localFont({
  src: '../public/fonts/OnyxSemiMono-Regular.otf',
  variable: '--font-onyx-regular',
  weight: '400',
  display: 'swap',
})

const onyxSemiMonoBlack = localFont({
  src: '../public/fonts/OnyxSemiMono-Black.otf',
  variable: '--font-onyx-black',
  weight: '900',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SkillSwap - Обмен навыками',
  description: 'Платформа для peer-to-peer обмена навыками и услугами',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        url: '/favicon.ico',
      },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'SkillSwap',
    statusBarStyle: 'default',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body
        className={`${onyxSemiMonoRegular.variable} ${onyxSemiMonoBlack.variable} font-onyx-regular antialiased`}
      >
        <ErrorBoundary>
          <SessionProvider>
            <QueryProvider>
              {children}
              <Toaster position="top-right" />
            </QueryProvider>
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
