import { isPrimitive } from './isPrimitive'
import mobx from './mobx'
import type { MobxSetterOption, MobxSetterStandardOption } from './type'

const { observable } = mobx.mobx

export function assembleOption<Data, Option = any>(v: MobxSetterOption<Data, Option>): MobxSetterStandardOption<Data> {
  if (isPrimitive(v)) {
    return {
      value: v,
      annotation: observable,
      autoRestoreOnBecomeUnobserved: false,
    } as MobxSetterStandardOption<Data>
  }
  if (!('value' in v)) {
    throw new Error('setter parameter must be a primitive value, or as a `value` property')
  }
  return v as MobxSetterStandardOption<Data>
}
