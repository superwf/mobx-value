import React from 'react'

import { getMobx } from './mobx'
import type { MobxSetterValue } from './type'

export const useMobxValue = <T>(v: MobxSetterValue<T>) => {
  const { observe } = getMobx()

  return React.useSyncExternalStore(
    cb =>
      observe(v, 'value', () => {
        cb()
      }),
    () => v.value,
  )
}
