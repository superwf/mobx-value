import { Button, Card, Row } from 'antd'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'

import { setter } from '../src'

const counter = setter(1, {
  name: 'demo counter',
})

const plusCounter = () => counter.set(counter.value + 1)
// const minusCounter = () => counter.set(counter.value - 1)
const minusCounter = () => {
  // can see warn with "demo counter" in console
  counter.value -= 1
}

export const MobxSetter: FC = observer(() => (
  <Card title="MobxSetter default useage" className="text-center">
    <Row className="mb-4" justify="center">
      Counter: {counter.value}
    </Row>
    <Row className="mb-4" justify="center">
      Notice: When go other page, return back, the counter will <b className="px-2">KEEP</b> its value.
    </Row>
    <Row className="flex justify-center align-middle">
      <Button type="primary" onClick={plusCounter}>
        Counter ++
      </Button>
      <Button type="dashed" onClick={minusCounter}>
        Counter --
      </Button>
    </Row>
  </Card>
))
