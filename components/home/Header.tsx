'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
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
    <>
      <header className="sticky top-0 z-50 bg-primary-white border-b-2 border-primary-gray-medium">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - слева */}
          <Link
            href="/"
            className="text-xl md:text-2xl lg:text-3xl font-onyx-black text-primary-black hover:opacity-80 transition-opacity"
          >
            SkillSwap
          </Link>

            {/* Navigation - по центру (скрыто на мобильных) */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-center">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm xl:text-base font-onyx-regular text-primary-black hover:opacity-70 transition-opacity whitespace-nowrap"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Auth buttons - справа (скрыто на мобильных) */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/login"
                className="px-6 py-3 border border-primary-black text-primary-black font-onyx-regular rounded hover:bg-primary-gray-light transition-colors text-sm"
              >
                Вход
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 bg-primary-black text-primary-white font-onyx-regular rounded hover:opacity-90 transition-opacity text-sm"
              >
                Регистрация
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-primary-black hover:opacity-70 transition-opacity"
              aria-label="Меню"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen mobile menu */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-primary-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Menu */}
          <nav className="fixed inset-0 bg-primary-white z-50 lg:hidden flex flex-col">
            <div className="container mx-auto px-4 pt-6 pb-8 flex flex-col h-full">
              {/* Close button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-primary-black hover:opacity-70 transition-opacity"
                  aria-label="Закрыть меню"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex flex-col gap-6 flex-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-2xl font-onyx-black text-primary-black hover:opacity-70 transition-opacity text-left py-4 border-b-2 border-primary-gray-medium"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              {/* Auth buttons в мобильном меню */}
              <div className="flex flex-col gap-4 pt-8 border-t-2 border-primary-gray-medium">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-6 py-4 border border-primary-black text-primary-black font-onyx-regular rounded hover:bg-primary-gray-light transition-colors text-lg text-center"
                >
                  Вход
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-6 py-4 bg-primary-black text-primary-white font-onyx-regular rounded hover:opacity-90 transition-opacity text-lg text-center"
                >
                  Регистрация
                </Link>
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  )
}
