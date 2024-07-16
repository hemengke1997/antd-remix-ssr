import { getRobotsText } from './robots-utils'
import { type RobotsConfig, type RobotsPolicy } from './types'

const defaultPolicies: RobotsPolicy[] = [
  {
    type: 'userAgent',
    value: '*',
  },
  {
    type: 'allow',
    value: '/',
  },
]

export function generateRobotsTxt(
  policies: RobotsPolicy[] = [],
  { appendOnDefaultPolicies = true, headers }: RobotsConfig = {},
) {
  const policiesToUse = appendOnDefaultPolicies ? [...defaultPolicies, ...policies] : policies
  const robotText = getRobotsText(policiesToUse)
  const bytes = new TextEncoder().encode(robotText).byteLength

  return new Response(robotText, {
    headers: {
      ...headers,
      'Content-Type': 'text/plain',
      'Content-Length': String(bytes),
    },
  })
}
