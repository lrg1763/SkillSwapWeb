import { NextResponse } from 'next/server'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerConfig from '../../../swagger.config.js'

/**
 * GET /api/docs
 * Возвращает OpenAPI спецификацию в формате JSON
 */
export async function GET() {
  try {
    const swaggerSpec = swaggerJsdoc(swaggerConfig)
    return NextResponse.json(swaggerSpec)
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при генерации документации' },
      { status: 500 }
    )
  }
}
