'use client'

import Link from 'next/link'
import Accordion from '@/components/ui/Accordion'
import { Star, Sparkles, Shield, ShieldCheck, ShieldAlert, Zap, UserPlus, Search, MessageCircle, Code, Palette, Languages, Heart, ArrowRight, ArrowLeft, Database, Lock, Loader, FileCode, Globe, Key } from 'lucide-react'
import Header from './Header'
import Footer from './Footer'

interface HomePageClientProps {
  isAuthenticated: boolean
}

export default function HomePageClient({ isAuthenticated }: HomePageClientProps) {
  const faqItems = [
    {
      question: 'Что такое SkillSwap?',
      answer:
        'SkillSwap — это P2P-платформа для бартерного обмена навыками и услугами. Вы можете предлагать свои умения другим пользователям и получать взамен нужные вам услуги без использования денег.',
    },
    {
      question: 'Как начать пользоваться платформой?',
      answer:
        'Создайте аккаунт, заполните профиль, укажите свои навыки и потребности. Затем используйте поиск, чтобы найти подходящих партнеров для обмена.',
    },
    {
      question: 'Нужно ли платить за использование платформы?',
      answer:
        'Нет, базовое использование платформы бесплатное. Обмен происходит без денег — вы предоставляете свои навыки и получаете взамен услуги других пользователей.',
    },
    {
      question: 'Как работает система обмена?',
      answer:
        'Вы находите пользователя, который предлагает нужный вам навык, и договариваетесь об обмене. Например, вы помогаете с дизайном, а партнер — с программированием. Все условия обсуждаются в чате.',
    },
    {
      question: 'Как обеспечена безопасность?',
      answer:
        'Платформа использует систему рейтингов и отзывов. Вы можете оценивать партнеров после обмена, что помогает другим пользователям выбирать надежных партнеров. Также есть функция блокировки пользователей.',
    },
    {
      question: 'Можно ли указать несколько навыков?',
      answer:
        'Да, в профиле можно указать несколько навыков, которые вы готовы предложить, и несколько навыков, которые хотели бы получить. Это расширяет возможности для обмена.',
    },
    {
      question: 'Как работает поиск партнеров?',
      answer:
        'Используйте поиск по навыкам, местоположению или рейтингу. Алгоритм платформы подберет наиболее подходящих партнеров на основе ваших потребностей и навыков.',
    },
    {
      question: 'Можно ли общаться с партнерами?',
      answer:
        'Да, на платформе есть встроенный чат с поддержкой real-time сообщений. Вы можете обсудить детали обмена, условия и сроки выполнения работ прямо на сайте.',
    },
    {
      question: 'Что делать, если обмен не состоялся?',
      answer:
        'Если возникли проблемы, вы можете заблокировать пользователя и оставить отзыв. Рейтинговая система помогает другим пользователям избегать ненадежных партнеров.',
    },
    {
      question: 'Есть ли мобильная версия?',
      answer:
        'Да, платформа полностью адаптирована для мобильных устройств. Вы можете пользоваться SkillSwap на смартфоне, планшете или компьютере с одинаковым комфортом.',
    },
  ]

  return (
    <main className="min-h-screen bg-primary-white">
      {!isAuthenticated && <Header />}
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-40 md:pt-40 pb-16 md:pb-24 relative">
        <div className="max-w-4xl mx-auto text-center relative">
          {/* SVG стрелка - только на десктопе */}
          <div className="hidden lg:block absolute right-4 top-28 xl:right-8">
            <img
              src="/title-arrow-lg.svg"
              alt=""
              className="w-32 xl:w-40 h-auto"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-onyx-black mb-6">
            Бартерный обмен —<br />удобно и легко!
          </h1>
          {!isAuthenticated && (
            <p className="text-lg md:text-xl text-primary-gray-text mb-8 max-w-2xl mx-auto">
              SkillSwap — это инновационная платформа для бартерного обмена навыками и услугами. Предлагайте свои умения, находите нужных специалистов и обменивайтесь опытом без денег!
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24">
            {isAuthenticated ? (
              <>
                <Link
                  href="/search"
                  className="px-8 py-4 bg-primary-black text-primary-white font-onyx-black rounded hover:opacity-90 transition-opacity text-lg"
                >
                  Найти обмен
                </Link>
                <Link
                  href="/profile"
                  className="px-8 py-4 border-2 border-primary-black text-primary-black font-onyx-black rounded hover:bg-primary-gray-light transition-colors text-lg"
                >
                  Мой профиль
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-5 py-3 border border-primary-black text-primary-black font-onyx-regular rounded bg-primary-white hover:bg-primary-gray-light transition-colors text-lg w-48 text-center mx-auto sm:mx-0"
                >
                  Вход
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-3 bg-primary-black text-primary-white font-onyx-regular rounded hover:opacity-90 transition-opacity text-lg w-48 text-center mx-auto sm:mx-0"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid - только для неавторизованных */}
      {!isAuthenticated && (
        <section id="features" className="container mx-auto px-4 py-16 border-t-2 border-primary-gray-medium scroll-mt-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-onyx-black mb-12 text-center">
              Как пользоваться платформой
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Регистрация */}
              <div className="px-6 pt-6 pb-20 rounded max-w-xs mx-auto lg:mx-0" style={{ backgroundColor: 'rgb(254, 130, 229)' }}>
                <div className="flex items-start gap-0 mb-6">
                  <div className="w-14 h-14 rounded-full bg-primary-black flex items-center justify-center text-primary-white font-onyx-regular text-xl">
                    1
                  </div>
                  <div className="w-14 h-14 rounded-full bg-primary-black flex items-center justify-center">
                    <UserPlus className="h-7 w-7 text-primary-white" strokeWidth={1} />
                  </div>
                </div>
                <h3 className="text-xl font-onyx-black mb-3 text-primary-black">Регистрация</h3>
                <p className="text-primary-black font-onyx-regular">
                  Создайте профиль, укажите свои навыки и потребности
                </p>
              </div>
              {/* Поиск */}
              <div className="px-6 pt-6 pb-20 rounded max-w-xs mx-auto lg:mx-0" style={{ backgroundColor: 'rgb(0, 254, 135)' }}>
                <div className="flex items-start gap-0 mb-6">
                  <div className="w-14 h-14 rounded-full bg-primary-black flex items-center justify-center text-primary-white font-onyx-regular text-xl">
                    2
                  </div>
                  <div className="w-14 h-14 rounded-full bg-primary-black flex items-center justify-center">
                    <Search className="h-7 w-7 text-primary-white" strokeWidth={1} />
                  </div>
                </div>
                <h3 className="text-xl font-onyx-black mb-3 text-primary-black">Поиск</h3>
                <p className="text-primary-black font-onyx-regular">
                  Найдите людей с нужными вам навыками
                </p>
              </div>
              {/* Общение */}
              <div className="px-6 pt-6 pb-20 rounded max-w-xs mx-auto lg:mx-0" style={{ backgroundColor: 'rgb(168, 158, 254)' }}>
                <div className="flex items-start gap-0 mb-6">
                  <div className="w-14 h-14 rounded-full bg-primary-black flex items-center justify-center text-primary-white font-onyx-regular text-xl">
                    3
                  </div>
                  <div className="w-14 h-14 rounded-full bg-primary-black flex items-center justify-center">
                    <MessageCircle className="h-7 w-7 text-primary-white" strokeWidth={1} />
                  </div>
                </div>
                <h3 className="text-xl font-onyx-black mb-3 text-primary-black">Общение</h3>
                <p className="text-primary-black font-onyx-regular">
                  Договаривайтесь об обмене в удобном чате
                </p>
              </div>
              {/* Отзывы */}
              <div className="px-6 pt-6 pb-20 rounded max-w-xs mx-auto lg:mx-0" style={{ backgroundColor: 'rgb(255, 138, 75)' }}>
                <div className="flex items-start gap-0 mb-6">
                  <div className="w-14 h-14 rounded-full bg-primary-black flex items-center justify-center text-primary-white font-onyx-regular text-xl">
                    4
                  </div>
                  <div className="w-14 h-14 rounded-full bg-primary-black flex items-center justify-center">
                    <Star className="h-7 w-7 text-primary-white" strokeWidth={1} />
                  </div>
                </div>
                <h3 className="text-xl font-onyx-black mb-3 text-primary-black">Отзывы</h3>
                <p className="text-primary-black font-onyx-regular">
                  Оценивайте партнеров и стройте репутацию
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Advantages Section */}
      <section id="advantages" className="container mx-auto px-4 py-16 border-t-2 border-primary-gray-medium scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          {/* Заголовок по центру */}
          <h2 className="text-3xl md:text-4xl font-onyx-black mb-12 text-primary-black text-center">
            Преимущества нашей платформы
          </h2>
          
          {/* Desktop: сетка 2x2 с разделительными линиями */}
          <div className="hidden lg:block max-w-4xl mx-auto">
            <div className="grid grid-cols-2">
              {/* Блок 1: Без оплат */}
              <div className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-primary-black mt-1 flex-shrink-0"></div>
                  <div>
                    <p className="text-lg font-onyx-black text-primary-black leading-tight">
                      Обмен навыками без бюджета:<br />вы помогаете — вам помогают.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Блок 2: Быстро */}
              <div className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-primary-black mt-1 flex-shrink-0"></div>
                  <div>
                    <p className="text-lg font-onyx-black text-primary-black leading-tight">
                      Регистрация за минуту<br />и первые совпадения в тот же день.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Горизонтальная линия между первым и вторым рядом */}
              <div className="col-span-2 border-b-2 border-primary-black"></div>
              
              {/* Блок 3: Надёжно */}
              <div className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-primary-black mt-1 flex-shrink-0"></div>
                  <div>
                    <p className="text-lg font-onyx-black text-primary-black leading-tight">
                      Рейтинги, отзывы и статус онлайн<br />помогают выбрать партнера.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Блок 4: Удобно */}
              <div className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-primary-black mt-1 flex-shrink-0"></div>
                  <div>
                    <p className="text-lg font-onyx-black text-primary-black leading-tight">
                      Чат, уведомления, избранное<br />и блокировки — всё на месте.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: вертикальная версия */}
          <div className="lg:hidden">
            <div className="space-y-0 border-t border-l border-r border-b border-primary-black">
              <div className="p-6 border-b border-primary-black">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-primary-black mt-1 flex-shrink-0"></div>
                  <div>
                    <p className="text-lg font-onyx-black text-primary-black leading-tight">
                      Обмен навыками без бюджета:<br />вы помогаете — вам помогают.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 border-b border-primary-black">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-primary-black mt-1 flex-shrink-0"></div>
                  <div>
                    <p className="text-lg font-onyx-black text-primary-black leading-tight">
                      Регистрация за минуту<br />и первые совпадения в тот же день.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 border-b border-primary-black">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-primary-black mt-1 flex-shrink-0"></div>
                  <div>
                    <p className="text-lg font-onyx-black text-primary-black leading-tight">
                      Рейтинги, отзывы и статус онлайн<br />помогают выбрать партнера.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-primary-black mt-1 flex-shrink-0"></div>
                  <div>
                    <p className="text-lg font-onyx-black text-primary-black leading-tight">
                      Чат, уведомления, избранное<br />и блокировки — всё на месте.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section id="examples" className="container mx-auto px-4 py-16 border-t-2 border-primary-gray-medium scroll-mt-24">
        <div className="max-w-6xl mx-auto relative">
          <h2 className="text-3xl md:text-4xl font-onyx-black mb-12 text-center text-primary-black">
            Примеры сценариев обмена
          </h2>
          
          {/* Зеленая стрелка слева */}
          <div className="hidden lg:block absolute left-0 top-32 w-24 h-24 opacity-60">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                d="M 10 80 Q 30 40, 50 50 Q 70 60, 80 20"
                fill="none"
                stroke="#90EE90"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 75 15 L 85 20 L 75 25"
                fill="none"
                stroke="#90EE90"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Зеленая стрелка справа */}
          <div className="hidden lg:block absolute right-0 bottom-32 w-24 h-24 opacity-60">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                d="M 90 20 Q 70 60, 50 50 Q 30 40, 10 80"
                fill="none"
                stroke="#90EE90"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 15 75 L 10 85 L 5 75"
                fill="none"
                stroke="#90EE90"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {/* Разработка сайтов */}
            <div className="p-6 rounded" style={{ backgroundColor: 'rgb(30, 30, 30)' }}>
              <div className="mb-6">
                <h3 className="text-xl font-onyx-black text-primary-white mb-1">Разработка сайтов</h3>
                <p className="text-sm font-onyx-regular text-primary-gray-text">Индивидуальный обмен</p>
              </div>
              <div className="space-y-4">
                <div className="pb-4 border-b border-primary-gray-text/20">
                  <p className="text-sm font-onyx-black text-primary-green-light mb-2">
                    Предоставляю:
                  </p>
                  <p className="text-primary-white font-onyx-regular">
                    Вёрстку HTML/CSS, адаптивный дизайн
                  </p>
                </div>
                <div>
                  <p className="text-sm font-onyx-black text-primary-green-light mb-2">
                    Получаю:
                  </p>
                  <p className="text-primary-white font-onyx-regular">
                    Backend на Python, настройку сервера
                  </p>
                </div>
              </div>
            </div>

            {/* Дизайн и Маркетинг */}
            <div className="p-6 rounded" style={{ backgroundColor: 'rgb(30, 30, 30)' }}>
              <div className="mb-6">
                <h3 className="text-xl font-onyx-black text-primary-white mb-1">Дизайн и Маркетинг</h3>
                <p className="text-sm font-onyx-regular text-primary-gray-text">Индивидуальный обмен</p>
              </div>
              <div className="space-y-4">
                <div className="pb-4 border-b border-primary-gray-text/20">
                  <p className="text-sm font-onyx-black text-primary-green-light mb-2">
                    Предоставляю:
                  </p>
                  <p className="text-primary-white font-onyx-regular">
                    Графический дизайн, брендинг, иллюстрации
                  </p>
                </div>
                <div>
                  <p className="text-sm font-onyx-black text-primary-green-light mb-2">
                    Получаю:
                  </p>
                  <p className="text-primary-white font-onyx-regular">
                    SEO оптимизацию, SMM продвижение
                  </p>
                </div>
              </div>
            </div>

            {/* Изучение языков */}
            <div className="p-6 rounded" style={{ backgroundColor: 'rgb(30, 30, 30)' }}>
              <div className="mb-6">
                <h3 className="text-xl font-onyx-black text-primary-white mb-1">Изучение языков</h3>
                <p className="text-sm font-onyx-regular text-primary-gray-text">Индивидуальный обмен</p>
              </div>
              <div className="space-y-4">
                <div className="pb-4 border-b border-primary-gray-text/20">
                  <p className="text-sm font-onyx-black text-primary-green-light mb-2">
                    Предоставляю:
                  </p>
                  <p className="text-primary-white font-onyx-regular">
                    Уроки английского, практику разговорной речи
                  </p>
                </div>
                <div>
                  <p className="text-sm font-onyx-black text-primary-green-light mb-2">
                    Получаю:
                  </p>
                  <p className="text-primary-white font-onyx-regular">
                    Изучение испанского, помощь с грамматикой
                  </p>
                </div>
              </div>
            </div>

            {/* Здоровье и Фитнес */}
            <div className="p-6 rounded" style={{ backgroundColor: 'rgb(30, 30, 30)' }}>
              <div className="mb-6">
                <h3 className="text-xl font-onyx-black text-primary-white mb-1">Здоровье и Фитнес</h3>
                <p className="text-sm font-onyx-regular text-primary-gray-text">Индивидуальный обмен</p>
              </div>
              <div className="space-y-4">
                <div className="pb-4 border-b border-primary-gray-text/20">
                  <p className="text-sm font-onyx-black text-primary-green-light mb-2">
                    Предоставляю:
                  </p>
                  <p className="text-primary-white font-onyx-regular">
                    Тренировки по йоге, консультации по питанию
                  </p>
                </div>
                <div>
                  <p className="text-sm font-onyx-black text-primary-green-light mb-2">
                    Получаю:
                  </p>
                  <p className="text-primary-white font-onyx-regular">
                    Массаж, консультации психолога
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="container mx-auto px-4 py-16 border-t-2 border-primary-gray-medium scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-onyx-black mb-12 text-center">
            Отзывы пользователей
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded" style={{ backgroundColor: 'rgb(30, 30, 30)' }}>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary-green-light text-primary-green-light" />
                ))}
              </div>
              <p className="text-primary-white font-onyx-regular mb-4">
                "Нашла носителя языка за день. Удобно, что отзывы и рейтинг сразу видны."
              </p>
              <p className="text-sm font-onyx-black text-primary-white">Мария, студентка</p>
            </div>
            <div className="p-6 rounded" style={{ backgroundColor: 'rgb(30, 30, 30)' }}>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary-green-light text-primary-green-light" />
                ))}
              </div>
              <p className="text-primary-white font-onyx-regular mb-4">
                "Обменял настройку CRM на брендбук. Сервис экономит время и деньги."
              </p>
              <p className="text-sm font-onyx-black text-primary-white">Алексей, предприниматель</p>
            </div>
            <div className="p-6 rounded" style={{ backgroundColor: 'rgb(30, 30, 30)' }}>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary-green-light text-primary-green-light" />
                ))}
              </div>
              <p className="text-primary-white font-onyx-regular mb-4">
                "За неделю освоила монтаж, партнер получил советы по питанию. Честный обмен."
              </p>
              <p className="text-sm font-onyx-black text-primary-white">Елена, нутрициолог</p>
            </div>
            <div className="p-6 rounded" style={{ backgroundColor: 'rgb(30, 30, 30)' }}>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary-green-light text-primary-green-light" />
                ))}
              </div>
              <p className="text-primary-white font-onyx-regular mb-4">
                "Поменялся навыками с фотографом: я научил его работать с графикой, он дал мне уроки
                по съемке. Взаимовыгодно!"
              </p>
              <p className="text-sm font-onyx-black text-primary-white">Дмитрий, графический дизайнер</p>
            </div>
            <div className="p-6 rounded" style={{ backgroundColor: 'rgb(30, 30, 30)' }}>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary-green-light text-primary-green-light" />
                ))}
              </div>
              <p className="text-primary-white font-onyx-regular mb-4">
                "Отличная платформа для начинающих! Получил консультации по маркетингу в обмен на
                помощь с настройкой сайта. Все быстро и профессионально."
              </p>
              <p className="text-sm font-onyx-black text-primary-white">Сергей, веб-разработчик</p>
            </div>
            <div className="p-6 rounded" style={{ backgroundColor: 'rgb(30, 30, 30)' }}>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary-green-light text-primary-green-light" />
                ))}
              </div>
              <p className="text-primary-white font-onyx-regular mb-4">
                "Быстро нашел партнера для обмена навыками программирования. Платформа простая и удобная, рекомендую!"
              </p>
              <p className="text-sm font-onyx-black text-primary-white">Игорь, разработчик</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section id="technologies" className="container mx-auto px-4 py-16 border-t-2 border-primary-gray-medium scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-onyx-black mb-12 text-center">
            Инновационные технологии платформы
          </h2>
          <div className="rounded p-8 md:p-12" style={{ backgroundColor: 'rgb(168, 158, 254)' }}>
            <div className="space-y-0">
              {/* Real-time чат */}
              <div className="pb-6 border-b-2 border-primary-black">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-black flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-6 w-6 text-primary-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-onyx-black mb-2 text-primary-black">Real-time чат</h3>
                    <p className="text-primary-black font-onyx-regular">
                      Мгновенные сообщения с использованием Socket.IO, индикаторы печати и статус онлайн в реальном времени
                    </p>
                  </div>
                </div>
              </div>
              
              {/* TypeScript и типобезопасность */}
              <div className="py-6 border-b-2 border-primary-black">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-black flex items-center justify-center flex-shrink-0">
                    <Code className="h-6 w-6 text-primary-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-onyx-black mb-2 text-primary-black">TypeScript строгий режим</h3>
                    <p className="text-primary-black font-onyx-regular">
                      Полная типобезопасность кода, валидация данных с Zod и централизованная обработка ошибок
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Безопасность */}
              <div className="py-6 border-b-2 border-primary-black">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-black flex items-center justify-center flex-shrink-0">
                    <Key className="h-6 w-6 text-primary-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-onyx-black mb-2 text-primary-black">Многоуровневая защита</h3>
                    <p className="text-primary-black font-onyx-regular">
                      CSRF и XSS защита, rate limiting, защита от brute force, безопасное хеширование паролей с bcryptjs
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Next.js App Router */}
              <div className="py-6 border-b-2 border-primary-black">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-black flex items-center justify-center flex-shrink-0">
                    <Globe className="h-6 w-6 text-primary-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-onyx-black mb-2 text-primary-black">Next.js 14+ App Router</h3>
                    <p className="text-primary-black font-onyx-regular">
                      Современная архитектура с Server и Client Components, оптимизация изображений с Sharp, адаптивный дизайн для всех устройств
                    </p>
                  </div>
                </div>
              </div>
              
              {/* PostgreSQL и Prisma */}
              <div className="py-6 border-b-2 border-primary-black">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-black flex items-center justify-center flex-shrink-0">
                    <Database className="h-6 w-6 text-primary-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-onyx-black mb-2 text-primary-black">PostgreSQL и Prisma ORM</h3>
                    <p className="text-primary-black font-onyx-regular">
                      Надежная реляционная база данных с современным ORM для типобезопасных запросов и миграций схемы
                    </p>
                  </div>
                </div>
              </div>
              
              {/* NextAuth.js */}
              <div className="py-6 border-b-2 border-primary-black">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-black flex items-center justify-center flex-shrink-0">
                    <Lock className="h-6 w-6 text-primary-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-onyx-black mb-2 text-primary-black">NextAuth.js v5 (Auth.js)</h3>
                    <p className="text-primary-black font-onyx-regular">
                      Современная система аутентификации с поддержкой сессий, JWT токенов и безопасным управлением доступом
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Оптимизация производительности */}
              <div className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-black flex items-center justify-center flex-shrink-0">
                    <Loader className="h-6 w-6 text-primary-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-onyx-black mb-2 text-primary-black">Оптимизация производительности</h3>
                    <p className="text-primary-black font-onyx-regular">
                      Skeleton Loaders для плавной загрузки, Error Boundaries для обработки ошибок, валидация окружения при старте
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto px-4 py-16 border-t-2 border-primary-gray-medium scroll-mt-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-onyx-black mb-12 text-center">
            Часто задаваемые вопросы
          </h2>
          <Accordion items={faqItems} defaultOpenIndex={0} />
        </div>
      </section>

      {/* Footer */}
      {!isAuthenticated && <Footer />}
    </main>
  )
}
