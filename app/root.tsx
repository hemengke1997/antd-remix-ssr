import { useTranslation } from 'react-i18next'
import { type LinksFunction, type LoaderFunctionArgs, type MetaFunction, redirect } from '@remix-run/node'
import { json, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react'
import { isBrowser } from 'browser-or-node'
import { useChangeLanguage } from 'remix-i18next/react'
import { Theme, ThemeProvider, useTheme } from 'remix-themes'
import { AuthenticityTokenProvider } from 'remix-utils/csrf/react'
import { ExternalScripts } from 'remix-utils/external-scripts'
import { resources } from 'virtual:i18n-ally-async-resource'
import { manifest } from 'virtual:public-typescript-manifest'
import AntdConfigProvider from './components/antd-config-provider'
import { ErrorBoundaryComponent } from './components/error-boundary'
import globalCss from './css/global.css?url'
import { useChangeI18n } from './hooks/use-change-i18n'
import { i18nOptions } from './i18n/i18n'
import { i18nServer, localeCookie } from './i18n/i18n.server'
import { csrf } from './modules/csrf/csrf.server'
import { combineHeaders } from './modules/server/index.server'
import { themeSessionResolver } from './modules/session/session.server'
import { siteConfig } from './utils/constants/site'
import { isDev } from './utils/env'

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

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request)

  const locale = Object.keys(resources)
    .filter((key) => !key.includes('/'))
    .includes(params.lang!)
    ? params.lang!
    : await i18nServer.getLocale(request)

  if (!params.lang) {
    let pathWithSearch = ''

    const url = new URL(request.url)
    if (url.pathname === '/') {
      pathWithSearch = `/${locale}${url.search}`
    } else {
      pathWithSearch = `/${locale}${url.pathname}${url.search}`
    }
    throw redirect(pathWithSearch)
  }
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

        {!isBrowser && !isDev() && '__ANTD_STYLE__'}
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
