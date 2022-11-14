import type { CreateObservableOptions } from 'mobx'
import type { CancellablePromise } from 'mobx/dist/api/flow'

import { getMobx } from './mobx'
import { mobxSetter } from './setter'
import type { MobxRequestOption, MobxRequestValue, RequestFunction } from './type'

/**
 * generate a mobxRequest variable
 * */
export function mobxRequest<Data, Request extends RequestFunction>(
  option: MobxRequestOption<Data, Request>,
  observableOption?: CreateObservableOptions,
): MobxRequestValue<Data, Request> {
  const { flow, makeObservable, observable, onBecomeUnobserved } = getMobx()

  const {
    value: defaultValue,
    request: requestFunction,
    annotation,
    autoRestoreOnBecomeUnobserved = false,
    autoCancelOnBecomeUnobserved = false,
    parallel,
  } = option
  const valueInOption = 'value' in option
  const setter = mobxSetter(
    {
      value: valueInOption ? defaultValue : undefined,
      annotation,
      autoRestoreOnBecomeUnobserved,
    },
    observableOption,
  )
  type TParameters = Parameters<Request>
  type TData = Data | undefined

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
        if (valueInOption) {
          setter.set(data)
        }
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
  if (valueInOption && autoCancelOnBecomeUnobserved) {
    onBecomeUnobserved(target, 'value', target.cancel)
  }
  if (autoCancelOnBecomeUnobserved) {
    onBecomeUnobserved(target, 'loading', target.cancel)
  }
  return target as any
}
