/**
 * QueryProvider для React Query
 * 
 * Установите зависимости перед использованием:
 * npm install @tanstack/react-query
 * 
 * Затем раскомментируйте QueryProvider в app/layout.tsx
 */

'use client'

// This file is placeholder - uncomment and install @tanstack/react-query to use
/*
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
*/

// Temporary placeholder export
export default function QueryProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
