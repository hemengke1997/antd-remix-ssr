import { type Cookie, createCookie } from '@remix-run/node'
import { RemixI18Next } from 'remix-i18next/server'
import { i18nOptions } from '@/i18n/i18n'
import { LOCALE_COOKIE_NAME } from '@/utils/constants/storage'

export const localeCookie = createCookie(LOCALE_COOKIE_NAME, {
  path: '/',
  sameSite: 'lax',
  secure: false,
  httpOnly: true,
})

export function createLocaleCookieResolver(localeCookie: Cookie) {
  const resolver = async (request: Request) => {
    const cookie = await localeCookie.parse(request.headers.get('Cookie'))

    return {
      getLocale: async () => {
        return cookie || i18nOptions.fallbackLng
      },
      setLocale: async (locale: string) => {
        return {
          'Set-Cookie': await localeCookie.serialize(locale),
        }
      },
    }
  }
  return resolver
}

export const i18nServer = new RemixI18Next({
  detection: {
    supportedLanguages: i18nOptions.supportedLngs,
    fallbackLanguage: i18nOptions.fallbackLng,
    cookie: localeCookie,
  },
  i18next: {
    ...i18nOptions,
  },
})
