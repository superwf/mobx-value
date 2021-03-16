import { noop } from 'lodash'
import { onBecomeObserved } from 'mobx'
import type { CancellablePromise } from 'mobx/dist/api/flow'

import type { MobxRequestOption, MobxRequestValue } from './request'
import { mobxRequest } from './request'
import type { RequestFunction } from './type'

export type MobxLazyOption<D, R extends RequestFunction> = MobxRequestOption<D, R>

export interface MobxLazyValue<Data, Request extends RequestFunction> extends MobxRequestValue<Data, Request> {
  requested: boolean
  requestResult: CancellablePromise<Data>
  cancel(): void
  ready: Promise<Data>
  refresh(...p: any[]): void
  reset(): void
}

/**
 * 修饰属性，该属性会成为 MobxLazyValue 数据结构
 * */
export function mobxLazy<Data, Request extends RequestFunction>({
  request,
  value: initValue,
  recursive,
}: MobxLazyOption<Data, Request>): MobxLazyValue<Data, Request> {
  const requestObject = mobxRequest({
    value: initValue,
    recursive,
    request,
  })
  let resolve: (v: Data) => void
  let reject: (e: Error) => void
  const result: MobxLazyValue<Data, Request> = Object.assign(requestObject, {
    innerValue: initValue,
    requested: false,
    ready: new Promise<Data>((reso, reje) => {
      resolve = reso
      reject = reje
    }),
    requestResult: { cancel: noop } as CancellablePromise<Data>,
    cancel: () => {
      if (result.loading && result.requestResult?.cancel) {
        result.requestResult.cancel()
      }
    },
    refresh: () => {
      result.requestResult = requestObject.request.apply(null)
      result.ready = new Promise<Data>((reso, reje) => {
        resolve = reso
        reject = reje
      })
      result.requestResult.then(resolve).catch(reject)
    },
    /** 抛弃当前运行结果并重置所有属性为初始状态 */
    reset: () => {
      if (requestObject.loading) {
        result.cancel()
      }
      // if (!result.requested) {
      //   reject(new Error('mobxLazyValue reset'))
      // }
      result.requested = false
      requestObject.restore()
      result.ready = new Promise<Data>((reso, reje) => {
        resolve = reso
        reject = reje
      })
    },
  })

  onBecomeObserved(requestObject, 'value', () => {
    if (!result.requested) {
      result.requested = true
      result.requestResult = requestObject.request.apply(null)
      result.requestResult.then(resolve).catch(reject)
    }
  })
  return result
}
