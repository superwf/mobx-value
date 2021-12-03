import type { AnnotationMapEntry } from 'mobx'

export type RequestFunction = (...args: any[]) => Promise<any>

export type MobxSetterLegacyOption<Data> = {
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
}

export type OptionValueType<T> = T extends MobxSetterLegacyOption<infer Data> ? Data : T

export type PrimitiveType = string | number | symbol | boolean | null | undefined

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

export type MobxSetterUnionOption<T extends any = any> = MobxSetterLegacyOption<T> | PrimitiveType

export type MobxSetterOption<T> = T extends MobxSetterLegacyOption<infer P>
  ? MobxSetterLegacyOption<P>
  : T extends PrimitiveType
  ? MobxSetterLegacyOption<StripPrimitive<T>>
  : never

export type MobxSetterValue<T> = T extends MobxSetterLegacyOption<infer Data>
  ? {
      value: Data
      set: (v: Data) => void
      restore: () => void
    }
  : never
