import { observe } from 'mobx'
import React from 'react'

import type { MobxSetterValue } from './type'

export const useMobxValue = <T>(v: MobxSetterValue<T>) =>
  React.useSyncExternalStore(
    cb =>
      observe(v, 'value', () => {
        cb()
      }),
    () => v.value,
  )
