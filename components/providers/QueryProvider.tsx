/**
 * QueryProvider для React Query
 * Обеспечивает кэширование и управление состоянием для API запросов
 * 
 * Установите зависимости перед использованием:
 * npm install @tanstack/react-query
 */

'use client'

import { ReactNode, useState } from 'react'

// Пытаемся импортировать React Query (опциональная зависимость)
let QueryClientProvider: any = null
let QueryClient: any = null

try {
  // Используем dynamic require для опциональной зависимости
  const reactQuery = require('@tanstack/react-query')
  QueryClientProvider = reactQuery.QueryClientProvider
  QueryClient = reactQuery.QueryClient
} catch (e) {
  // Пакет не установлен - будет использоваться fallback
  console.warn('@tanstack/react-query не установлен. QueryProvider будет работать без кэширования.')
}

export default function QueryProvider({ children }: { children: ReactNode }) {
  // Если пакет не установлен, возвращаем children без обертки
  if (!QueryClientProvider || !QueryClient) {
    return <>{children}</>
  }

  // Используем useState для создания QueryClient
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
            retry: 1,
            refetchOnMount: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
