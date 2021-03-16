import { isObject, negate } from 'lodash'

export const isPrimitive = negate(isObject)
