import { useUpdateEffect } from '@minko-fe/react-hook'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

function changeLanguageInUrl(url: string, lang: string) {
  const urlObj = new URL(url)

  const pathSegments = urlObj.pathname.split('/')

  // 假设语言标识总是在第一位
  if (pathSegments[1]) {
    pathSegments[1] = lang
  }

  urlObj.pathname = pathSegments.join('/')
  return urlObj.toString()
}

export function useChangeI18n() {
  const { i18n } = useTranslation()
  const lang = i18n.language

  useEffect(() => {
    // update html tag
    document.querySelector('html')?.setAttribute('lang', lang)
    // update url segments
    const newUrl = changeLanguageInUrl(window.location.href, lang)
    window.history.replaceState({ path: newUrl }, '', newUrl)
  }, [i18n.language])

  useUpdateEffect(() => {
    fetch('/action/set-locale', {
      method: 'POST',
      body: JSON.stringify({ locale: lang }),
    })
  }, [i18n.language])
}
