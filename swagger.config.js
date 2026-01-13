/**
 * Swagger/OpenAPI конфигурация
 */

const swaggerConfig = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SkillSwap API',
      version: '1.0.0',
      description: 'API для платформы обмена навыками SkillSwap',
      contact: {
        name: 'SkillSwap Support',
        email: 'support@skillswap.com',
      },
    },
    servers: [
      {
        url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./app/api/**/*.ts'],
}

module.exports = swaggerConfig
