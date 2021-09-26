import { Button, Card, Row, Spin } from 'antd'
import { observer } from 'mobx-react-lite'
import * as React from 'react'

import { mockRequest } from './mockRequest'
import type { User } from './type'

import { mobxRequest } from '../src'

const userRequest = mobxRequest({
  value: { name: '' } as User,
  autoRestoreOnBecomeUnobserved: true,
  request: mockRequest({
    data: { name: 'Tim' },
    delay: 1000,
  }),
})

export const MobxRequestAutoRestore: React.FC = observer(() => {
  const onClick = React.useCallback(() => {
    userRequest.request()
  }, [])
  return (
    <Card title="MobxRequest auto restore" className="text-center">
      <Row className="mb-4" justify="center">
        User name:
        <Spin spinning={userRequest.loading}>
          <b className="px-2">{userRequest.value.name}</b>
        </Spin>
      </Row>
      <Row className="mb-4" justify="center">
        Notice: When go other page, return back, the user value will <b className="px-2">RESTORE</b> initial value.
      </Row>
      <Row className="flex justify-center align-middle">
        <Button loading={userRequest.loading} type="primary" onClick={onClick}>
          request user
        </Button>
        <Button type="ghost" onClick={userRequest.restore}>
          restore user blank name
        </Button>
      </Row>
    </Card>
  )
})
