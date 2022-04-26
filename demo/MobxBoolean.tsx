import { Button, Card, Popover, Row } from 'antd'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'

import { boolean } from '../src'

const visible = boolean()

export const MobxBoolean: FC = observer(() => (
  <Card title="MobxBoolean default usage" className="text-center">
    <Row className="mb-4" justify="center">
      Notice: When go other page, return back, the popover will <b className="px-2">KEEP</b> its state.
    </Row>
    <Row className="mb-4" justify="center">
      MobxBoolean usually works with something as Modal, Drawer, Tooltip or Popover.
    </Row>
    <Popover title="title" content="content" visible={visible.value} trigger="click">
      <Button type="primary" onClick={visible.toggle}>
        {visible.value ? 'Hide' : 'Show'} Popover
      </Button>
    </Popover>
  </Card>
))
