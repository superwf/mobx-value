import type { MobxSetterValue } from './setter'
import { mobxSetter } from './setter'

export interface MobxBooleanValue extends MobxSetterValue<boolean> {
  setTrue: () => void
  setFalse: () => void
  toggle: () => void
}

/**
 * 生成MobxBooleanValue数据结构的变量
 * */
export function mobxBoolean(value = false): MobxBooleanValue {
  const setter = mobxSetter({ value })
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
