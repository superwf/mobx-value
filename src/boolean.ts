import type { CreateObservableOptions } from 'mobx'

import { getMobx } from './mobx'
import { mobxSetter } from './setter'
import type { MobxBooleanOption, MobxBooleanValue } from './type'

/**
 * 生成MobxBooleanValue数据结构的变量
 * */
export function mobxBoolean(option?: MobxBooleanOption, observableOption?: CreateObservableOptions): MobxBooleanValue {
  const { observable } = getMobx()
  let value = false
  let autoRestoreOnBecomeUnobserved = false
  if (typeof option === 'object') {
    value = Boolean(option.value)
    autoRestoreOnBecomeUnobserved = Boolean(option.autoRestoreOnBecomeUnobserved) || Boolean(option.autoRestore)
  } else {
    value = Boolean(option)
    autoRestoreOnBecomeUnobserved = false
  }

  option = option || { value: false, autoRestoreOnBecomeUnobserved: false }

  const setter = mobxSetter(
    {
      value,
      autoRestoreOnBecomeUnobserved,
      annotation: observable,
    },
    observableOption,
  )
  const booleanValue: MobxBooleanValue = Object.assign(setter, {
    setTrue() {
      setter.set(true)
    },
    setFalse() {
      setter.set(false)
    },
    toggle() {
      setter.set(!setter.value)
    },
  })
  return booleanValue
}
