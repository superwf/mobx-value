import { action, makeObservable, onBecomeUnobserved } from 'mobx'

import { assembleOption } from './assembleOption'
import type { MobxSetterLegacyOption, PrimitiveType, StripPrimitive } from './type'

export interface MobxSetterValue<Data> {
  value: Data
  set: (v: Data) => void
  restore: () => void
}

export function mobxSetter<Data extends PrimitiveType>(o: StripPrimitive<Data>): MobxSetterValue<StripPrimitive<Data>>
export function mobxSetter<Data>(o: MobxSetterLegacyOption<Data>): MobxSetterValue<Data>

export function mobxSetter<Data>(option: any): MobxSetterValue<Data> {
  const { value, annotation, autoRestoreOnBecomeUnobserved } = assembleOption(option)
  const defaultValue = value
  const target = {
    value,
    restore() {
      target.value = defaultValue
    },
    set(v: any) {
      target.value = v
    },
  }
  makeObservable(target, {
    value: annotation,
    restore: action,
    set: action,
  })
  if (autoRestoreOnBecomeUnobserved) {
    onBecomeUnobserved(target, 'value', target.restore)
  }
  return target
}
