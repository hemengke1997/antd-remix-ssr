// Taken from vite-plugin-i18n-ally/resolver.ts

import { resources } from 'virtual:i18n-ally-async-resource'
import { config } from 'virtual:i18n-ally-config'

export const separator = '__'

export function getLanguages() {
  if (config.namespace) {
    return Array.from(
      new Set(
        Object.keys(resources)
          .filter((key) => key.includes(separator))
          .map((key) => key.split(separator)[0]),
      ),
    )
  }
  return Array.from(new Set(Object.keys(resources).filter((key) => !key.includes(separator))))
}
