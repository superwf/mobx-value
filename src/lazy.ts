import { onBecomeObserved } from 'mobx'
import type { CancellablePromise } from 'mobx/dist/api/flow'

import { noop } from './noop'
import type { MobxRequestOption, MobxRequestValue } from './request'
import { mobxRequest } from './request'
import type { RequestFunction } from './type'

export type MobxLazyOption<D, R extends RequestFunction> = MobxRequestOption<D, R>

export interface MobxLazyValue<Data, Request extends RequestFunction> extends MobxRequestValue<Data, Request> {
  requested: boolean
  cancel(): void
  ready: Promise<Data>

  /**
   * restore and reset request to initial status
   */
  reset(): void
}

/**
 * generate a MobxLazyValue variable
 * */
export function mobxLazy<Data, Request extends RequestFunction>({
  request,
  value: initValue,
  annotation,
  autoRestoreOnBecomeUnobserved,
}: MobxLazyOption<Data, Request>): MobxLazyValue<Data, Request> {
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
    /** restore and reset all request status to initial */
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
