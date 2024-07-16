import { StyleProvider, legacyLogicalPropertiesTransformer } from '@ant-design/cssinjs'
import { RemixBrowser } from '@remix-run/react'
import i18next from 'i18next'
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'
import { startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { getInitialNamespaces } from 'remix-i18next/client'
import { i18nOptions } from '@/i18n/i18n'

async function hydrate() {
  await i18next
    .use(initReactI18next)
    .use(I18nextBrowserLanguageDetector)
    .init({
      ...i18nOptions,
      ns: [...getInitialNamespaces(), i18nOptions.defaultNS],
      detection: {
        order: ['htmlTag'],
        caches: [],
      },
    })

  startTransition(() => {
    hydrateRoot(
      document,
      <>
        <I18nextProvider i18n={i18next} defaultNS={i18nOptions.defaultNS}>
          <StyleProvider transformers={[legacyLogicalPropertiesTransformer]}>
            <RemixBrowser />
          </StyleProvider>
        </I18nextProvider>
      </>,
    )
  })
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate)
} else {
  window.setTimeout(hydrate, 1)
}
