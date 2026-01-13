# SkillSwap

Платформа для peer-to-peer обмена навыками и услугами без использования денег. Современное веб-приложение с реальным временем для связи между пользователями.

![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-black)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-black)

##  Особенности

### Основной функционал
-  **Регистрация и аутентификация** - Безопасная система входа с использованием NextAuth.js v5
-  **Профили пользователей** - Настройка профиля, загрузка аватаров, управление навыками
-  **Поиск пользователей** - Поиск партнеров по навыкам, местоположению и другим критериям
-  **Система сообщений** - Реал-тайм чат с использованием Socket.IO
-  **Отзывы и рейтинги** - Система оценки пользователей после обмена
-  **Избранное** - Сохранение интересных пользователей
-  **Блокировка пользователей** - Защита от нежелательных контактов
-  **Приветственная страница** - Современный landing page с FAQ аккордеоном

### Технические улучшения
-  **Валидация данных** - Zod схемы для всех форм и API endpoints
-  **Безопасность** - CSRF защита, XSS защита, rate limiting, brute force protection
-  **Error Handling** - Централизованная обработка ошибок с логированием
-  **Типизация** - Полная типизация TypeScript для API и компонентов
-  **Оптимизация изображений** - Автоматическая оптимизация аватаров с использованием Sharp
-  **Skeleton Loaders** - Плавные состояния загрузки
-  **Error Boundaries** - Обработка ошибок React компонентов
-  **Environment Validation** - Валидация переменных окружения при старте

##  Технологический стек

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Язык**: TypeScript (strict mode)
- **UI**: React 18.3+ (Server & Client Components)
- **Стилизация**: Tailwind CSS
- **Формы**: React Hook Form + Zod
- **Анимации**: Framer Motion
- **Уведомления**: Sonner (Toast)
- **Иконки**: Lucide React

### Backend
- **База данных**: PostgreSQL
- **ORM**: Prisma 5.19+
- **Аутентификация**: NextAuth.js v5 (Auth.js)
- **Реал-тайм**: Socket.IO (server + client)
- **Валидация**: Zod
- **Хеширование**: bcryptjs
- **JWT**: jsonwebtoken

### Инфраструктура
- **Репозиторий**: Git
- **Форматирование**: Prettier
- **Линтинг**: ESLint
- **Типы**: TypeScript строгий режим

##  Требования

- **Node.js**: 18+ 
- **npm**: 9+ или **yarn**: 1.22+ или **pnpm**: 8+
- **PostgreSQL**: 15+
- **Git**: для клонирования репозитория

##  Быстрый старт

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd SkillSwapWeb
```

### 2. Установка зависимостей

```bash
npm install
cd socket-server && npm install && cd ..
```

### 3. Установка и настройка PostgreSQL

#### macOS (через Homebrew):
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Windows:
Скачайте и установите с официального сайта: https://www.postgresql.org/download/windows/

#### Создание базы данных:
```bash
# Подключитесь к PostgreSQL
psql postgres

# Создайте базу данных
CREATE DATABASE skillswap;

# Создайте пользователя (опционально)
CREATE USER skillswap_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE skillswap TO skillswap_user;
\q
```

### 4. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
# База данных
DATABASE_URL="postgresql://user:password@localhost:5432/skillswap?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-min-32-chars"

# Socket.IO Server
NEXT_PUBLIC_SOCKET_SERVER_URL="http://localhost:3001"
SOCKET_PORT="3001"

# Environment
NODE_ENV="development"
```

**Генерация NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 5. Инициализация базы данных

```bash
# Генерация Prisma Client
npm run db:generate

# Применение миграций
npm run db:migrate

# Или отправка схемы в БД (для разработки)
npm run db:push
```

### 6. Запуск проекта

**Автоматический запуск (рекомендуется):**

```bash
# Запуск всего проекта (Next.js + Socket.IO)
./start-full.sh

# Или через npm
npm run dev:full
```

