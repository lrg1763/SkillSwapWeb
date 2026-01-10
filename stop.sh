#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

info() {
    echo -e "${BLUE}ℹ ${NC}$1"
}

success() {
    echo -e "${GREEN}✓${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

echo -e "${YELLOW}Остановка серверов SkillSwap...${NC}\n"

# Остановка Next.js процессов
info "Остановка Next.js сервера..."
pkill -f "next dev" 2>/dev/null
pkill -f "next start" 2>/dev/null
if [ $? -eq 0 ]; then
    success "Next.js сервер остановлен"
else
    warning "Next.js сервер не был запущен"
fi

# Остановка Socket.IO процессов
info "Остановка Socket.IO сервера..."
pkill -f "node.*socket-server" 2>/dev/null
pkill -f "socket-server/index.js" 2>/dev/null
if [ $? -eq 0 ]; then
    success "Socket.IO сервер остановлен"
else
    warning "Socket.IO сервер не был запущен"
fi

# Очистка лог-файлов (опционально)
read -p "Удалить лог-файлы? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f nextjs-server.log socket-server.log
    success "Лог-файлы удалены"
fi

echo ""
success "Готово!"
