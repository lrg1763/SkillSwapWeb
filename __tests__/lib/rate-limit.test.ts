import { rateLimit, getIpAddress } from '@/lib/rate-limit'

describe('rate-limit', () => {
  describe('rateLimit', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should allow requests within limit', () => {
      const identifier = 'test-ip'
      const options = {
        windowMs: 60000, // 1 minute
        max: 5,
      }

      for (let i = 0; i < 5; i++) {
        const result = rateLimit(identifier, options)
        expect(result.allowed).toBe(true)
        expect(result.remaining).toBe(5 - i - 1)
      }
    })

    it('should block requests exceeding limit', () => {
      const identifier = 'test-ip'
      const options = {
        windowMs: 60000,
        max: 5,
      }

      // Make 5 requests
      for (let i = 0; i < 5; i++) {
        rateLimit(identifier, options)
      }

      // 6th request should be blocked
      const result = rateLimit(identifier, options)
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('should reset after window expires', () => {
      const identifier = 'test-ip'
      const options = {
        windowMs: 60000,
        max: 5,
      }

      // Make 5 requests
      for (let i = 0; i < 5; i++) {
        rateLimit(identifier, options)
      }

      // Fast forward time
      jest.advanceTimersByTime(61000)

      // Should allow requests again
      const result = rateLimit(identifier, options)
      expect(result.allowed).toBe(true)
    })

    it('should include custom message when blocked', () => {
      const identifier = 'test-ip'
      const options = {
        windowMs: 60000,
        max: 1,
        message: 'Too many requests',
      }

      rateLimit(identifier, options)
      const result = rateLimit(identifier, options)
      expect(result.allowed).toBe(false)
      expect(result.message).toBe('Too many requests')
    })
  })

  describe('getIpAddress', () => {
    it('should extract IP from x-forwarded-for header', () => {
      const request = {
        headers: new Headers({
          'x-forwarded-for': '192.168.1.1, 10.0.0.1',
        }),
      } as Request

      const ip = getIpAddress(request)
      expect(ip).toBe('192.168.1.1')
    })

    it('should extract IP from x-real-ip header', () => {
      const request = {
        headers: new Headers({
          'x-real-ip': '192.168.1.1',
        }),
      } as Request

      const ip = getIpAddress(request)
      expect(ip).toBe('192.168.1.1')
    })

    it('should fallback to default when no headers', () => {
      const request = {
        headers: new Headers(),
      } as Request

      const ip = getIpAddress(request)
      expect(ip).toBe('unknown')
    })
  })
})
