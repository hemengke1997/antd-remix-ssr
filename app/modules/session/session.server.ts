import { createCookieSessionStorage } from '@remix-run/node'
import { createThemeSessionResolver } from 'remix-themes'
import { THEME_SESSION_NAME } from '@/utils/constants/storage'

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: THEME_SESSION_NAME,
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: ['NOT_A_STRONG_SECRET'], // Replace with your own secret
    secure: !import.meta.env.DEV,
  },
})

export const { getSession, commitSession, destroySession } = sessionStorage

export const themeSessionResolver = createThemeSessionResolver(sessionStorage)
