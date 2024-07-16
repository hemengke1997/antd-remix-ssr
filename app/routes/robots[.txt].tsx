import { generateRobotsTxt } from '@/modules/robots/robots.server'

export function loader() {
  return generateRobotsTxt([{ type: 'sitemap', value: `${process.env.HOST_URL}/sitemap.xml` }])
}