**Ручной запуск:**

```bash
# Терминал 1 - Next.js сервер
npm run dev

# Терминал 2 - Socket.IO сервер
npm run dev:socket
```

**Остановка проекта:**

```bash
# Автоматическая остановка
./stop.sh

# Или через npm
npm stop
```

Приложение будет доступно на:
- **Next.js**: http://localhost:3000
- **Socket.IO**: http://localhost:3001

## Структура проекта

```
SkillSwapWeb/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Страницы аутентификации
│   │   ├── login/               # Страница входа
│   │   └── register/            # Страница регистрации
│   ├── (protected)/              # Защищенные страницы
│   │   ├── profile/             # Профиль пользователя
│   │   ├── search/              # Поиск пользователей
│   │   ├── match/[userId]/      # Страница пользователя
│   │   ├── chats/               # Список чатов
│   │   ├── favorites/           # Избранные пользователи
│   │   ├── subscription/        # Подписка
│   │   ├── developers/          # Страница разработчиков
│   │   └── change-password/     # Смена пароля
│   ├── api/                      # API Routes
│   │   ├── auth/                # Аутентификация
│   │   ├── users/               # Пользователи
│   │   ├── messages/            # Сообщения
│   │   ├── reviews/             # Отзывы
│   │   ├── favorites/           # Избранное
│   │   └── health/              # Health check
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Главная страница
│   └── globals.css              # Глобальные стили
├── components/                   # React компоненты
│   ├── ui/                      # UI компоненты
│   │   ├── Accordion.tsx        # Аккордеон для FAQ
│   │   ├── Skeleton.tsx         # Skeleton loaders
│   │   └── Toast.tsx            # Toast уведомления
│   ├── layout/                  # Компоненты layout
│   │   └── Sidebar.tsx          # Боковая панель навигации
│   ├── chat/                    # Компоненты чата
│   │   ├── ChatContainer.tsx    # Контейнер чата
│   │   ├── ChatList.tsx         # Список чатов
│   │   ├── ChatWindow.tsx       # Окно чата
│   │   ├── MessageBubble.tsx    # Сообщение
│   │   └── ChatInput.tsx        # Ввод сообщения
│   ├── user/                    # Компоненты пользователя
│   │   ├── UserCard.tsx         # Карточка пользователя
│   │   ├── UserProfile.tsx      # Профиль пользователя
│   │   └── Avatar.tsx           # Аватар пользователя
│   ├── forms/                   # Формы
│   │   ├── LoginForm.tsx        # Форма входа
│   │   ├── RegisterForm.tsx     # Форма регистрации
│   │   └── ProfileForm.tsx      # Форма профиля
│   ├── reviews/                 # Компоненты отзывов
│   │   ├── ReviewForm.tsx       # Форма отзыва
│   │   └── ReviewList.tsx       # Список отзывов
│   ├── home/                    # Компоненты главной
│   │   └── HomePageClient.tsx   # Клиентский компонент главной
│   └── ErrorBoundary.tsx        # Error Boundary
├── lib/                          # Утилиты и хелперы
│   ├── db.ts                    # Prisma client
│   ├── auth.ts                  # NextAuth конфигурация
│   ├── validations.ts           # Zod схемы
│   ├── utils.ts                 # Общие утилиты
│   ├── session.ts               # Утилиты сессии
│   ├── socket.ts                # Socket.IO hook
│   ├── api-client.ts            # Централизованный API клиент
│   ├── error-handler.ts         # Обработка ошибок
│   ├── rate-limit.ts            # Rate limiting
│   ├── security.ts              # Утилиты безопасности
│   └── env.ts                   # Валидация окружения
├── prisma/                       # Prisma
│   └── schema.prisma            # Схема базы данных
├── socket-server/                # Socket.IO сервер
│   ├── index.js                 # Основной файл сервера
│   └── package.json             # Зависимости сервера
├── public/                       # Статические файлы
│   ├── fonts/                   # Шрифты Onyx SemiMono
│   ├── uploads/                 # Загруженные файлы
│   │   └── avatars/             # Аватары пользователей
│   ├── favicon.ico              # Favicon
│   └── site.webmanifest         # PWA манифест
├── types/                        # TypeScript типы
│   └── api.ts                   # Типы API
├── middleware.ts                 # Next.js middleware
├── next.config.js               # Конфигурация Next.js
├── tailwind.config.ts           # Конфигурация Tailwind
├── tsconfig.json                # Конфигурация TypeScript
├── start-full.sh                # Скрипт полного запуска
├── stop.sh                      # Скрипт остановки
└── package.json                 # Зависимости проекта
```

