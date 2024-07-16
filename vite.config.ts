import { enhanceViteConfig } from '@minko-fe/vite-config'
import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { vercelPreset } from '@vercel/remix/vite'
import { flatRoutes } from 'remix-flat-routes'
import { defineConfig } from 'vite'
import { istanbulWidget } from 'vite-plugin-istanbul-widget/remix'
import json5 from 'vite-plugin-json5'
import { publicTypescript } from 'vite-plugin-public-typescript'

installGlobals()

export default defineConfig((env) => {
  return enhanceViteConfig({
    env,
    plugins: [
      remix({
        buildDirectory: 'dist',
        routes: async (defineRoutes) => {
          return flatRoutes('routes', defineRoutes)
        },
        presets: !process.env.IN_DOCKER ? [vercelPreset()] : [],
      }),
      json5(),
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
        destination: 'file',
        outputDir: 'assets/js',
        babel: true,
        cacheDir: 'public-typescript',
      }),
    ],
  })
})
