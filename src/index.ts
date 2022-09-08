import { mobxBoolean } from './boolean'
import { mobxLazy } from './lazy'
import { configureMobx } from './mobx'
import { mobxRequest } from './request'
import { mobxSetter } from './setter'

export type {
  MobxRequestOption,
  MobxRequestValue,
  MobxLazyOption,
  MobxLazyValue,
  MobxBooleanOption,
  MobxBooleanValue,
  MobxSetterOption,
  MobxSetterValue,
} from './type'
export { useMobxValue } from './hook'
export { mobxSetter, mobxRequest, mobxBoolean, mobxLazy }
export { mobxSetter as setter, mobxRequest as request, mobxBoolean as boolean, mobxLazy as lazy, configureMobx }
export default {
  setter: mobxSetter,
  mobxSetter,
  request: mobxRequest,
  mobxRequest,
  boolean: mobxBoolean,
  mobxBoolean,
  lazy: mobxLazy,
  mobxLazy,
  configureMobx,
}
