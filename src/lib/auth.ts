import { createHash, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'bf_session'

// Stateless session token: a hash of the admin password + a server secret.
// No session store needed, and it survives server restarts/redeploys.
function expectedToken() {
  const password = process.env.ADMIN_PASSWORD ?? ''
  const secret = process.env.SESSION_SECRET ?? ''
  return createHash('sha256').update(`${secret}:${password}`).digest('hex')
}

export function checkPassword(candidate: string) {
  return candidate === (process.env.ADMIN_PASSWORD ?? '')
}

export function sessionToken() {
  return expectedToken()
}

export async function isAuthenticated() {
  const cookieStore = await cookies()
  const value = cookieStore.get(SESSION_COOKIE)?.value
  if (!value) return false

  const expected = expectedToken()
  const a = Buffer.from(value)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}
