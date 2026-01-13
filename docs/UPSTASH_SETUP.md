# Настройка Upstash Redis для Rate Limiting

## Шаги настройки

1. Создайте аккаунт на [Upstash](https://upstash.com/)
2. Создайте новый Redis database
3. Скопируйте `UPSTASH_REDIS_REST_URL` и `UPSTASH_REDIS_REST_TOKEN`
4. Добавьте переменные окружения в `.env.local`:

```
UPSTASH_REDIS_REST_URL=your_rest_url
UPSTASH_REDIS_REST_TOKEN=your_rest_token
```

5. Установите зависимости:
```bash
npm install @upstash/redis @upstash/ratelimit
```

6. Запустите миграции Prisma (если были изменения в схеме):
```bash
npm run db:migrate
```

## Использование

После настройки, rate limiting будет автоматически использовать Redis вместо in-memory хранилища.
