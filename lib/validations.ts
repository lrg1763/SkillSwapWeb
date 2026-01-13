import { z } from 'zod'

// Схема валидации для регистрации
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Имя пользователя должно содержать минимум 3 символа')
    .max(50, 'Имя пользователя должно содержать максимум 50 символов')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Имя пользователя может содержать только буквы, цифры и подчеркивание'
    ),
  password: z
    .string()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .max(128, 'Пароль должен содержать максимум 128 символов')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
})

export type RegisterInput = z.infer<typeof registerSchema>

// Схема валидации для входа
export const loginSchema = z.object({
  username: z.string().min(1, 'Введите имя пользователя'),
  password: z.string().min(1, 'Введите пароль'),
  rememberMe: z.boolean().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>

// Схема валидации для обновления профиля
export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Имя пользователя должно содержать минимум 3 символа')
    .max(50, 'Имя пользователя должно содержать максимум 50 символов')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Имя пользователя может содержать только буквы, цифры и подчеркивание'
    ),
  skillsOffered: z.string().max(500, 'Слишком длинный список навыков').optional(),
  skillsNeeded: z.string().max(500, 'Слишком длинный список навыков').optional(),
  location: z.string().max(150, 'Местоположение слишком длинное').optional(),
  bio: z.string().max(1000, 'Биография слишком длинная').optional(),
  portfolio: z.string().max(5000, 'Портфолио слишком длинное').optional(),
  availabilitySchedule: z.record(z.any()).optional(),
  preferredExchangeTime: z.string().max(100, 'Время слишком длинное').optional(),
  languages: z.string().max(255, 'Список языков слишком длинный').optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

// Схема валидации для смены пароля
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Введите текущий пароль'),
    newPassword: z
      .string()
      .min(8, 'Новый пароль должен содержать минимум 8 символов')
      .max(128, 'Новый пароль должен содержать максимум 128 символов')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

// Схема валидации для отзыва
export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().max(500, 'Комментарий слишком длинный').optional(),
})

export type ReviewInput = z.infer<typeof reviewSchema>

// Схема валидации для сообщения
export const messageSchema = z.object({
  content: z
    .string()
    .min(1, 'Сообщение не может быть пустым')
    .max(2000, 'Сообщение слишком длинное (максимум 2000 символов)'),
})

export type MessageInput = z.infer<typeof messageSchema>
