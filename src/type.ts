import type { AnnotationMapEntry } from 'mobx'
import type { CancellablePromise } from 'mobx/dist/api/flow'

export type RequestFunction = (...args: any[]) => Promise<any>

export type MobxSetterStandardOption<Data> = {
  value: Data

  /**
   * mobx `makeObservable` annotation option for `value`
   * @default observable
   * */
  annotation?: AnnotationMapEntry

  /**
   * auto run restore when leave observer context
   * @default false
   * */
  autoRestoreOnBecomeUnobserved?: boolean

  /**
   * alias of `autoRestoreOnBecomeUnobserved`
   * @default false
   * added version 1.8.0
   * */
  autoRestore?: boolean

  /**
   * mobx debug name
   * */
  name?: string
}

export type OptionValueType<T> = T extends MobxSetterStandardOption<infer Data> ? Data : T

export type PrimitiveType = string | number | symbol | boolean | null | undefined | bigint

export type StripPrimitive<T extends PrimitiveType> = T extends string
  ? string
  : T extends number
  ? number
  : T extends symbol
  ? symbol
  : T extends boolean
  ? boolean
  : T extends null
  ? null
  : undefined

export type MobxSetterUnionOption<T> = MobxSetterStandardOption<T> | PrimitiveType

export type MobxSetterOption<Data, Option> = Option extends PrimitiveType
  ? Data
  : Option extends MobxSetterStandardOption<Data>
  ? MobxSetterStandardOption<Data>
  : never

export interface MobxSetterValue<Data> {
  value: Data
  set: (v: Data | ((prev: Data) => Data)) => void
  restore: () => void
  /** only works when value is an object, shallow merge properties */
  merge: (v: Record<string, any>) => void
}

export type StripValue<T> = T extends MobxSetterStandardOption<infer P>
  ? P
  : T extends PrimitiveType
  ? StripPrimitive<T>
  : never

export type MobxBooleanOption = Omit<MobxSetterStandardOption<boolean>, 'value'> & {
  value?: boolean
}

export interface MobxBooleanValue extends MobxSetterValue<boolean> {
  setTrue: () => void
  setFalse: () => void
  toggle: () => void
}

export interface MobxRequestOption<Data, Request extends RequestFunction>
  extends Omit<MobxSetterStandardOption<Data>, 'value'> {
  value?: Data
  request: Request

  /**
   * default mobxRequest prevent next request when last request is loading
   * set to true to allow next request when loading
   * @default false
   * */
  parallel?: boolean

  /**
   * auto cancle request when not observed and loading is not complete
   * @default false
   * */
  autoCancelOnBecomeUnobserved?: boolean
}

export interface MobxRequestValue<Data, Request extends RequestFunction> extends MobxSetterValue<Data> {
  error: any
  request: (...args: Parameters<Request>) => CancellablePromise<Data>
  /** request again with last parameters */
  refresh: () => CancellablePromise<Data>
  cancel(): void
  loading: boolean
  /** get last call args */
  getArguments(): any[]
}

export type MobxLazyOption<D, R extends RequestFunction> = MobxRequestOption<D, R>

export interface MobxLazyValue<Data, Request extends RequestFunction> extends MobxRequestValue<Data, Request> {
  /**
   * status tag, do not modify it
   * @readonly
   */
  requested: boolean
  cancel(): void

  /**
   * last request ready promise
   * when need some operate after this data is loaded
   * use `await lazy.ready`
   * * */
  ready: Promise<Data>

  /**
   * restore and reset request to initial status
   */
  reset(): void
}
