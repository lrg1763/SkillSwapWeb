'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import UserCard from '@/components/user/UserCard'
import { Search, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  username: string
  avatar?: string | null
  rating: number | string
  location?: string | null
  skillsOffered?: string | null
  skillsNeeded?: string | null
  isOnline?: boolean
}

interface SearchResults {
  users: User[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

function SearchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('query') || '')
  const [minRating, setMinRating] = useState(searchParams.get('min_rating') || '0')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [skillsOffered, setSkillsOffered] = useState(searchParams.get('skills_offered') || '')
  const [skillsNeeded, setSkillsNeeded] = useState(searchParams.get('skills_needed') || '')
  const [languages, setLanguages] = useState(searchParams.get('languages') || '')
  const [isOnline, setIsOnline] = useState(searchParams.get('is_online') || '')
  const [dateFrom, setDateFrom] = useState(searchParams.get('date_from') || '')
  const [dateTo, setDateTo] = useState(searchParams.get('date_to') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'created_at')
  const [sortOrder, setSortOrder] = useState(searchParams.get('sort_order') || 'desc')
  const [showFilters, setShowFilters] = useState(false)
  const [results, setResults] = useState<SearchResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const performSearch = async (
    searchQuery: string,
    page: number = 1,
    filters?: {
      minRating?: string
      location?: string
      skillsOffered?: string
      skillsNeeded?: string
      languages?: string
      isOnline?: string
      dateFrom?: string
      dateTo?: string
      sortBy?: string
      sortOrder?: string
    }
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (searchQuery.trim()) params.set('query', searchQuery)
      if (filters?.minRating && parseFloat(filters.minRating) > 0) {
        params.set('min_rating', filters.minRating)
      }
      if (filters?.location?.trim()) {
        params.set('location', filters.location)
      }
      if (filters?.skillsOffered?.trim()) {
        params.set('skills_offered', filters.skillsOffered)
      }
      if (filters?.skillsNeeded?.trim()) {
        params.set('skills_needed', filters.skillsNeeded)
      }
      if (filters?.languages?.trim()) {
        params.set('languages', filters.languages)
      }
      if (filters?.isOnline) {
        params.set('is_online', filters.isOnline)
      }
      if (filters?.dateFrom) {
        params.set('date_from', filters.dateFrom)
      }
      if (filters?.dateTo) {
        params.set('date_to', filters.dateTo)
      }
      params.set('sort_by', filters?.sortBy || sortBy)
      params.set('sort_order', filters?.sortOrder || sortOrder)
      params.set('page', page.toString())

      const response = await fetch(`/api/users/search?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Ошибка при поиске')
      }

      const data = await response.json()
      setResults(data)
      setCurrentPage(page)

      // Обновляем URL без перезагрузки страницы
      router.push(`/search?${params.toString()}`, { scroll: false })
    } catch (err) {
      console.error('Search error:', err)
      setError('Произошла ошибка при поиске')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query, 1, {
      minRating,
      location,
      sortBy,
      sortOrder,
    })
  }

  // Загружаем результаты при монтировании, если есть параметры в URL
  useEffect(() => {
    const urlQuery = searchParams.get('query') || ''
    const urlPage = parseInt(searchParams.get('page') || '1')
    const urlMinRating = searchParams.get('min_rating') || '0'
    const urlLocation = searchParams.get('location') || ''
    const urlSortBy = searchParams.get('sort_by') || 'created_at'
    const urlSortOrder = searchParams.get('sort_order') || 'desc'

    setQuery(urlQuery)
    setMinRating(urlMinRating)
    setLocation(urlLocation)
    setSortBy(urlSortBy)
    setSortOrder(urlSortOrder)

    if (urlQuery || urlMinRating !== '0' || urlLocation) {
      performSearch(urlQuery, urlPage, {
        minRating: urlMinRating,
        location: urlLocation,
        sortBy: urlSortBy,
        sortOrder: urlSortOrder,
      })
    }
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-onyx-black mb-8">Поиск пользователей</h1>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-gray-text" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по имени, навыкам, местоположению..."
              className="w-full pl-12 pr-4 py-3 border-2 border-primary-black rounded-lg bg-primary-white text-primary-black font-onyx-regular focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-primary-black text-primary-white font-onyx-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Поиск...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Найти
              </>
            )}
          </button>
        </div>

        {/* Filters Toggle */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="text-sm text-primary-gray-text font-onyx-regular hover:text-primary-black transition-colors"
        >
          {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
        </button>

        {/* Filters */}
        {showFilters && (
          <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white space-y-4">
            <h3 className="text-lg font-onyx-black mb-4">Фильтры</h3>

            {/* Minimum Rating */}
            <div>
              <label
                htmlFor="minRating"
                className="block text-sm font-onyx-black mb-2 text-primary-black"
              >
                Минимальный рейтинг
              </label>
              <select
                id="minRating"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full px-4 py-3 border-2 border-primary-black rounded-lg bg-primary-white text-primary-black font-onyx-regular focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:border-transparent"
              >
                <option value="0">Любой</option>
                <option value="1">1.0 и выше</option>
                <option value="1.5">1.5 и выше</option>
                <option value="2">2.0 и выше</option>
                <option value="2.5">2.5 и выше</option>
                <option value="3">3.0 и выше</option>
                <option value="3.5">3.5 и выше</option>
                <option value="4">4.0 и выше</option>
                <option value="4.5">4.5 и выше</option>
                <option value="5">5.0</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-onyx-black mb-2 text-primary-black"
              >
                Местоположение
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Например: Москва"
                className="w-full px-4 py-3 border-2 border-primary-black rounded-lg bg-primary-white text-primary-black font-onyx-regular focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:border-transparent"
              />
            </div>

            {/* Sort By */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="sortBy"
                  className="block text-sm font-onyx-black mb-2 text-primary-black"
                >
                  Сортировать по
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-primary-black rounded-lg bg-primary-white text-primary-black font-onyx-regular focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:border-transparent"
                >
                  <option value="created_at">Дате регистрации</option>
                  <option value="rating">Рейтингу</option>
                  <option value="username">Имени</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="sortOrder"
                  className="block text-sm font-onyx-black mb-2 text-primary-black"
                >
                  Порядок сортировки
                </label>
                <select
                  id="sortOrder"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-primary-black rounded-lg bg-primary-white text-primary-black font-onyx-regular focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:border-transparent"
                >
                  <option value="desc">Убывание</option>
                  <option value="asc">Возрастание</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded mb-6">
          <p className="text-sm text-red-800 font-onyx-regular">{error}</p>
        </div>
      )}

      {/* Results */}
      {results && (
        <>
          {results.users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-primary-gray-text font-onyx-regular text-lg">
                Пользователи не найдены
              </p>
            </div>
          ) : (
            <>
              <p className="text-primary-gray-text font-onyx-regular mb-6">
                Найдено: {results.pagination.total}{' '}
                {results.pagination.total === 1 ? 'пользователь' : 'пользователей'}
              </p>

              {/* Users Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {results.users.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>

              {/* Pagination */}
              {results.pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() =>
                      performSearch(query, currentPage - 1, {
                        minRating,
                        location,
                        sortBy,
                        sortOrder,
                      })
                    }
                    disabled={currentPage === 1 || isLoading}
                    className="px-4 py-2 border-2 border-primary-black rounded-lg font-onyx-regular hover:bg-primary-gray-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Назад
                  </button>
                  <span className="px-4 py-2 text-primary-gray-text font-onyx-regular">
                    Страница {currentPage} из {results.pagination.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      performSearch(query, currentPage + 1, {
                        minRating,
                        location,
                        sortBy,
                        sortOrder,
                      })
                    }
                    disabled={currentPage >= results.pagination.totalPages || isLoading}
                    className="px-4 py-2 border-2 border-primary-black rounded-lg font-onyx-regular hover:bg-primary-gray-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Вперед
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Empty state */}
      {!results && !isLoading && !error && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto text-primary-gray-medium mb-4" />
          <p className="text-primary-gray-text font-onyx-regular text-lg">
            Введите запрос для поиска пользователей
          </p>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Загрузка...</div>}>
      <SearchPageContent />
    </Suspense>
  )
}
