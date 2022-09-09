import type { CancellablePromise } from 'mobx/dist/api/flow'

import { getMobx } from './mobx'
import { noop } from './noop'
import { mobxRequest } from './request'
import type { MobxLazyOption, MobxLazyValue, RequestFunction } from './type'

/**
 * generate a MobxLazyValue variable
 * */
export function mobxLazy<Data, Request extends RequestFunction>({
  request,
  value: initValue,
  annotation,
  autoRestoreOnBecomeUnobserved,
}: MobxLazyOption<Data, Request>): MobxLazyValue<Data, Request> {
  const { onBecomeObserved } = getMobx()

  const requestTarget = mobxRequest({
    value: initValue,
    annotation,
    request,
    autoRestoreOnBecomeUnobserved,
  })
  let resolve: (v: Data) => void
  let reject: (e: Error) => void
  const createNewPromise = () =>
    new Promise<Data>((reso, reje) => {
      resolve = reso
      reject = reje
    })

  let requestResult = { cancel: noop } as CancellablePromise<Data>
  const target: MobxLazyValue<Data, Request> = Object.assign(requestTarget, {
    requested: false,
    ready: createNewPromise(),
    refresh: () => {
      target.requested = true
      requestResult = requestTarget.request.apply(null)
      target.ready = createNewPromise()
      requestResult.then(resolve).catch(reject)
      return requestResult
    },
    /**
     * restore value also reset all request status to initial
     * when next time it enter mobx observer context
     * it will request again
     * */
    reset: () => {
      target.cancel()
      target.requested = false
      requestTarget.restore()
      target.ready = createNewPromise()
    },
  })

  onBecomeObserved(requestTarget, 'value', () => {
    if (!target.requested && !target.loading) {
      target.requested = true
      requestResult = requestTarget.request.apply(null)
      requestResult.then(resolve).catch(reject)
    }
  })
  return target
}
