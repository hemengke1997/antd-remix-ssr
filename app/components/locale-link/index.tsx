import { generatePath, Link, type Path } from '@remix-run/react'
import { type RemixLinkProps } from '@remix-run/react/dist/components'
import { isString } from 'lodash-es'
import { memo } from 'react'
import { useLocale } from 'remix-i18next/react'

function generateLocalePath(route: string, locale: string, params: Record<string, string>) {
  route = route.replace(/^\/+/, '')
  return generatePath(`/${locale}/${route}`, { ...params, lang: locale })
}

function LocaleLink(props: RemixLinkProps) {
  const { children, to } = props
  const locale = useLocale()
  let localoTo: Partial<Path>
  if (isString(to)) {
    localoTo = { pathname: to }
  } else {
    localoTo = to
  }
  return (
    <Link {...props} to={generateLocalePath(localoTo.pathname || '', locale, { ...localoTo })}>
      {children}
    </Link>
  )
}

export default memo(LocaleLink)
