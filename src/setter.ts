import { action, makeObservable, observable, onBecomeUnobserved } from 'mobx'

import { assembleOption } from './assembleOption'
import type { MobxSetterUnionOption, MobxSetterValue, StripValue } from './type'

export function mobxSetter<Data = StripValue<MobxSetterUnionOption>>(
  option: MobxSetterUnionOption,
): MobxSetterValue<Data> {
  const { value, annotation, autoRestoreOnBecomeUnobserved } = assembleOption<MobxSetterUnionOption>(option)
  const defaultValue = value
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
