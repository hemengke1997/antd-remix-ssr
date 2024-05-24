import { overrideConfig } from '@minko-fe/vite-config'
import { vitePlugin as remix } from '@remix-run/dev'
import { remixDevTools } from 'remix-development-tools'
import { defineConfig } from 'vite'
import { istanbulWidget } from 'vite-plugin-istanbul-widget'

export default defineConfig((env) => {
  return overrideConfig(env, {
    plugins: [
      remixDevTools(),
      remix({
        ignoredRouteFiles: ['**/*.css'],
      }),
      istanbulWidget({
        enabled: true,
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
              autoReport: false,
              onLeavePage: true,
              requireReporter: true,
            },
          },
        },
        fullReport: true,
      }),
    ],
  })
})
