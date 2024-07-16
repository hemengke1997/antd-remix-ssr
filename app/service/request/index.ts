import ky, { type Input, type KyInstance, type Options } from 'ky'

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

const ContentTypeKey = 'Content-Type'

type RequestOptions = {} & Options

class KyRequest {
  private readonly DEFAULT_OPTIONS: Options = {
    headers: {
      [ContentTypeKey]: CONTENT_TYPE.JSON,
    },
    timeout: 5 * 1000, // 5s
    credentials: 'include',
    prefixUrl: '',
    retry: 2,
  }

  private instance: KyInstance
  constructor(options?: Options) {
    this.instance = this.createInstance(options)
  }

  private createInstance(options?: Options) {
    const base = ky.create(this.DEFAULT_OPTIONS)
    return options ? base.extend(options) : base
  }

  get(url: Input, options?: RequestOptions) {
    return this.instance.get(url, options)
  }

  post(url: Input, options?: RequestOptions) {
    return this.instance.post(url, options)
  }

  put(url: Input, options?: RequestOptions) {
    return this.instance.put(url, options)
  }

  delete(url: Input, options?: RequestOptions) {
    return this.instance.delete(url, options)
  }
}

const request = new KyRequest()

export { request }
