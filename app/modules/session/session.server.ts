import { createCookieSessionStorage } from '@remix-run/node'
import { createThemeSessionResolver } from 'remix-themes'
import { THEME_SESSION_NAME } from '@/utils/constants/storage'

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: THEME_SESSION_NAME,
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET || 'NOT_A_STRONG_SECRET'],
    secure: process.env.NODE_ENV === 'production',
  },
})

export const { getSession, commitSession, destroySession } = sessionStorage

export const themeSessionResolver = createThemeSessionResolver(sessionStorage)
