#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
info() {
    echo -e "${BLUE}ℹ ${NC}$1"
}

success() {
    echo -e "${GREEN}✓${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

# Функция для очистки при завершении
cleanup() {
    echo ""
    info "Остановка серверов..."
    kill $NEXTJS_PID 2>/dev/null
    kill $SOCKET_PID 2>/dev/null
    exit 0
}

# Установка обработчика сигналов для корректного завершения
trap cleanup SIGINT SIGTERM

echo -e "${GREEN}"
echo "╔════════════════════════════════════════════════════╗"
echo "║         SkillSwap - Полный запуск проекта         ║"
echo "╚════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# Переход в директорию проекта
cd "$(dirname "$0")"

# Проверка наличия .env.local
info "Проверка конфигурации..."
if [ ! -f .env.local ]; then
    error "Файл .env.local не найден!"
    echo ""
    warning "Создайте файл .env.local со следующим содержимым:"
    echo ""
    cat << 'EOF'
DATABASE_URL="postgresql://username:password@localhost:5432/skillswap?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="skillswap-development-secret-key-change-in-production-2024"
NEXT_PUBLIC_SOCKET_SERVER_URL="http://localhost:3001"
SOCKET_PORT=3001
NODE_ENV="development"
EOF
    echo ""
    exit 1
fi
success ".env.local найден"

# Проверка и установка зависимостей корневого проекта
info "Проверка зависимостей корневого проекта..."
if [ ! -d "node_modules" ]; then
    warning "Зависимости не найдены, установка..."
    npm install
    if [ $? -ne 0 ]; then
        error "Ошибка при установке зависимостей"
        exit 1
    fi
    success "Зависимости установлены"
else
    success "Зависимости корневого проекта найдены"
fi

# Генерация Prisma Client
info "Генерация Prisma Client..."
npm run db:generate > /dev/null 2>&1
if [ $? -eq 0 ]; then
    success "Prisma Client сгенерирован"
else
    warning "Предупреждение: возможно Prisma Client уже сгенерирован"
fi

# Проверка и установка зависимостей socket-server
info "Проверка зависимостей socket-server..."
if [ ! -d "socket-server/node_modules" ]; then
    warning "Зависимости socket-server не найдены, установка..."
    cd socket-server
    npm install
    if [ $? -ne 0 ]; then
        error "Ошибка при установке зависимостей socket-server"
        exit 1
    fi
    cd ..
    success "Зависимости socket-server установлены"
else
    success "Зависимости socket-server найдены"
fi

# Проверка наличия .env для socket-server
info "Проверка конфигурации socket-server..."
if [ ! -f "socket-server/.env" ]; then
    warning "Создание .env для socket-server..."
    cp .env.local socket-server/.env
    success ".env для socket-server создан"
else
    success ".env для socket-server найден"
fi

# Генерация Prisma Client для socket-server
info "Генерация Prisma Client для socket-server..."
cd socket-server
if [ ! -d "node_modules/@prisma/client" ]; then
    npx prisma generate --schema=../prisma/schema.prisma > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        success "Prisma Client для socket-server сгенерирован"
    fi
fi
cd ..

# Остановка предыдущих процессов (если запущены)
info "Проверка запущенных процессов..."
pkill -f "next dev" 2>/dev/null
pkill -f "node.*socket-server" 2>/dev/null
sleep 1

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Запуск серверов...${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo ""

# Загрузка переменных окружения из .env.local (безопасный способ)
info "Загрузка переменных окружения..."
set -a
source .env.local 2>/dev/null || true
set +a

# Запуск Socket.IO сервера в фоновом режиме
info "Запуск Socket.IO сервера на порту ${SOCKET_PORT:-3001}..."
cd socket-server
NODE_ENV=${NODE_ENV:-development} \
DATABASE_URL="${DATABASE_URL}" \
SOCKET_PORT=${SOCKET_PORT:-3001} \
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}" \
NEXTAUTH_URL="${NEXTAUTH_URL:-http://localhost:3000}" \
node index.js > ../socket-server.log 2>&1 &
SOCKET_PID=$!
cd ..

# Небольшая задержка для запуска Socket.IO сервера
sleep 2

# Проверка, запустился ли Socket.IO сервер
if ps -p $SOCKET_PID > /dev/null; then
    success "Socket.IO сервер запущен (PID: $SOCKET_PID)"
else
    error "Ошибка запуска Socket.IO сервера"
    echo "Проверьте логи: tail -f socket-server.log"
    exit 1
fi

# Запуск Next.js сервера в фоновом режиме
info "Запуск Next.js сервера на порту 3000..."
npm run dev > nextjs-server.log 2>&1 &
NEXTJS_PID=$!

# Небольшая задержка для запуска Next.js сервера
sleep 3

# Проверка, запустился ли Next.js сервер
if ps -p $NEXTJS_PID > /dev/null; then
    success "Next.js сервер запущен (PID: $NEXTJS_PID)"
else
    error "Ошибка запуска Next.js сервера"
    echo "Проверьте логи: tail -f nextjs-server.log"
    kill $SOCKET_PID 2>/dev/null
    exit 1
fi

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Проект успешно запущен!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📍 Next.js:     ${GREEN}http://localhost:3000${NC}"
echo -e "${BLUE}📍 Socket.IO:   ${GREEN}http://localhost:3001${NC}"
echo ""
echo -e "${YELLOW}Логи:${NC}"
echo -e "  • Next.js:    ${BLUE}tail -f nextjs-server.log${NC}"
echo -e "  • Socket.IO:  ${BLUE}tail -f socket-server.log${NC}"
echo ""
echo -e "${YELLOW}Для остановки нажмите Ctrl+C${NC}"
echo ""

# Ожидание завершения процессов
wait
