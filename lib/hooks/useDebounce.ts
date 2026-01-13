import { useEffect, useState } from 'react'

/**
 * Хук для задержки значения
 * @param value - значение для задержки
 * @param delay - задержка в миллисекундах
 * @returns задержанное значение
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
