import type { EntryContext } from '@remix-run/node'
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs'
import { createReadableStreamFromReadable } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import { createInstance } from 'i18next'
import { isbot } from 'isbot'
import { PassThrough } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { i18nOptions } from '@/i18n/i18n'
import { i18nServer } from '@/i18n/i18n.server'

const ABORT_DELAY = 5000

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const callbackName = isbot(request.headers.get('user-agent')) ? 'onAllReady' : 'onShellReady'

  const i18nInstance = createInstance()
  const lng = await i18nServer.getLocale(request)
  const ns = i18nServer.getRouteNamespaces(remixContext)

  await i18nInstance.use(initReactI18next).init({
    ...i18nOptions,
    lng,
    ns: [...ns, ...i18nOptions.defaultNS],
  })

  return new Promise((resolve, reject) => {
    let shellRendered = false
    let isStyleExtracted = false
    const cache = createCache()
    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={i18nInstance} defaultNS={i18nOptions.defaultNS}>
        <StyleProvider cache={cache}>
          <RemixServer context={remixContext} url={request.url}></RemixServer>
        </StyleProvider>
      </I18nextProvider>,
      {
        [callbackName]: () => {
          shellRendered = true
          const body = new PassThrough({
            transform(chunk, _, callback) {
              const styleText = extractStyle(cache)
              if (!isStyleExtracted) {
                const str: string = chunk.toString()
                if (str.includes('__ANTD_STYLE__')) {
                  chunk = str.replace('__ANTD_STYLE__', styleText)
                  isStyleExtracted = true
                }
              }
              callback(null, chunk)
            },
          })
          const stream = createReadableStreamFromReadable(body)
          responseHeaders.set('Content-Type', 'text/html')
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          )
          pipe(body)
        },
        onShellError(error) {
          reject(error)
        },
        onError(error) {
          if (shellRendered) {
            console.error(error)
          }
        },
      },
    )

    setTimeout(abort, ABORT_DELAY)
  })
}
