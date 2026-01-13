'use client'

import { Component, ReactNode } from 'react'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Логирование ошибки в production
    if (process.env.NODE_ENV === 'production') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
      // Здесь можно отправить ошибку в Sentry или другой сервис мониторинга
    } else {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-primary-white flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-onyx-black mb-2">Что-то пошло не так</h1>
              <p className="text-primary-gray-text font-onyx-regular mb-4">
                Произошла непредвиденная ошибка. Пожалуйста, попробуйте обновить страницу.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                  <p className="text-sm font-mono text-red-800">
                    {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <pre className="mt-2 text-xs text-red-600 overflow-auto max-h-40">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-primary-black text-primary-white font-onyx-black rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Попробовать снова
              </button>
              <Link
                href="/"
                className="px-6 py-3 border-2 border-primary-black text-primary-black font-onyx-black rounded-lg hover:bg-primary-gray-light transition-colors flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                На главную
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
