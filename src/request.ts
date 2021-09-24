import { flow, makeObservable, observable, onBecomeUnobserved } from 'mobx'
import type { CancellablePromise } from 'mobx/dist/api/flow'

import type { MobxSetterOption, MobxSetterValue } from './setter'
import { mobxSetter } from './setter'
import type { RequestFunction } from './type'

export interface MobxRequestOption<Data, Request extends RequestFunction> extends MobxSetterOption<Data> {
  request: Request
  /**
   * set to true, prevent next request when loading
   * @default false
   * */
  parallel?: boolean

  /**
   * auto cancle request when not observed and loading is not complete
   * @default false
   * */
  autoCancelOnBecomeUnobserved?: boolean
}

export interface MobxRequestValue<Data, Request extends RequestFunction> extends MobxSetterValue<Data> {
  error: any
  request: (...args: Parameters<Request>) => CancellablePromise<Data>
  /** request again with last parameters */
  refresh: () => CancellablePromise<Data>
  cancel(): void
  loading: boolean
}

/**
 * generate a mobxRequest variable
 * */
export function mobxRequest<TData, Request extends RequestFunction>({
  value: defaultValue,
  request: requestFunction,
  annotation,
  autoRestoreOnBecomeUnobserved = false,
  autoCancelOnBecomeUnobserved = false,
  parallel,
}: MobxRequestOption<TData, Request>): MobxRequestValue<TData, Request> {
  const setter = mobxSetter({
    value: defaultValue,
    annotation,
    autoRestoreOnBecomeUnobserved,
  })
  type TParameters = Parameters<Request>

  // store prev request Promise
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

  target.request = (...args: TParameters) => {
    lastParameters = args
    if (!lastRequest) {
      lastRequest = rawRequest(...args)
      return lastRequest
    }
    if (target.loading && !parallel) {
      return lastRequest
    }
    lastRequest = rawRequest(...args)
    return lastRequest
  }
  makeObservable(target, {
    error: observable,
    loading: observable,
  })
  if (autoCancelOnBecomeUnobserved) {
    onBecomeUnobserved(target, 'value', target.cancel)
  }
  return target
}
