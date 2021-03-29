import { onBecomeObserved } from 'mobx'
import type { CancellablePromise } from 'mobx/dist/api/flow'

import type { MobxRequestOption, MobxRequestValue } from './request'
import { mobxRequest } from './request'
import type { RequestFunction } from './type'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

export type MobxLazyOption<D, R extends RequestFunction> = MobxRequestOption<D, R>

export interface MobxLazyValue<Data, Request extends RequestFunction> extends MobxRequestValue<Data, Request> {
  requested: boolean
  cancel(): void
  ready: Promise<Data>
  refresh(): void
  reset(): void
}

/**
 * 修饰属性，该属性会成为 MobxLazyValue 数据结构
 * */
export function mobxLazy<Data, Request extends RequestFunction>({
  request,
  value: initValue,
  annotation,
}: MobxLazyOption<Data, Request>): MobxLazyValue<Data, Request> {
  const requestObject = mobxRequest({
    value: initValue,
    annotation,
    request,
  })
  let resolve: (v: Data) => void
  let reject: (e: Error) => void
  const createNewPromise = () =>
    new Promise<Data>((reso, reje) => {
      resolve = reso
      reject = reje
    })

  let requestResult = { cancel: noop } as CancellablePromise<Data>
  const target: MobxLazyValue<Data, Request> = Object.assign(requestObject, {
    requested: false,
    ready: createNewPromise(),
    refresh: () => {
      target.requested = true
      requestResult = requestObject.request.apply(null)
      target.ready = createNewPromise()
      requestResult.then(resolve).catch(reject)
    },
    /** 抛弃当前运行结果并重置所有属性为初始状态 */
    reset: () => {
      target.cancel()
      target.requested = false
      requestObject.restore()
      target.ready = createNewPromise()
    },
  })

  onBecomeObserved(requestObject, 'value', () => {
    if (!target.requested && !target.loading) {
      target.requested = true
      requestResult = requestObject.request.apply(null)
      requestResult.then(resolve).catch(reject)
    }
  })
  return target
}
