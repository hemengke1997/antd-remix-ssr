import { isBrowser } from 'browser-or-node'
import Cookies from 'js-cookie'
import ky, { type Hooks, type KyInstance, type KyResponse, type Options } from 'ky'
import { i18nOptions } from '@/i18n/i18n'
import { LOCALE_COOKIE_NAME } from '@/utils/constants/storage'
import { REQUEST_CONSTANTS } from './constant'

export enum CONTENT_TYPE {
  /**
   * json
   */
  JSON = 'application/json;charset=UTF-8',
  /**
   * 表单
   */
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  /**
   * 文件上传
   */
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}

type RequestOptions = {
  request?: Request
} & Options

class KyRequest {
  private readonly DEFAULT_OPTIONS: Options = {
    headers: {
      [REQUEST_CONSTANTS.CONTENT_TYPE]: CONTENT_TYPE.JSON,
    },
    credentials: 'include',
    retry: 0,
    throwHttpErrors: false,
  }

  private cookies: {
    /**
     * 语言
     */
    locale?: string
  } = {}

  private instance: KyInstance
  private requestTime: Map<string, number> = new Map()

  constructor(options?: Options) {
    this.instance = this.createInstance(options)
  }

  private createInstance(options?: Options) {
    let base = ky.create(this.DEFAULT_OPTIONS)
    const timeHook: Hooks = {
      beforeRequest: [
        (request, options) => {
          const key = this.generateRequestKey(request.url, options)
          this.requestTime.set(key, Date.now())
        },
      ],
      afterResponse: [
        (request, options) => {
          const key = this.generateRequestKey(request.url, options)

          const endTime = Date.now()
          const startTime = this.requestTime.get(key)
          if (startTime) {
            const duration = endTime - startTime
            const url = new URL(request.url)
            if (!isBrowser) {
              console.log(`Request to ${url.href.replace(url.origin, '')} took ${duration}ms`)
            }
            this.requestTime.delete(key)
          }
        },
      ],
    }
    base = base.extend({ hooks: timeHook })
    return options ? base.extend(options) : base
  }

  private generateRequestKey(url: string, options?: RequestOptions): string {
    return `${options?.method}:${url}:${JSON.stringify(options)}`
  }

  private async resolveCookies(request?: Request) {
    if (isBrowser) {
      this.cookies.locale = Cookies.get(LOCALE_COOKIE_NAME)
    } else if (request && import.meta.env.SSR) {
      const cookie = await import('cookie')
      const headersCookie = request.headers.get('Cookie')
      if (headersCookie) {
        const nodeCookies = cookie.parse(headersCookie)
        this.cookies = {
          locale: nodeCookies[LOCALE_COOKIE_NAME],
        }
      }
    } else {
      // no cookies
      this.cookies = {
        locale: i18nOptions.fallbackLng,
      }
    }
  }

  private get requestCache() {
    if (isBrowser) {
      return new Map<string, Promise<KyResponse>>()
    }
    return undefined
  }

  async request(url: string, options?: RequestOptions) {
    const key = this.generateRequestKey(url, options)
    if (this.requestCache?.has(key)) {
      return this.requestCache.get(key)!
    }

    if (url.startsWith('/')) {
      url = url.slice(1)
    }

    await this.resolveCookies(options?.request)

    const request = this.instance(url, {
      ...options,
      headers: {
        ...options?.headers,
      },
    }).finally(() => {
      this.requestCache?.delete(key)
    })
    this.requestCache?.set(key, request)

    return request
  }

  get(url: string, options?: RequestOptions) {
    return this.request(url, {
      ...options,
      method: 'get',
    })
  }

  post(url: string, options?: RequestOptions) {
    return this.request(url, {
      ...options,
      method: 'post',
    })
  }

  put(url: string, options?: RequestOptions) {
    return this.request(url, {
      ...options,
      method: 'put',
    })
  }

  delete(url: string, options?: RequestOptions) {
    return this.request(url, {
      ...options,
      method: 'delete',
    })
  }
}

const rq = new KyRequest()

export { rq }
