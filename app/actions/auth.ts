'use server'

import { redirect } from 'next/navigation'
import { login, register } from '@/src/lib/auth'
import { cookies } from 'next/headers'

/**
 * 注册 Action
 */
export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nickname = formData.get('nickname') as string

  const result = await register(email, password, nickname)

  if (!result.success) {
    return {
      success: false,
      error: result.error,
    }
  }

  // 设置 cookie
  const cookieStore = await cookies()
  cookieStore.set('auth-token', result.token!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 天
    path: '/',
  })

  redirect('/profile')
}

/**
 * 登录 Action
 */
export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const result = await login(email, password)

  if (!result.success) {
    return {
      success: false,
      error: result.error,
    }
  }

  // 设置 cookie
  const cookieStore = await cookies()
  cookieStore.set('auth-token', result.token!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 天
    path: '/',
  })

  redirect('/profile')
}

/**
 * 登出 Action
 */
export async function logoutAction() {
  const { logout } = await import('@/lib/auth')

  await logout()

  redirect('/')
}
