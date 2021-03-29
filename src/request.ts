import { flow, makeObservable, observable } from 'mobx'
import type { CancellablePromise } from 'mobx/dist/api/flow'

import type { MobxSetterOption, MobxSetterValue } from './setter'
import { mobxSetter } from './setter'
import type { RequestFunction } from './type'

export interface MobxRequestOption<Data, Request extends RequestFunction> extends MobxSetterOption<Data> {
  request: Request
}

export interface MobxRequestValue<Data, Request extends RequestFunction> extends MobxSetterValue<Data> {
  request: (...args: Parameters<Request>) => CancellablePromise<Data>
  cancel(): void
  loading: boolean
}

/**
 * @remarks
 * 生成以包含请求方法、数据、状态的observable属性
 * */
export function mobxRequest<TData, TRequest extends (param?: any) => Promise<any>>({
  value: defaultValue,
  request: requestFunction,
  annotation,
}: MobxRequestOption<TData, TRequest>): MobxRequestValue<TData, TRequest> {
  const setter = mobxSetter({
    value: defaultValue,
    annotation,
  })
  // 上一次的请求结果Promise
  let lastRequest: CancellablePromise<TData> | null = null
  const target: MobxRequestValue<TData, TRequest> = Object.assign(setter, {
    loading: false,
    request: flow(function* request(...args: Parameters<TRequest>) {
      target.loading = true
      try {
        const data = yield requestFunction(...args)
        setter.set(data)
        return data
      } finally {
        target.loading = false
      }
    }),
    cancel: () => {
      if (target.loading && lastRequest?.cancel) {
        lastRequest.cancel()
      }
    },
  })
  const rawRequest = target.request
  target.request = (...args: Parameters<TRequest>) => {
    if (lastRequest && target.loading) {
      lastRequest.cancel()
    }
    lastRequest = rawRequest(...args)
    return lastRequest
  }
  makeObservable(target, {
    loading: observable,
  })
  return target
}
