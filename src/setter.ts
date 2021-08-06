import type { AnnotationMapEntry } from 'mobx'
import { action, makeObservable, observable, onBecomeUnobserved } from 'mobx'

export interface MobxSetterOption<Data> {
  value: Data
  /**
   * mobx `makeObservable` annotation option for `value`
   * @default observable
   * */
  annotation?: Exclude<AnnotationMapEntry, false>
  /**
   * auto run restore when not observed
   * may be this option should be default true?
   * when set default true will break main version
   * @default false
   * */
  autoRestoreWhenNotObserved?: boolean
}

export interface MobxSetterValue<Data> {
  value: Data
  set: (v: Data) => void
  restore: () => void
}

export function mobxSetter<Data>({
  value,
  annotation = observable,
  autoRestoreWhenNotObserved = false,
}: MobxSetterOption<Data>): MobxSetterValue<Data> {
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
    value: annotation,
    restore: action,
    set: action,
  })
  if (autoRestoreWhenNotObserved) {
    onBecomeUnobserved(target, 'value', target.restore)
  }
  return target
}
