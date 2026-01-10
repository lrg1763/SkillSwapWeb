'use client'

import Link from 'next/link'
import Accordion from '@/components/ui/Accordion'
import { Star, Sparkles, Shield, Zap } from 'lucide-react'

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
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-onyx-black mb-6">
            Добро пожаловать в SkillSwap!
          </h1>
          {!isAuthenticated && (
            <p className="text-lg md:text-xl text-primary-gray-text mb-8 max-w-2xl mx-auto">
              <strong>SkillSwap</strong> — это инновационная P2P-платформа для бартерного обмена
              навыками и услугами. Предлагайте свои умения, находите нужных специалистов и
              обменивайтесь опытом без денег!
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {isAuthenticated ? (
              <>
                <Link
                  href="/search"
                  className="px-8 py-4 bg-primary-black text-primary-white font-onyx-black rounded-lg hover:opacity-90 transition-opacity text-lg"
                >
                  Найти обмен
                </Link>
                <Link
                  href="/profile"
                  className="px-8 py-4 border-2 border-primary-black text-primary-black font-onyx-black rounded-lg hover:bg-primary-gray-light transition-colors text-lg"
                >
                  Мой профиль
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="px-8 py-4 bg-primary-black text-primary-white font-onyx-black rounded-lg hover:opacity-90 transition-opacity text-lg"
                >
                  Регистрация
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 border-2 border-primary-black text-primary-black font-onyx-black rounded-lg hover:bg-primary-gray-light transition-colors text-lg"
                >
                  Вход
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid - только для неавторизованных */}
      {!isAuthenticated && (
        <section className="container mx-auto px-4 py-16 border-t-2 border-primary-gray-medium">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-onyx-black mb-3">Регистрация</h3>
                <p className="text-primary-gray-text font-onyx-regular">
                  Создайте профиль, укажите свои навыки и потребности
                </p>
              </div>
              <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-onyx-black mb-3">Поиск</h3>
                <p className="text-primary-gray-text font-onyx-regular">
                  Найдите людей с нужными вам навыками
                </p>
              </div>
              <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-onyx-black mb-3">Общение</h3>
                <p className="text-primary-gray-text font-onyx-regular">
                  Договаривайтесь об обмене в удобном чате
                </p>
              </div>
              <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-onyx-black mb-3">Отзывы</h3>
                <p className="text-primary-gray-text font-onyx-regular">
                  Оценивайте партнеров и стройте репутацию
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Advantages Section */}
      <section className="container mx-auto px-4 py-16 border-t-2 border-primary-gray-medium">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-onyx-black mb-12 text-center">
            Преимущества нашей платформы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white hover:shadow-lg transition-shadow">
              <div className="text-primary-green-light mb-4 text-3xl">💰</div>
              <h3 className="text-xl font-onyx-black mb-3">Без оплат</h3>
              <p className="text-primary-gray-text font-onyx-regular">
                Обмен навыками без бюджета: вы помогаете — вам помогают.
              </p>
            </div>
            <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white hover:shadow-lg transition-shadow">
              <div className="text-primary-green-light mb-4 text-3xl">⚡</div>
              <h3 className="text-xl font-onyx-black mb-3">Быстро</h3>
              <p className="text-primary-gray-text font-onyx-regular">
                Регистрация за минуту и первые совпадения в тот же день.
              </p>
            </div>
            <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white hover:shadow-lg transition-shadow">
              <div className="text-primary-green-light mb-4 text-3xl">🔒</div>
              <h3 className="text-xl font-onyx-black mb-3">Надёжно</h3>
              <p className="text-primary-gray-text font-onyx-regular">
                Рейтинги, отзывы и статус онлайн помогают выбрать партнера.
              </p>
            </div>
            <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white hover:shadow-lg transition-shadow">
              <div className="text-primary-green-light mb-4 text-3xl">🎯</div>
              <h3 className="text-xl font-onyx-black mb-3">Удобно</h3>
              <p className="text-primary-gray-text font-onyx-regular">
                Чат, уведомления, избранное и блокировки — всё на месте.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="container mx-auto px-4 py-16 border-t-2 border-primary-gray-medium">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-onyx-black mb-12 text-center">
            Примеры сценариев обмена
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-onyx-black mb-4">Разработка сайтов</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-onyx-black text-primary-green-light mb-1">
                    Предоставляю:
                  </p>
                  <p className="text-primary-gray-text font-onyx-regular">
                    Вёрстку HTML/CSS, адаптивный дизайн
                  </p>
                </div>
                <div>
                  <p className="text-sm font-onyx-black text-primary-green-light mb-1">
                    Получаю:
                  </p>
                  <p className="text-primary-gray-text font-onyx-regular">
                    Backend на Python, настройку сервера
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-onyx-black mb-4">Дизайн и Маркетинг</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-onyx-black text-primary-green-light mb-1">
                    Предоставляю:
                  </p>
                  <p className="text-primary-gray-text font-onyx-regular">
                    Графический дизайн, брендинг, иллюстрации
                  </p>
                </div>
                <div>
                  <p className="text-sm font-onyx-black text-primary-green-light mb-1">
                    Получаю:
                  </p>
                  <p className="text-primary-gray-text font-onyx-regular">
                    SEO оптимизацию, SMM продвижение
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-onyx-black mb-4">Изучение языков</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-onyx-black text-primary-green-light mb-1">
                    Предоставляю:
                  </p>
                  <p className="text-primary-gray-text font-onyx-regular">
                    Уроки английского, практику разговорной речи
                  </p>
                </div>
                <div>
                  <p className="text-sm font-onyx-black text-primary-green-light mb-1">
                    Получаю:
                  </p>
                  <p className="text-primary-gray-text font-onyx-regular">
                    Изучение испанского, помощь с грамматикой
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-onyx-black mb-4">Здоровье и Фитнес</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-onyx-black text-primary-green-light mb-1">
                    Предоставляю:
                  </p>
                  <p className="text-primary-gray-text font-onyx-regular">
                    Тренировки по йоге, консультации по питанию
                  </p>
                </div>
                <div>
                  <p className="text-sm font-onyx-black text-primary-green-light mb-1">
                    Получаю:
                  </p>
                  <p className="text-primary-gray-text font-onyx-regular">
                    Массаж, консультации психолога
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="container mx-auto px-4 py-16 border-t-2 border-primary-gray-medium">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-onyx-black mb-12 text-center">
            Отзывы пользователей
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-primary-gray-text font-onyx-regular mb-4 italic">
                "Нашла носителя языка за день. Удобно, что отзывы и рейтинг сразу видны."
              </p>
              <p className="text-sm font-onyx-black">Мария, студентка</p>
            </div>
            <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-primary-gray-text font-onyx-regular mb-4 italic">
                "Обменял настройку CRM на брендбук. Сервис экономит время и деньги."
              </p>
              <p className="text-sm font-onyx-black">Алексей, предприниматель</p>
            </div>
            <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-primary-gray-text font-onyx-regular mb-4 italic">
                "За неделю освоила монтаж, партнер получил советы по питанию. Честный обмен."
              </p>
              <p className="text-sm font-onyx-black">Елена, нутрициолог</p>
            </div>
            <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-primary-gray-text font-onyx-regular mb-4 italic">
                "Поменялся навыками с фотографом: я научил его работать с графикой, он дал мне уроки
                по съемке. Взаимовыгодно!"
              </p>
              <p className="text-sm font-onyx-black">Дмитрий, графический дизайнер</p>
            </div>
            <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-primary-gray-text font-onyx-regular mb-4 italic">
                "Отличная платформа для начинающих! Получил консультации по маркетингу в обмен на
                помощь с настройкой сайта. Все быстро и профессионально."
              </p>
              <p className="text-sm font-onyx-black">Сергей, веб-разработчик</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="container mx-auto px-4 py-16 border-t-2 border-primary-gray-medium">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-onyx-black mb-12 text-center">
            Инновационные технологии платформы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <Sparkles className="h-8 w-8 text-primary-green-light" />
              </div>
              <h3 className="text-xl font-onyx-black mb-3">ИИ-рекомендации</h3>
              <p className="text-primary-gray-text font-onyx-regular">
                Умный алгоритм подбирает идеальных партнеров по навыкам и совместимости
              </p>
            </div>
            <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <Zap className="h-8 w-8 text-primary-green-light" />
              </div>
              <h3 className="text-xl font-onyx-black mb-3">Адаптивность</h3>
              <p className="text-primary-gray-text font-onyx-regular">
                Оптимизировано для всех устройств: смартфоны, планшеты, ноутбуки, десктопы
              </p>
            </div>
            <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <Shield className="h-8 w-8 text-primary-green-light" />
              </div>
              <h3 className="text-xl font-onyx-black mb-3">Безопасность</h3>
              <p className="text-primary-gray-text font-onyx-regular">
                SSL-шифрование, защита данных и верификация пользователей
              </p>
            </div>
            <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <Zap className="h-8 w-8 text-primary-green-light" />
              </div>
              <h3 className="text-xl font-onyx-black mb-3">Real-time чат</h3>
              <p className="text-primary-gray-text font-onyx-regular">
                Мгновенные сообщения с индикаторами печати и статусом онлайн
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16 border-t-2 border-primary-gray-medium">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-onyx-black mb-12 text-center">
            Часто задаваемые вопросы
          </h2>
          <Accordion items={faqItems} defaultOpenIndex={0} />
        </div>
      </section>
    </main>
  )
}
