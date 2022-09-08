import React from 'react'

import mobx from './mobx'
import type { MobxSetterValue } from './type'

const {
  mobx: { observe },
} = mobx

export const useMobxValue = <T>(v: MobxSetterValue<T>) =>
  React.useSyncExternalStore(
    cb =>
      observe(v, 'value', () => {
        cb()
      }),
    () => v.value,
  )
