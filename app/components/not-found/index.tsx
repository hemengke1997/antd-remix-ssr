import { useNavigate } from '@remix-run/react'
import { useIsomorphicLayoutEffect } from 'ahooks'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const lang = i18n.language
  useIsomorphicLayoutEffect(() => {
    navigate(`/${lang}`, { replace: true })
    console.log('not found')
  }, [])

  return null
}
