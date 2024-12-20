import { startTransition } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { legacyLogicalPropertiesTransformer, StyleProvider } from '@ant-design/cssinjs'
import { RemixBrowser } from '@remix-run/react'
import i18next from 'i18next'
import { hydrateRoot } from 'react-dom/client'
import { i18nAlly } from 'vite-plugin-i18n-ally/client'
import { i18nOptions } from '@/i18n/i18n'
import { resolveNamespace } from './i18n/namespace.client'

const i18nChangeLanguage = i18next.changeLanguage

async function hydrate() {
  const { asyncLoadResource } = i18nAlly({
    namespaces: [...(await resolveNamespace())],
    fallbackLng: i18nOptions.fallbackLng,
    async onInit({ language }) {
      await i18next.use(initReactI18next).init({
        lng: language,
        resources: {},
        fallbackLng: i18nOptions.fallbackLng,
        keySeparator: i18nOptions.keySeparator,
        nsSeparator: i18nOptions.nsSeparator,
        ns: [...(await resolveNamespace())],
        debug: import.meta.env.DEV,
      })
    },
    onResourceLoaded(resource, { language, namespace }) {
      i18next.addResourceBundle(language, namespace, resource)
    },
    onInited: () => {
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
    },
    detection: [
      {
        detect: 'path',
        lookup: 0,
        cache: false,
      },
      {
        detect: 'htmlTag',
      },
    ],
  })

  i18next.changeLanguage = async (lng?: string, ...args) => {
    await asyncLoadResource(lng || i18next.language, {
      namespaces: [...(await resolveNamespace())],
    })
    return i18nChangeLanguage(lng, ...args)
  }

  window.asyncLoadResource = asyncLoadResource
}

hydrate()