##  Команды

### Разработка
```bash
npm run dev              # Запуск Next.js dev сервера
npm run dev:socket       # Запуск Socket.IO сервера
npm run dev:full         # Запуск всего проекта (Next.js + Socket.IO)
```

### Продакшен
```bash
npm run build            # Сборка для продакшена
npm run start            # Запуск продакшен сервера
npm run start:full       # Запуск всего проекта в продакшене
```

### Утилиты
```bash
npm run lint             # Проверка кода ESLint
npm run format           # Форматирование кода Prettier
npm stop                 # Остановка всех серверов
```

### База данных
```bash
npm run db:generate      # Генерация Prisma Client
npm run db:migrate       # Применение миграций
npm run db:push          # Отправить схему в БД (без миграций)
npm run db:studio        # Открыть Prisma Studio
```

##  Безопасность

### Реализованные меры защиты

-  **Rate Limiting** - Ограничение частоты запросов (регистрация, логин, API)
-  **CSRF Protection** - Защита от CSRF атак
-  **XSS Protection** - Санитизация HTML и экранирование
-  **Brute Force Protection** - Защита от перебора паролей
-  **Password Validation** - Строгие правила для паролей (мин. 8 символов, заглавные, строчные, цифры)
-  **Security Headers** - HSTS, X-Frame-Options, X-Content-Type-Options, и др.
-  **Input Validation** - Валидация всех входных данных с помощью Zod
-  **SQL Injection Protection** - Prisma ORM предотвращает SQL инъекции
-  **Session Security** - Безопасное хранение сессий
-  **Environment Variables Validation** - Проверка обязательных переменных окружения

### Рекомендации для продакшена

- Использовать Redis для rate limiting вместо in-memory решения
- Настроить HTTPS (SSL/TLS сертификаты)
- Использовать переменные окружения для секретов
- Настроить мониторинг и логирование
- Регулярно обновлять зависимости
- Использовать Content Security Policy (CSP)

##  API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация нового пользователя
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Пользователи
- `GET /api/users/me` - Текущий пользователь
- `GET /api/users/[id]` - Информация о пользователе
- `PUT /api/users/me` - Обновление профиля
- `POST /api/users/me/avatar` - Загрузка аватара
- `GET /api/users/search` - Поиск пользователей
- `GET /api/users/[id]/stats` - Статистика пользователя

### Сообщения
- `GET /api/messages/chat/[userId]` - Получить сообщения с пользователем
- `GET /api/messages` - Получить все чаты пользователя

### Отзывы
- `GET /api/reviews/user/[userId]` - Отзывы о пользователе
- `POST /api/reviews` - Создать отзыв

### Избранное
- `GET /api/favorites` - Список избранных
- `POST /api/favorites` - Добавить в избранное
- `DELETE /api/favorites/[userId]` - Удалить из избранного

### Утилиты
- `GET /api/health` - Health check endpoint

##  База данных

### Модели Prisma

- **User** - Пользователи (username, password, skills, location, bio, avatar, rating, etc.)
- **Message** - Сообщения между пользователями
- **Review** - Отзывы о пользователях
- **Favorite** - Избранные пользователи
- **Block** - Заблокированные пользователи

