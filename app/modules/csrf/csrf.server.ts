import { createCookie } from '@remix-run/node'
import { CSRF } from 'remix-utils/csrf/server'

export const CSRF_COOKIE_KEY = '_csrf'

const cookie = createCookie(CSRF_COOKIE_KEY, {
  path: '/',
  sameSite: 'lax',
  httpOnly: true,
  secrets: ['NOT_A_STRONG_SECRET'], // Replace with your own secret
  secure: !import.meta.env.DEV,
})

export const csrf = new CSRF({ cookie })
