import { getMobx } from './mobx'
import { mobxSetter } from './setter'
import type { MobxBooleanOption, MobxBooleanValue } from './type'

/**
 * 生成MobxBooleanValue数据结构的变量
 * */
export function mobxBoolean(
  { value = false, autoRestoreOnBecomeUnobserved = false }: MobxBooleanOption = { value: false },
): MobxBooleanValue {
  const { observable } = getMobx()
  const setter = mobxSetter({ value, autoRestoreOnBecomeUnobserved, annotation: observable })
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
