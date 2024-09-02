const resourceMap = import.meta.glob('./locales/*.json5', {
  eager: true,
  import: 'default',
}) as Record<string, { [key: string]: string }>

const locales = Object.keys(resourceMap).map((key) => {
  const locale = key.replace(/^\.\/locales\//g, '').replace(/\.json5$/, '')
  return {
    locale,
    translation: {
      ...resourceMap[key],
    },
  }
})

const fallbackLng = 'en'
const defaultNS = ['common']
const supportedLngs = locales.map(({ locale }) => locale)
const resources = locales.reduce(
  (acc, { locale, translation }) => {
    acc[locale] = translation
    return acc
  },
  {} as Record<string, { [ns: string]: string }>,
)

export const i18nOptions = {
  resources,
  fallbackLng,
  supportedLngs,
  defaultNS,
  nsSeparator: '.',
  keySeparator: '.',
}
