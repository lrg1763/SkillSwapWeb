import { registerSchema, loginSchema, updateProfileSchema, reviewSchema } from '@/lib/validations'

describe('validations', () => {
  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        username: 'testuser',
        password: 'Test1234',
        confirmPassword: 'Test1234',
      }
      expect(() => registerSchema.parse(validData)).not.toThrow()
    })

    it('should reject short username', () => {
      const invalidData = {
        username: 'ab',
        password: 'Test1234',
        confirmPassword: 'Test1234',
      }
      expect(() => registerSchema.parse(invalidData)).toThrow()
    })

    it('should reject weak password', () => {
      const invalidData = {
        username: 'testuser',
        password: 'weak',
        confirmPassword: 'weak',
      }
      expect(() => registerSchema.parse(invalidData)).toThrow()
    })

    it('should reject non-matching passwords', () => {
      const invalidData = {
        username: 'testuser',
        password: 'Test1234',
        confirmPassword: 'Test5678',
      }
      expect(() => registerSchema.parse(invalidData)).toThrow()
    })

    it('should reject invalid username characters', () => {
      const invalidData = {
        username: 'test-user!',
        password: 'Test1234',
        confirmPassword: 'Test1234',
      }
      expect(() => registerSchema.parse(invalidData)).toThrow()
    })
  })

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        username: 'testuser',
        password: 'password',
      }
      expect(() => loginSchema.parse(validData)).not.toThrow()
    })

    it('should reject empty username', () => {
      const invalidData = {
        username: '',
        password: 'password',
      }
      expect(() => loginSchema.parse(invalidData)).toThrow()
    })

    it('should reject empty password', () => {
      const invalidData = {
        username: 'testuser',
        password: '',
      }
      expect(() => loginSchema.parse(invalidData)).toThrow()
    })
  })

  describe('updateProfileSchema', () => {
    it('should validate correct profile data', () => {
      const validData = {
        username: 'testuser',
        skillsOffered: 'Programming',
        skillsNeeded: 'Design',
        location: 'Moscow',
        bio: 'Test bio',
      }
      expect(() => updateProfileSchema.parse(validData)).not.toThrow()
    })

    it('should reject too long skills', () => {
      const invalidData = {
        username: 'testuser',
        skillsOffered: 'a'.repeat(501),
      }
      expect(() => updateProfileSchema.parse(invalidData)).toThrow()
    })
  })

  describe('reviewSchema', () => {
    it('should validate correct review data', () => {
      const validData = {
        rating: 5,
        comment: 'Great!',
      }
      expect(() => reviewSchema.parse(validData)).not.toThrow()
    })

    it('should reject invalid rating', () => {
      const invalidData = {
        reviewed_id: '1',
        rating: 6,
      }
      expect(() => reviewSchema.parse(invalidData)).toThrow()
    })

    it('should reject negative rating', () => {
      const invalidData = {
        reviewed_id: '1',
        rating: -1,
      }
      expect(() => reviewSchema.parse(invalidData)).toThrow()
    })
  })
})
