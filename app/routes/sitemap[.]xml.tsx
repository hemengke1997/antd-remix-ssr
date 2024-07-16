import type { LoaderFunctionArgs } from '@remix-run/node'
import { generateSitemap } from '@/modules/sitemap/sitemap.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const build = await (import.meta.env.DEV
    ? // @ts-ignore
      import('../../dist/server/index.js')
    : import(
        /* @vite-ignore */
        import.meta.resolve('../../dist/server/index.js')
      ))

  return generateSitemap(request, build.routes, {
    siteUrl: process.env.HOST_URL || '',
  })
}
