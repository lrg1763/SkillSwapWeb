'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { registerSchema, type RegisterInput } from '@/lib/validations'
import { Loader2 } from 'lucide-react'

export default function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFieldError,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7252/ingest/04941659-eed6-4b7f-aa82-90dc2d91e403',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RegisterForm.tsx:24',message:'Form submission started',data:{username:data.username,passwordLength:data.password.length,confirmPasswordLength:data.confirmPassword.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      setError(null)
      setIsLoading(true)

      // #region agent log
      fetch('http://127.0.0.1:7252/ingest/04941659-eed6-4b7f-aa82-90dc2d91e403',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RegisterForm.tsx:29',message:'Fetch request initiated',data:{url:'/api/auth/register',method:'POST'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
      // #endregion
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      })

      // #region agent log
      console.error('[CLIENT DEBUG] Response received:', {status:response.status,statusText:response.statusText,ok:response.ok})
      fetch('http://127.0.0.1:7252/ingest/04941659-eed6-4b7f-aa82-90dc2d91e403',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RegisterForm.tsx:41',message:'Response received',data:{status:response.status,statusText:response.statusText,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      const result = await response.json()

      // #region agent log
      console.error('[CLIENT DEBUG] Response parsed:', {hasError:!!result.error,hasDetails:!!result.details,error:result.error,detailsCount:result.details?.length,fullResult:result})
      fetch('http://127.0.0.1:7252/ingest/04941659-eed6-4b7f-aa82-90dc2d91e403',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RegisterForm.tsx:43',message:'Response parsed',data:{hasError:!!result.error,hasDetails:!!result.details,error:result.error,detailsCount:result.details?.length,fullResult:result},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion

      if (!response.ok) {
        // #region agent log
        fetch('http://127.0.0.1:7252/ingest/04941659-eed6-4b7f-aa82-90dc2d91e403',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RegisterForm.tsx:44',message:'Response not OK - handling error',data:{status:response.status,error:result.error,hasDetails:!!result.details},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        if (result.details) {
          // Ошибки валидации Zod
          // #region agent log
          fetch('http://127.0.0.1:7252/ingest/04941659-eed6-4b7f-aa82-90dc2d91e403',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RegisterForm.tsx:46',message:'Zod validation errors detected',data:{detailsCount:result.details.length,details:result.details},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          result.details.forEach((err: any) => {
            if (err.path) {
              setFieldError(err.path[0] as keyof RegisterInput, {
                message: err.message,
              })
            }
          })
        } else {
          // #region agent log
          fetch('http://127.0.0.1:7252/ingest/04941659-eed6-4b7f-aa82-90dc2d91e403',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RegisterForm.tsx:54',message:'Setting generic error message',data:{error:result.error},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
          // #endregion
          setError(result.error || 'Произошла ошибка при регистрации')
        }
        setIsLoading(false)
        return
      }

      // Успешная регистрация - редирект на страницу входа
      // #region agent log
      fetch('http://127.0.0.1:7252/ingest/04941659-eed6-4b7f-aa82-90dc2d91e403',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RegisterForm.tsx:61',message:'Registration successful - redirecting',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:''})}).catch(()=>{});
      // #endregion
      router.push('/login?registered=true')
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7252/ingest/04941659-eed6-4b7f-aa82-90dc2d91e403',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RegisterForm.tsx:63',message:'Exception caught in onSubmit',data:{errorType:err instanceof Error ? err.constructor.name : typeof err,errorMessage:err instanceof Error ? err.message : String(err)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
      // #endregion
      console.error('Register error:', err)
      setError('Произошла ошибка при регистрации')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-onyx-black mb-2 text-primary-black"
        >
          Имя пользователя
        </label>
        <input
          {...register('username')}
          type="text"
          id="username"
          className="w-full px-4 py-3 border-2 border-primary-black rounded-lg bg-primary-white text-primary-black font-onyx-regular focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:border-transparent"
          placeholder="Введите имя пользователя"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-onyx-black mb-2 text-primary-black"
        >
          Пароль
        </label>
        <input
          {...register('password')}
          type="password"
          id="password"
          className="w-full px-4 py-3 border-2 border-primary-black rounded-lg bg-primary-white text-primary-black font-onyx-regular focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:border-transparent"
          placeholder="Введите пароль (минимум 6 символов)"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-onyx-black mb-2 text-primary-black"
        >
          Подтвердите пароль
        </label>
        <input
          {...register('confirmPassword')}
          type="password"
          id="confirmPassword"
          className="w-full px-4 py-3 border-2 border-primary-black rounded-lg bg-primary-white text-primary-black font-onyx-regular focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:border-transparent"
          placeholder="Повторите пароль"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-sm text-red-800 font-onyx-regular">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-primary-black text-primary-white font-onyx-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Регистрация...
          </>
        ) : (
          'Зарегистрироваться'
        )}
      </button>

      <p className="text-center text-sm text-primary-gray-text font-onyx-regular">
        Уже есть аккаунт?{' '}
        <a
          href="/login"
          className="text-primary-black font-onyx-black hover:underline"
        >
          Войти
        </a>
      </p>
    </form>
  )
}
