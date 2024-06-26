import type { CreateObservableOptions } from 'mobx'

import { assembleOption } from './assembleOption'
import { getMobx } from './mobx'
import type { MobxSetterOption, MobxSetterValue } from './type'

export function mobxSetter<Data, Option = any>(
  option: MobxSetterOption<Data, Option>,
  observableOption?: CreateObservableOptions,
): MobxSetterValue<Data> {
  const { action, makeObservable, observable, onBecomeUnobserved } = getMobx()
  const { value, annotation, autoRestoreOnBecomeUnobserved, autoRestore, name } = assembleOption(option)
  const defaultValue = value as Data
  const target: MobxSetterValue<Data> = {
    value: value as Data,
    restore() {
      target.value = defaultValue
    },
    set(v: Data | ((prev: Data) => Data)) {
      if (v instanceof Function) {
        target.value = v(target.value)
      } else {
        target.value = v
      }
    },
    merge(v) {
      if (typeof v === 'function') {
        target.value = {
          ...target.value,
          ...v(target.value),
        }
        return 
      }
      if (!target.value) {
        target.value = v as any
        return
      }
      if (typeof target.value === 'object' && typeof v === 'object' && v !== null) {
        target.value = {
          ...target.value,
          ...v,
        }
      }
    },
  }
  if (name) {
    if (!observableOption) {
      observableOption = { name }
    } else {
      observableOption.name = name
    }
  }
  makeObservable(
    target,
    {
      value: annotation || observable,
      set: action,
      merge: action,
    },
    observableOption,
  )
  target.restore = action(() => {
    target.value = defaultValue
  })
  if (autoRestoreOnBecomeUnobserved || autoRestore) {
    onBecomeUnobserved(target, 'value', target.restore)
  }
  return target
}
