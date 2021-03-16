import type { IObservableFactory } from 'mobx'
import { action, makeObservable, observable } from 'mobx'

import { isPrimitive } from './isPrimitive'

export interface MobxSetterOption<Data> {
  recursive?: boolean
  value: Data
}

export interface MobxSetterValue<Data> {
  value: Data
  set: (v: Data) => void
  restore: () => void
}

export function mobxSetter<Data>({ value, recursive }: MobxSetterOption<Data>): MobxSetterValue<Data> {
  const defaultValue = value
  const target = {
    value,
    restore() {
      target.value = defaultValue
    },
    set(v: Data) {
      target.value = v
    },
  }
  const decorator: IObservableFactory | typeof observable.shallow =
    isPrimitive(value) || recursive ? observable : observable.shallow
  makeObservable(target, {
    value: decorator,
    restore: action,
    set: action,
  })
  return target
}
