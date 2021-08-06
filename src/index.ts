import type { MobxBooleanOption, MobxBooleanValue } from './boolean'
import { mobxBoolean } from './boolean'
import type { MobxLazyOption, MobxLazyValue } from './lazy'
import { mobxLazy } from './lazy'
import type { MobxRequestOption, MobxRequestValue } from './request'
import { mobxRequest } from './request'
import type { MobxSetterOption, MobxSetterValue } from './setter'
import { mobxSetter } from './setter'

export type {
  MobxSetterOption,
  MobxSetterValue,
  MobxRequestOption,
  MobxRequestValue,
  MobxLazyOption,
  MobxLazyValue,
  MobxBooleanOption,
  MobxBooleanValue,
}
export { mobxSetter, mobxRequest, mobxBoolean, mobxLazy }
export default { mobxSetter, mobxRequest, mobxBoolean, mobxLazy }
