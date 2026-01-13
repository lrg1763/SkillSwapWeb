# API Документация

## Базовый URL

```
http://localhost:3000/api
```

## Аутентификация

Большинство API endpoints требуют аутентификации через NextAuth.js. Используйте сессионные куки для аутентификации.

## Endpoints

### Аутентификация

#### POST /api/auth/register
Регистрация нового пользователя.

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "confirmPassword": "string"
}
```

**Response:**
- `201` - Пользователь успешно зарегистрирован
- `400` - Ошибка валидации
- `409` - Пользователь уже существует
- `429` - Слишком много запросов

#### POST /api/auth/[...nextauth]
NextAuth.js endpoints для входа, выхода и управления сессией.

### Пользователи

#### GET /api/users/me
Получить информацию о текущем пользователе.

**Response:**
```json
{
  "id": 1,
  "username": "string",
  "avatar": "string",
  "rating": 4.5,
  "skillsOffered": "string",
  "skillsNeeded": "string",
  "location": "string",
  "bio": "string",
  "stats": {
    "reviewsCount": 10,
    "messagesCount": 50,
    "exchangesCount": 5
  }
}
```

#### PUT /api/users/me
Обновить профиль текущего пользователя.

#### GET /api/users/search
Поиск пользователей.

**Query Parameters:**
- `query` - Поисковый запрос
- `min_rating` - Минимальный рейтинг
- `location` - Местоположение
- `page` - Номер страницы

#### GET /api/users/[id]
Получить информацию о пользователе по ID.

#### GET /api/users/[id]/stats
Получить статистику пользователя.

### Сообщения

#### GET /api/messages/chats
Получить список всех чатов пользователя.

#### GET /api/messages/chat/[userId]
Получить сообщения с конкретным пользователем.

### Отзывы

#### POST /api/reviews
Создать или обновить отзыв.

#### GET /api/reviews/user/[userId]
Получить отзывы о пользователе.

#### DELETE /api/reviews
Удалить отзыв.

### Избранное

#### GET /api/favorites
Получить список избранных пользователей.

#### POST /api/favorites/[userId]
Добавить пользователя в избранное.

#### DELETE /api/favorites/[userId]
Удалить пользователя из избранного.

### Блокировка

#### GET /api/blocks
Получить список заблокированных пользователей.

#### POST /api/blocks/[userId]
Заблокировать/разблокировать пользователя.

### Health Check

#### GET /api/health
Проверка состояния сервиса.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "uptime": 12345
}
```

## OpenAPI спецификация

Получить полную OpenAPI спецификацию можно по адресу:
```
GET /api/docs
```

## Rate Limiting

API endpoints имеют rate limiting:
- Регистрация: 5 запросов за 15 минут
- Вход: 10 запросов за 15 минут
- Общие API: 100 запросов за минуту

При превышении лимита возвращается статус `429` с заголовками:
- `X-RateLimit-Limit` - Максимальное количество запросов
- `X-RateLimit-Remaining` - Оставшееся количество запросов
- `X-RateLimit-Reset` - Время сброса лимита (timestamp)
- `Retry-After` - Время ожидания в секундах
