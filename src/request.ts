import { flow, makeObservable, observable } from 'mobx'
import type { CancellablePromise } from 'mobx/dist/api/flow'

import type { MobxSetterOption, MobxSetterValue } from './setter'
import { mobxSetter } from './setter'
import type { RequestFunction } from './type'

export interface MobxRequestOption<Data, Request extends RequestFunction> extends MobxSetterOption<Data> {
  request: Request
  /**
   * 是否可以同时发起请求
   * @default false
   * */
  parallel?: boolean
}

export interface MobxRequestValue<Data, Request extends RequestFunction> extends MobxSetterValue<Data> {
  error: any
  request: (...args: Parameters<Request>) => CancellablePromise<Data>
  // request again with last parameters
  refresh: () => CancellablePromise<Data>
  cancel(): void
  loading: boolean
}

/**
 * @remarks
 * 生成以包含请求方法、数据、状态的observable属性
 * */
export function mobxRequest<TData, Request extends RequestFunction>({
  value: defaultValue,
  request: requestFunction,
  annotation,
  parallel,
}: MobxRequestOption<TData, Request>): MobxRequestValue<TData, Request> {
  const setter = mobxSetter({
    value: defaultValue,
    annotation,
  })
  type TParameters = Parameters<Request>

  // 存放上一次的请求结果Promise
  let lastRequest: CancellablePromise<TData> | null = null
  let lastParameters: any = []
  const target: MobxRequestValue<TData, Request> = Object.assign(setter, {
    loading: false,
    error: null,
    request: flow(function* request(...args: TParameters) {
      target.loading = true
      try {
        const data = yield requestFunction(...args)
        setter.set(data)
        return data
      } catch (e) {
        target.error = e
        throw e
      } finally {
        target.loading = false
      }
    }),
    refresh: () => target.request(...lastParameters),
    cancel: () => {
      if (target.loading && lastRequest) {
        lastRequest.cancel()
      }
    },
  })
  const rawRequest = target.request

  // 上一次请求没有完成的防抖
  target.request = (...args: TParameters) => {
    lastParameters = args
    if (!lastRequest) {
      lastRequest = rawRequest(...args)
      return lastRequest
    }
    if (target.loading && !parallel) {
      return lastRequest
    }
    // lastRequest.cancel()
    lastRequest = rawRequest(...args)
    return lastRequest
  }
  makeObservable(target, {
    error: observable,
    loading: observable,
  })
  return target
}
