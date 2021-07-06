import { observer } from 'mobx-react-lite'
import React from 'react'
import type { FC } from 'react'
import { render } from 'react-dom'

import { mobxSetter } from './index'

const counter = mobxSetter({
  value: 1,
})

const plusCounter = () => counter.set(counter.value + 1)
const minusCounter = () => counter.set(counter.value - 1)

const App: FC = observer(() => (
  <div>
    <h1>Count: {counter.value}</h1>
    <button onClick={plusCounter}>Count ++ </button>
    <button onClick={minusCounter}>Count -- </button>
  </div>
))

render(<App />, document.querySelector('#app'))
