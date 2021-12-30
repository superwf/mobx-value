import { observable } from 'mobx'

import { isPrimitive } from './isPrimitive'
import type { MobxSetterOption, MobxSetterUnionOption } from './type'

export function assembleOption<O extends MobxSetterUnionOption>(v: O): MobxSetterOption<O> {
  if (isPrimitive(v)) {
    return {
      value: v,
      annotation: observable,
      autoRestoreOnBecomeUnobserved: false,
    } as unknown as MobxSetterOption<O>
  }
  if (!('value' in v)) {
    throw new Error('setter parameter must be a primitive value, or as a `value` property')
  }
  return v as unknown as MobxSetterOption<O>
}
