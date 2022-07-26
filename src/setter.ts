import { action, makeObservable, observable, onBecomeUnobserved } from 'mobx'

import { assembleOption } from './assembleOption'
import type { MobxSetterOption, MobxSetterValue } from './type'

export function mobxSetter<Data, Option = any>(option: MobxSetterOption<Data, Option>): MobxSetterValue<Data> {
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
