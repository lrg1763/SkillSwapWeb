import { cn, formatDate, formatDateTime, formatTime, getInitials, truncate } from '@/lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toContain('2024')
      expect(formatted).toContain('января')
    })

    it('should handle string dates', () => {
      const formatted = formatDate('2024-01-15')
      expect(formatted).toBeTruthy()
    })
  })

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
      const date = new Date('2024-01-15T14:30:00')
      const formatted = formatDateTime(date)
      expect(formatted).toContain('2024')
    })
  })

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const date = new Date('2024-01-15T14:30:00')
      const formatted = formatTime(date)
      expect(formatted).toMatch(/\d{2}:\d{2}/)
    })
  })

  describe('getInitials', () => {
    it('should return first letter uppercase', () => {
      expect(getInitials('john')).toBe('J')
      expect(getInitials('John')).toBe('J')
    })
  })

  describe('truncate', () => {
    it('should truncate long text', () => {
      const longText = 'a'.repeat(100)
      const truncated = truncate(longText, 50)
      expect(truncated.length).toBe(53) // 50 + '...'
      expect(truncated).toEndWith('...')
    })

    it('should not truncate short text', () => {
      const shortText = 'hello'
      expect(truncate(shortText, 10)).toBe('hello')
    })
  })
})
