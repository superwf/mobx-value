import { observable } from 'mobx'

import { isPrimitive } from './isPrimitive'
import type { MobxSetterStandardOption, PrimitiveType } from './type'

// export function assembleOption<Data extends PrimitiveType>(v: Data): MobxSetterStandardOption<Data>
export function assembleOption<
  T,
  Data = T extends PrimitiveType ? T : T extends MobxSetterStandardOption<infer D> ? D : never,
>(v: T): MobxSetterStandardOption<Data> {
  if (isPrimitive(v)) {
    return {
      value: v,
      annotation: observable,
      autoRestoreOnBecomeUnobserved: false,
    } as unknown as MobxSetterStandardOption<Data>
  }
  if (!('value' in v)) {
    throw new Error('setter parameter must be a primitive value, or as a `value` property')
  }
  return v as unknown as MobxSetterStandardOption<Data>
}

const a = assembleOption('')
a.value.at(0)

const b = assembleOption({ value: '' })
b.value.at(0)
