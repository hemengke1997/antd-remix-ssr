import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { flatRoutes } from 'remix-flat-routes'
import { defineConfig } from 'vite'
import { preset } from 'vite-config-preset'
import { istanbulWidget } from 'vite-plugin-istanbul-widget/remix'
import { publicTypescript } from 'vite-plugin-public-typescript'

installGlobals()

export default defineConfig((env) => {
  return preset(
    {
      env,
      plugins: [
        remix({
          buildDirectory: 'dist',
          routes: async (defineRoutes) => {
            return flatRoutes('routes', defineRoutes, {
              ignoredRouteFiles: ['**/components/**', '**/hooks/**', '**/images/**', '**/utils/**', '**/*.css'],
            })
          },
        }),
        istanbulWidget({
          enabled: env.mode === 'test',
          istanbulWidgetConfig: {
            defaultPosition: {
              x: 0,
              y: 100,
            },
            plugin: {
              report: {
                async onReport(coverage, ...args) {
                  console.log(coverage, ...args)
                },
              },
              setting: {
                onLeavePage: true,
                requireReporter: false,
              },
            },
          },
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
