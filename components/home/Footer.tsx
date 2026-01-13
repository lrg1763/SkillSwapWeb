'use client'

import Link from 'next/link'

// YouTube Icon Component
const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

// Telegram Icon Component
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
)

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navItems = [
    { id: 'features', label: 'Инструкция' },
    { id: 'advantages', label: 'Преимущества' },
    { id: 'examples', label: 'Примеры' },
    { id: 'reviews', label: 'Отзывы' },
    { id: 'technologies', label: 'Технологии' },
    { id: 'faq', label: 'FAQ' },
  ]

  return (
    <footer className="text-primary-white border-t-2 border-primary-gray-medium" style={{ backgroundColor: '#111111' }}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Navigation Links - Vertical */}
        <div className="mb-12 md:mb-14">
          <nav className="flex flex-col items-center gap-4 md:gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-2xl md:text-3xl lg:text-4xl font-onyx-black text-primary-white hover:opacity-70 transition-opacity"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Footer Content */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
          {/* Сотрудничество */}
          <div className="px-6 py-3 rounded" style={{ backgroundColor: 'rgb(41, 41, 41)' }}>
            <p className="text-lg font-onyx-regular text-white">
              Сотрудничество:{' '}
              <a
                href="mailto:info@skillswap.com"
                className="text-white hover:opacity-80 transition-opacity font-onyx-regular"
              >
                info@skillswap.com
              </a>
            </p>
          </div>

          {/* Поддержка */}
          <div className="px-6 py-3 rounded" style={{ backgroundColor: 'rgb(41, 41, 41)' }}>
            <p className="text-lg font-onyx-regular text-white">
              Поддержка:{' '}
              <a
                href="mailto:support@skillswap.com"
                className="text-white hover:opacity-80 transition-opacity font-onyx-regular"
              >
                support@skillswap.com
              </a>
            </p>
          </div>

          {/* VK */}
          <div className="px-6 py-3 rounded" style={{ backgroundColor: 'rgb(41, 41, 41)' }}>
            <a
              href="https://vk.com/skillswap"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-onyx-regular text-white hover:opacity-80 transition-opacity"
            >
              VK
            </a>
          </div>

          {/* YouTube */}
          <div className="px-6 py-3 rounded" style={{ backgroundColor: 'rgb(41, 41, 41)' }}>
            <a
              href="https://youtube.com/@skillswap"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-lg font-onyx-regular text-white hover:opacity-80 transition-opacity"
            >
              <YouTubeIcon className="w-6 h-6 flex-shrink-0" />
              <span>YouTube</span>
            </a>
          </div>

          {/* Telegram */}
          <div className="px-6 py-3 rounded" style={{ backgroundColor: 'rgb(41, 41, 41)' }}>
            <a
              href="https://t.me/skillswap"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-lg font-onyx-regular text-white hover:opacity-80 transition-opacity"
            >
              <TelegramIcon className="w-6 h-6 flex-shrink-0" />
              <span>Telegram</span>
            </a>
          </div>

          {/* Language Switcher */}
          <div className="px-6 py-3 rounded" style={{ backgroundColor: 'rgb(41, 41, 41)' }}>
            <button
              className="flex items-center gap-2 text-lg font-onyx-regular text-white hover:opacity-80 transition-opacity cursor-pointer"
              onClick={(e) => e.preventDefault()}
            >
              <span>RU</span>
              <span className="text-primary-gray-medium">/</span>
              <span className="opacity-60">EN</span>
            </button>
          </div>
        </div>

        {/* Bottom: Legal Links */}
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 pt-6 border-t-2 border-primary-gray-medium">
          <span className="text-sm font-onyx-regular text-primary-gray-medium">
            © 2026 SkillSwap
          </span>
          <a
            href="#"
            className="text-sm font-onyx-regular text-primary-gray-medium hover:text-primary-white transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            Документация и информация о стоимости ПО
          </a>
          <a
            href="#"
            className="text-sm font-onyx-regular text-primary-gray-medium hover:text-primary-white transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            Правила использования сервиса
          </a>
          <a
            href="#"
            className="text-sm font-onyx-regular text-primary-gray-medium hover:text-primary-white transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            Политика конфиденциальности
          </a>
          <a
            href="#"
            className="text-sm font-onyx-regular text-primary-gray-medium hover:text-primary-white transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            О компании
          </a>
        </div>
      </div>
    </footer>
  )
}
