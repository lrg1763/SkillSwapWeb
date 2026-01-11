'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navItems = [
    { id: 'features', label: 'О платформе' },
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
        <div className="flex flex-col lg:flex-row lg:justify-between gap-8 lg:gap-8 mb-8">
          {/* Left: Contact Information */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-base md:text-lg font-onyx-regular text-primary-gray-medium">
                Сотрудничество:{' '}
                <a
                  href="mailto:info@skillswap.com"
                  className="text-primary-white hover:opacity-80 transition-opacity font-onyx-regular"
                >
                  info@skillswap.com
                </a>
              </p>
            </div>
            <div>
              <p className="text-base md:text-lg font-onyx-regular text-primary-gray-medium">
                © {currentYear} SkillSwap
              </p>
            </div>
          </div>

          {/* Right: Support and Social Media */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-base md:text-lg font-onyx-regular text-primary-gray-medium">
                Поддержка:{' '}
                <a
                  href="mailto:support@skillswap.com"
                  className="text-primary-white hover:opacity-80 transition-opacity font-onyx-regular"
                >
                  support@skillswap.com
                </a>
              </p>
            </div>
            {/* Social Media Links - Horizontal */}
            <div className="flex items-center gap-6">
              <a
                href="https://vk.com/skillswap"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-onyx-regular text-primary-gray-medium hover:text-primary-white transition-colors"
              >
                VK
              </a>
              <a
                href="https://youtube.com/@skillswap"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-onyx-regular text-primary-gray-medium hover:text-primary-white transition-colors"
              >
                YouTube
              </a>
              <a
                href="https://t.me/skillswap"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-onyx-regular text-primary-gray-medium hover:text-primary-white transition-colors"
              >
                Telegram
              </a>
            </div>
          </div>
        </div>

        {/* Bottom: Legal Links */}
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 pt-6 border-t-2 border-primary-gray-medium">
          <a
            href="#"
            className="text-sm font-onyx-regular text-primary-gray-medium hover:text-primary-white transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            О проекте
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
        </div>
      </div>
    </footer>
  )
}
