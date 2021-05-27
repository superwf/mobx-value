import * as mobx from 'mobx'
import * as mobxReactLite from 'mobx-react-lite'

import type { MobxBooleanValue } from './boolean'
import { mobxBoolean } from './boolean'
import type { MobxLazyOption, MobxLazyValue } from './lazy'
import { mobxLazy } from './lazy'
import type { MobxRequestOption, MobxRequestValue } from './request'
import { mobxRequest } from './request'
import type { MobxSetterOption, MobxSetterValue } from './setter'
import { mobxSetter } from './setter'

mobx.configure({ isolateGlobalState: true })

export type {
  MobxSetterOption,
  MobxSetterValue,
  MobxRequestOption,
  MobxRequestValue,
  MobxLazyOption,
  MobxLazyValue,
  MobxBooleanValue,
}
export { mobx, mobxReactLite, mobxSetter, mobxRequest, mobxBoolean, mobxLazy }
export default { mobx, mobxReactLite, mobxSetter, mobxRequest, mobxBoolean, mobxLazy }
