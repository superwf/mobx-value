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
   * 执行restore，并重置为未请求状态
   * 如果重新进入observer环境则会再次发起request
   * 抛弃当前运行结果并重置所有属性为初始状态
   */
  reset(): void
}

/**
 * 修饰属性，该属性会成为 MobxLazyValue 数据结构
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
    /** 抛弃当前运行结果并重置所有属性为初始状态 */
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
