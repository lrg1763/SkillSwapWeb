import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import sharp from 'sharp'
import { FILE_UPLOAD } from '@/lib/constants'
import { logError } from '@/lib/error-handler'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'avatars')
const MAX_FILE_SIZE = FILE_UPLOAD.MAX_AVATAR_SIZE
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Необходима аутентификация' },
        { status: 401 }
      )
    }

    const userId = parseInt(session.user.id)
    const formData = await request.formData()
    const file = formData.get('avatar') as File | null

    // Удаление аватара
    if (!file || (file instanceof File && file.size === 0)) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { avatar: true },
      })

      if (user?.avatar) {
        const oldAvatarPath = path.join(UPLOAD_DIR, user.avatar)
        if (existsSync(oldAvatarPath)) {
          await unlink(oldAvatarPath)
        }
      }

      await prisma.user.update({
        where: { id: userId },
        data: { avatar: '' },
      })

      return NextResponse.json({ message: 'Аватар удален', avatar: null })
    }

    // Валидация типа файла
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            'Недопустимый тип файла. Используйте PNG, JPG, JPEG, GIF или WEBP',
        },
        { status: 400 }
      )
    }

    // Валидация размера
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Файл слишком большой. Максимальный размер: 5MB' },
        { status: 400 }
      )
    }

    // Создаем директорию, если её нет
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    // Удаляем старый аватар
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    })

    if (user?.avatar) {
      const oldAvatarPath = path.join(UPLOAD_DIR, user.avatar)
      if (existsSync(oldAvatarPath)) {
        await unlink(oldAvatarPath)
      }
    }

    // Генерируем уникальное имя файла
    const fileExtension = file.name.split('.').pop() || 'webp'
    const fileName = `${userId}-${Date.now()}.webp`

    // Конвертируем в буфер
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Обрабатываем изображение с Sharp
    const processedImage = await sharp(buffer)
      .resize(FILE_UPLOAD.AVATAR_DIMENSIONS.width, FILE_UPLOAD.AVATAR_DIMENSIONS.height, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: FILE_UPLOAD.AVATAR_QUALITY })
      .toBuffer()

    // Сохраняем файл
    const filePath = path.join(UPLOAD_DIR, fileName)
    await writeFile(filePath, processedImage)

    // Обновляем запись в БД
    await prisma.user.update({
      where: { id: userId },
      data: { avatar: fileName },
    })

    return NextResponse.json({
      message: 'Аватар успешно загружен',
      avatar: fileName,
    })
  } catch (error) {
    logError(error, { endpoint: '/api/users/me/avatar', method: 'POST' })
    return NextResponse.json(
      { error: 'Ошибка при загрузке аватара' },
      { status: 500 }
    )
  }
}
