import { createCookie } from '@remix-run/node'
import { CSRF } from 'remix-utils/csrf/server'

export const CSRF_COOKIE_KEY = '_csrf'

const cookie = createCookie(CSRF_COOKIE_KEY, {
  path: '/',
  sameSite: 'lax',
  httpOnly: true,
  secrets: [process.env.SESSION_SECRET || 'NOT_A_STRONG_SECRET'],
  secure: process.env.NODE_ENV === 'production',
})

export const csrf = new CSRF({ cookie })
