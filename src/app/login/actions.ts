'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { checkPassword, sessionToken, SESSION_COOKIE } from '@/lib/auth'

export async function login(formData: FormData) {
  const password = String(formData.get('password') ?? '')

  if (!checkPassword(password)) {
    redirect('/login?error=1')
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })

  redirect('/dashboard')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect('/login')
}
