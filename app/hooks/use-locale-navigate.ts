import { useNavigate } from '@remix-run/react'
import { type RouterNavigateOptions, type To } from '@remix-run/router'
import { useMemoizedFn } from 'ahooks'
import { useLocale } from 'remix-i18next/react'

interface LocaleNavigateFunction {
  (to: To, options?: RouterNavigateOptions): void
}

export default function useLocaleNavigate() {
  const navigate = useNavigate()
  const locale = useLocale()
  const navigateWithLocale: LocaleNavigateFunction = useMemoizedFn((to, options) => {
    if (typeof to === 'string') {
      if (to.startsWith('/')) {
        to = to.slice(1)
      }
      navigate(`/${locale}/${to}`, options)
    } else {
      if (to.pathname?.startsWith('/')) {
        to.pathname = to.pathname.slice(1)
      }
      navigate({ ...to, pathname: `/${locale}/${to.pathname}` }, options)
    }
  })

  return navigateWithLocale
}
