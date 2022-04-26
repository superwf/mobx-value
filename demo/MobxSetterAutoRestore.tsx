import { Button, Card, Row } from 'antd'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'

import { setter } from '../src'

const counter = setter({
  value: 1,
  autoRestoreOnBecomeUnobserved: true,
})

const plusCounter = () => counter.set(counter.value + 1)
const minusCounter = () => counter.set(counter.value - 1)

export const MobxSetterAutoRestore: FC = observer(() => (
  <Card title="MobxSetter auto restore initial value" className="text-center">
    <Row justify="center">Counter: {counter.value}</Row>
    <Row className="mb-4" justify="center">
      Notice: When go other page, return back, the counter will <b className="px-2">RESTORE</b> its origin value
      automatically.
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
