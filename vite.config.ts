import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { flatRoutes } from 'remix-flat-routes'
import { defineConfig } from 'vite'
import { preset } from 'vite-config-preset'
import { envOnlyMacros } from 'vite-env-only'
import { i18nAlly } from 'vite-plugin-i18n-ally'
import { publicTypescript } from 'vite-plugin-public-typescript'
import { remixFlatRoutes } from 'vite-plugin-remix-flat-routes'

installGlobals()

export default defineConfig((env) => {
  const ignoredRouteFiles = ['**/components/**', '**/hooks/**', '**/images/**', '**/utils/**', '**/*.css']
  return preset(
    {
      env,
      plugins: [
        i18nAlly(),
        envOnlyMacros(),
        remix({
          buildDirectory: 'dist',
          routes: async (defineRoutes) => {
            return flatRoutes('routes', defineRoutes, {
              ignoredRouteFiles,
            })
          },
        }),
        remixFlatRoutes({
          flatRoutesOptions: {
            ignoredRouteFiles,
          },
          handleAsync: true,
        }),
        publicTypescript({
          outputDir: 'assets/js',
        }),
      ],
    },
    {
      react: false,
    },
  )
})
