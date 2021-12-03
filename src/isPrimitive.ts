import type { MobxSetterUnionOption, PrimitiveType } from './type'

// reference lodash isObject
export const isPrimitive = (v: MobxSetterUnionOption): v is PrimitiveType => {
  const type = typeof v
  return v === null || (type !== 'object' && type !== 'function')
}
