import { Button, Card, Row, Spin } from 'antd'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'

import { mockRequest } from './mockRequest'

import { mobxRequest } from '../src'

type User = {
  name: string
}

const userRequest = mobxRequest({
  value: { name: '' } as User,
  request: mockRequest({
    data: { name: 'Tim' },
    delay: 1000,
  }),
})

export const MobxRequest: FC = observer(() => (
  <Card className="h-full">
    <Row className="mb-4" justify="center">
      User name:
      <Spin spinning={userRequest.loading}>
        <b className="px-2">{userRequest.value.name}</b>
      </Spin>
    </Row>
    <Row className="mb-4" justify="center">
      Notice: When go other page, return back, the user value will <b className="px-2">KEEP</b> its value.
    </Row>
    <Row className="flex justify-center align-middle">
      <Button loading={userRequest.loading} type="primary" onClick={() => userRequest.request()}>
        request user
      </Button>
      <Button type="ghost" onClick={userRequest.restore}>
        restore user blank name
      </Button>
    </Row>
  </Card>
))