Подробная схема в файле [prisma/schema.prisma](./prisma/schema.prisma)

##  Дизайн

### Цветовая схема
- **Основной цвет**: #000000 (черный)
- **Фон**: #FFFFFF (белый)
- **Акцент**: Светло-зеленый (как на tips.tips)
- **Серый текст**: Для вторичного текста

### Типографика
- **Основной шрифт**: Onyx SemiMono Regular
- **Заголовки**: Onyx SemiMono Black
- **Моноширинный шрифт**: Для технического вида

### Стиль
- Минималистичный дизайн
- Много белого пространства
- Карточный дизайн контента
- Фиксированный сайдбар навигации
- Плавные переходы и анимации

## Socket.IO События

### Клиент -> Сервер:
- `join_room` - Присоединение к комнате пользователя
- `send_message` - Отправка сообщения
- `typing` - Индикатор печати
- `edit_message` - Редактирование сообщения
- `delete_message` - Удаление сообщения
- `update_online_status` - Обновление статуса онлайн

### Сервер -> Клиент:
- `receive_message` - Получение нового сообщения
- `user_typing` - Уведомление о печати
- `message_edited` - Уведомление об редактировании
- `message_deleted` - Уведомление об удалении
- `user_online` - Пользователь стал онлайн
- `user_offline` - Пользователь стал офлайн
- `new_message_notification` - Уведомление о новом сообщении
- `error` - Ошибка
- `message_sent` - Подтверждение отправки сообщения

### Настройка Socket.IO сервера

Socket.IO сервер работает как отдельный процесс на порту 3001. Для запуска используйте:

```bash
npm run dev:socket
```

Или через скрипт полного запуска:

```bash
npm run dev:full
```

**Важно**: `NEXTAUTH_SECRET` и `DATABASE_URL` в `socket-server/.env` должны совпадать с настройками основного проекта (`.env.local`).

##  Текущий статус

### Реализовано

-  **Этап 1**: Инициализация проекта и базовая структура
-  **Этап 2**: Настройка базы данных (Prisma + PostgreSQL)
-  **Этап 3**: Настройка аутентификации (NextAuth.js v5)
-  **Этап 4**: Страницы аутентификации (login/register)
-  **Этап 5**: Главная страница и базовый layout
-  **Этап 6**: Профиль пользователя и управление данными
-  **Этап 7**: Поиск пользователей
-  **Этап 8**: Система сообщений (Socket.IO)
-  **Этап 9**: Отзывы и рейтинги
-  **Этап 10**: Избранное и блокировка
-  **Этап 11**: Безопасность и валидация
-  **Этап 12**: Error handling и улучшения UX
-  **Этап 13**: Приветственная страница с FAQ
-  **Этап 14**: Скрипты автоматизации (start/stop)
-  **Этап 15**: Favicon и PWA манифест

### Реализованные улучшения

- Error Boundary компонент для обработки ошибок React
- Централизованная обработка ошибок API с логированием
- Rate Limiting для защиты от злоупотреблений
- Skeleton Loaders для улучшения UX при загрузке
- Environment Validation для проверки переменных окружения
- Типизация API responses для безопасности типов
- Security Headers в Next.js конфигурации
- Улучшенная безопасность (CSRF, XSS, brute force protection)
- Централизованный API клиент с автоматической обработкой ошибок
- Health Check endpoint для мониторинга
- Улучшенная валидация паролей (мин. 8 символов, заглавные, строчные, цифры)

### В разработке / Планируется

- Улучшение производительности
- Расширение тестового покрытия
- Дополнительные функции обмена
- Мобильное приложение
- Redis для rate limiting (production)
- Мониторинг (Sentry)
- SEO оптимизация

##  Вклад

Проект находится в активной разработке. Предложения и улучшения приветствуются!

##  Лицензия

Этот проект является частным и защищен авторским правом.

---

