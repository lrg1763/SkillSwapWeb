import {
  sanitizeHtml,
  escapeHtml,
  sanitizeInput,
  generateCSRFToken,
  verifyCSRFToken,
  isValidRedirectUrl,
  checkBruteForce,
  recordFailedAttempt,
  resetFailedAttempts,
} from '@/lib/security'

describe('security', () => {
  describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
      const html = '<div>Hello</div><script>alert("xss")</script>'
      const sanitized = sanitizeHtml(html)
      expect(sanitized).not.toContain('<script>')
      expect(sanitized).toContain('<div>Hello</div>')
    })

    it('should remove javascript: protocols', () => {
      const html = '<a href="javascript:alert(1)">Click</a>'
      const sanitized = sanitizeHtml(html)
      expect(sanitized).not.toContain('javascript:')
    })

    it('should remove event handlers', () => {
      const html = '<div onclick="alert(1)">Click</div>'
      const sanitized = sanitizeHtml(html)
      expect(sanitized).not.toContain('onclick')
    })
  })

  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      expect(escapeHtml('<div>')).toBe('&lt;div&gt;')
      expect(escapeHtml('"quotes"')).toBe('&quot;quotes&quot;')
      expect(escapeHtml("'apostrophe'")).toBe('&#039;apostrophe&#039;')
      expect(escapeHtml('&amp;')).toBe('&amp;amp;')
    })
  })

  describe('sanitizeInput', () => {
    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello')
    })

    it('should remove null bytes', () => {
      expect(sanitizeInput('hello\0world')).toBe('helloworld')
    })

    it('should normalize unicode', () => {
      const normalized = sanitizeInput('café')
      expect(normalized).toBeTruthy()
    })
  })

  describe('generateCSRFToken', () => {
    it('should generate a token', () => {
      const token = generateCSRFToken()
      expect(token).toBeTruthy()
      expect(typeof token).toBe('string')
      expect(token.length).toBeGreaterThan(0)
    })

    it('should generate different tokens', () => {
      const token1 = generateCSRFToken()
      const token2 = generateCSRFToken()
      expect(token1).not.toBe(token2)
    })
  })

  describe('verifyCSRFToken', () => {
    it('should verify matching tokens', () => {
      const token = 'test-token'
      expect(verifyCSRFToken(token, token)).toBe(true)
    })

    it('should reject non-matching tokens', () => {
      expect(verifyCSRFToken('token1', 'token2')).toBe(false)
    })

    it('should reject empty tokens', () => {
      expect(verifyCSRFToken('', 'token')).toBe(false)
      expect(verifyCSRFToken('token', '')).toBe(false)
    })
  })

  describe('isValidRedirectUrl', () => {
    it('should allow relative URLs', () => {
      expect(isValidRedirectUrl('/profile')).toBe(true)
      expect(isValidRedirectUrl('/login?redirect=/profile')).toBe(true)
    })

    it('should allow localhost', () => {
      expect(isValidRedirectUrl('http://localhost:3000/profile')).toBe(true)
    })

    it('should reject external URLs without allowed hosts', () => {
      expect(isValidRedirectUrl('http://evil.com')).toBe(false)
    })

    it('should allow external URLs with allowed hosts', () => {
      expect(isValidRedirectUrl('http://example.com', ['example.com'])).toBe(true)
    })
  })

  describe('checkBruteForce', () => {
    beforeEach(() => {
      resetFailedAttempts('test-ip')
    })

    it('should allow first attempts', () => {
      const result = checkBruteForce('test-ip', 5)
      expect(result.allowed).toBe(true)
      expect(result.remainingAttempts).toBe(5)
    })

    it('should block after max attempts', () => {
      for (let i = 0; i < 5; i++) {
        recordFailedAttempt('test-ip', 5)
      }
      const result = checkBruteForce('test-ip', 5)
      expect(result.allowed).toBe(false)
      expect(result.remainingAttempts).toBe(0)
    })
  })
})
