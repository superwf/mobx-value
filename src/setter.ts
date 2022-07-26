import { action, makeObservable, observable, onBecomeUnobserved } from 'mobx'

import { assembleOption } from './assembleOption'
import type { MobxSetterStandardOption, MobxSetterValue, PrimitiveType } from './type'

// export function mobxSetter<Data extends PrimitiveType>(option: Data): MobxSetterValue<Data>
export function mobxSetter<
  T,
  Data = T extends PrimitiveType ? T : T extends MobxSetterStandardOption<infer D> ? D : never,
>(option: T): MobxSetterValue<Data> {
  const { value, annotation, autoRestoreOnBecomeUnobserved } = assembleOption(option)
  const defaultValue = value as Data
  const target = {
    value: value as Data,
    restore() {
      target.value = defaultValue
    },
    set(v: Data) {
      target.value = v
    },
  }
  makeObservable(target, {
    value: annotation || observable,
    restore: action,
    set: action,
  })
  if (autoRestoreOnBecomeUnobserved) {
    onBecomeUnobserved(target, 'value', target.restore)
  }
  return target
}
