import type { AnnotationMapEntry } from 'mobx'
import { action, makeObservable, observable } from 'mobx'

export interface MobxSetterOption<Data> {
  value: Data
  annotation?: Exclude<AnnotationMapEntry, false>
}

export interface MobxSetterValue<Data> {
  value: Data
  set: (v: Data) => void
  restore: () => void
}

export function mobxSetter<Data>({ value, annotation }: MobxSetterOption<Data>): MobxSetterValue<Data> {
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
  makeObservable(target, {
    value: annotation || observable,
    restore: action,
    set: action,
  })
  return target
}
