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
  loading: boolean
}

/**
 * @remarks
 * 生成以包含请求方法、数据、状态的observable属性
 * */
export function mobxRequest<TData, TRequest extends (param?: any) => Promise<any>>({
  value: defaultValue,
  request: requestFunction,
  recursive,
}: MobxRequestOption<TData, TRequest>): MobxRequestValue<TData, TRequest> {
  const setter = mobxSetter({
    value: defaultValue,
    recursive,
  })
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
  })
  let prevRequest: CancellablePromise<TData> | null = null
  const rawRequest = target.request
  target.request = (...args: Parameters<TRequest>) => {
    if (prevRequest && target.loading) {
      prevRequest.cancel()
    }
    prevRequest = rawRequest(...args)
    return prevRequest
  }
  makeObservable(target, {
    loading: observable,
  })
  return target
}
