import { observable } from 'mobx'

import { isPrimitive } from './isPrimitive'
import type {
  MobxSetterLegacyOption,
  MobxSetterOption,
  MobxSetterUnionOption,
  PrimitiveType,
  StripPrimitive,
} from './type'

export function assembleOption<Data extends PrimitiveType>(o: Data): MobxSetterLegacyOption<StripPrimitive<Data>>
export function assembleOption<Data>(o: MobxSetterLegacyOption<Data>): MobxSetterLegacyOption<Data>

export function assembleOption(v: any): MobxSetterLegacyOption<any> {
  if (isPrimitive(v)) {
    return {
      value: v,
      annotation: observable,
      autoRestoreOnBecomeUnobserved: false,
    }
  }
  if (!('value' in v)) {
    throw new Error('setter parameter must be a primitive value, or as a `value` property')
  }
  return v
}

// const a = assembleOption('')
// a.value.toString()
