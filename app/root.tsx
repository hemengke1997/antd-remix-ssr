import { useTranslation } from 'react-i18next'
import { type LinksFunction, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import {
  type ClientLoaderFunction,
  json,
  Links,
  Meta,
  Outlet,
  type Params,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import { redirect } from '@remix-run/router'
import { isBrowser } from 'browser-or-node'
import i18next from 'i18next'
import { useChangeLanguage } from 'remix-i18next/react'
import { Theme, ThemeProvider, useTheme } from 'remix-themes'
import { AuthenticityTokenProvider } from 'remix-utils/csrf/react'
import { ExternalScripts } from 'remix-utils/external-scripts'
import { manifest } from 'virtual:public-typescript-manifest'
import AntdConfigProvider from './components/antd-config-provider'
import { ErrorBoundaryComponent } from './components/error-boundary'
import globalCss from './css/global.css?url'
import { i18nOptions } from './i18n/i18n'
import { i18nServer, localeCookie } from './i18n/i18n.server'
import { resolveNamespace } from './i18n/namespace.client'
import { getLanguages } from './i18n/resolver'
import { useChangeI18n } from './i18n/use-change-i18n'
import { csrf } from './modules/csrf/csrf.server'
import { combineHeaders } from './modules/server/index.server'
import { themeSessionResolver } from './modules/session/session.server'
import { siteConfig } from './utils/constants/site'

export const meta: MetaFunction<typeof loader> = () => {
  return [
    { title: siteConfig.title },
    {
      name: 'description',
      content: siteConfig.description,
    },
    {
      name: 'keyword',
      content: siteConfig.keyword,
    },
  ]
}

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: globalCss },
    {
      rel: 'icon',
      href: siteConfig.favicon,
      type: 'image/x-icon',
    },
  ]
}

function redirectLang(
  request: Request,
  params: Params<string>,
  options: {
    fallbackLng: string
  },
) {
  const locale = getLanguages().includes(params.lang!) ? params.lang : options.fallbackLng

  if (!params.lang || params.lang !== locale) {
    const url = new URL(request.url)
    if (url.pathname === '/') {
      url.pathname = `/${locale}`
    } else {
      url.pathname = `/${locale}${url.pathname}`
    }
    throw redirect(url.toString())
  }

  return { locale }
}

export const shouldRevalidate = () => {
  return true
}

export const clientLoader: ClientLoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url)
  if (url) {
    await window.asyncLoadResource?.(i18next.language, {
      namespaces: [...(await resolveNamespace(url.pathname))],
    })
  }

  redirectLang(request, params, {
    fallbackLng: i18next.language,
  })

  return {}
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request)

  // locale
  const { locale } = redirectLang(request, params, {
    fallbackLng: await i18nServer.getLocale(request),
  })

  const [csrfToken, csrfCookieHeader] = await csrf.commitToken()

  return json(
    { locale, csrfToken, theme: getTheme() || Theme.LIGHT },
    {
      headers: combineHeaders(
        { 'Set-Cookie': await localeCookie.serialize(locale) },
        csrfCookieHeader ? { 'Set-Cookie': csrfCookieHeader } : null,
      ),
    },
  )
}

function Document({
  children,
  lang = i18nOptions.fallbackLng,
  dir = 'ltr',
}: {
  children: React.ReactNode
  lang?: string
  dir?: 'ltr' | 'rtl'
}) {
  const [theme] = useTheme()
  return (
    <html lang={lang} dir={dir} data-theme={theme} suppressHydrationWarning>
      <head>
        <meta charSet='utf-8' />
        <meta
          name='viewport'
          content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=0'
        />
        <meta name='renderer' content='webkit' />

        {/* https://github.com/remix-run/remix/issues/9242 */}
        <Meta />
        <Links />

        {<script src={manifest.flexible} />}

        {!isBrowser && '__ANTD_STYLE__'}
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <ExternalScripts />
      </body>
    </html>
  )
}

function WithTheme(props: { children: React.ReactNode; specifiedTheme: Theme | null; themeAction?: string }) {
  const { themeAction = '/action/set-theme', ...rest } = props
  return <ThemeProvider themeAction={themeAction} {...rest}></ThemeProvider>
}

export default function App() {
  const { locale, csrfToken, theme } = useLoaderData<typeof loader>()
  const { i18n } = useTranslation()
  useChangeLanguage(locale)
  useChangeI18n()

  return (
    <WithTheme specifiedTheme={theme}>
      <Document lang={locale ?? i18nOptions.fallbackLng} dir={i18n.dir()}>
        <AuthenticityTokenProvider token={csrfToken}>
          <AntdConfigProvider>
            <Outlet />
          </AntdConfigProvider>
        </AuthenticityTokenProvider>
      </Document>
    </WithTheme>
  )
}

export function ErrorBoundary() {
  return <ErrorBoundaryComponent />
}
