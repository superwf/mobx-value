import type { MobxSetterUnionOption, PrimitiveType } from './type'

// learn from lodash isObject
export const isPrimitive = (v: MobxSetterUnionOption<any> | any): v is PrimitiveType => {
  const type = typeof v
  return v === null || (type !== 'object' && type !== 'function')
}
