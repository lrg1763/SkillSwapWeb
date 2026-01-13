import { ApiError, handleApiError, createErrorResponse, logError } from '@/lib/error-handler'

describe('error-handler', () => {
  describe('ApiError', () => {
    it('should create ApiError with message and statusCode', () => {
      const error = new ApiError('Not found', 404)
      expect(error.message).toBe('Not found')
      expect(error.statusCode).toBe(404)
      expect(error).toBeInstanceOf(Error)
    })

    it('should create ApiError with code and details', () => {
      const error = new ApiError('Bad request', 400, 'VALIDATION_ERROR', { field: 'username' })
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.details).toEqual({ field: 'username' })
    })
  })

  describe('handleApiError', () => {
    it('should handle ApiError', () => {
      const error = new ApiError('Not found', 404)
      const result = handleApiError(error)
      expect(result.error).toBe('Not found')
      expect(result.statusCode).toBe(404)
    })

    it('should handle ZodError', () => {
      const zodError = new Error('Validation error')
      zodError.name = 'ZodError'
      ;(zodError as any).errors = [{ path: ['username'], message: 'Required' }]
      const result = handleApiError(zodError)
      expect(result.error).toBe('Ошибка валидации')
      expect(result.statusCode).toBe(400)
      expect(result.details).toBeDefined()
    })

    it('should handle Prisma unique constraint error', () => {
      const prismaError = new Error('Unique constraint')
      prismaError.name = 'PrismaClientKnownRequestError'
      ;(prismaError as any).code = 'P2002'
      const result = handleApiError(prismaError)
      expect(result.error).toBe('Запись с такими данными уже существует')
      expect(result.statusCode).toBe(409)
    })

    it('should handle Prisma not found error', () => {
      const prismaError = new Error('Record not found')
      prismaError.name = 'PrismaClientKnownRequestError'
      ;(prismaError as any).code = 'P2025'
      const result = handleApiError(prismaError)
      expect(result.error).toBe('Запись не найдена')
      expect(result.statusCode).toBe(404)
    })

    it('should handle database connection error', () => {
      const dbError = new Error('Can\'t reach database')
      const result = handleApiError(dbError)
      expect(result.error).toBe('Ошибка подключения к базе данных')
      expect(result.statusCode).toBe(503)
    })

    it('should handle unknown errors', () => {
      const unknownError = new Error('Unknown error')
      const result = handleApiError(unknownError)
      expect(result.error).toBe('Произошла непредвиденная ошибка')
      expect(result.statusCode).toBe(500)
    })

    it('should handle non-Error values', () => {
      const result = handleApiError('string error')
      expect(result.error).toBe('Произошла непредвиденная ошибка')
      expect(result.statusCode).toBe(500)
    })
  })

  describe('createErrorResponse', () => {
    it('should create error response', () => {
      const error = new ApiError('Not found', 404)
      const response = createErrorResponse(error)
      expect(response.error).toBe('Not found')
      expect(response.status).toBe(404)
    })

    it('should use provided statusCode', () => {
      const error = new ApiError('Error', 500)
      const response = createErrorResponse(error, 400)
      expect(response.status).toBe(400)
    })
  })

  describe('logError', () => {
    let consoleSpy: jest.SpyInstance

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    })

    afterEach(() => {
      consoleSpy.mockRestore()
    })

    it('should log error in development', () => {
      process.env.NODE_ENV = 'development'
      const error = new Error('Test error')
      logError(error, { context: 'test' })
      expect(consoleSpy).toHaveBeenCalled()
    })

    it('should log structured error in production', () => {
      process.env.NODE_ENV = 'production'
      const error = new Error('Test error')
      logError(error, { context: 'test' })
      expect(consoleSpy).toHaveBeenCalled()
      const callArgs = consoleSpy.mock.calls[0]
      expect(callArgs[0]).toBe('Error logged:')
      expect(callArgs[1]).toHaveProperty('error')
      expect(callArgs[1]).toHaveProperty('context')
    })
  })
})
