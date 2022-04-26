import { Button, Card, Row, Spin } from 'antd'
import { observer } from 'mobx-react-lite'
import * as React from 'react'

import { mockRequest } from './mockRequest'
import type { User } from './type'

import { lazy } from '../src'

const userLazyRequest = lazy({
  value: { name: '' } as User,
  request: mockRequest({
    data: { name: 'Tim' },
    delay: 1000,
  }),
})

export const MobxLazy: React.FC = observer(() => (
  <Card title="MobxLazy" className="text-center">
    <Row className="mb-4" justify="center">
      User name:
      <Spin spinning={userLazyRequest.loading}>
        <b className="px-2">{userLazyRequest.value.name}</b>
      </Spin>
    </Row>
    <Row className="mb-4" justify="center">
      MobxLazy value only make request when its in using.
    </Row>
    <Row className="mb-4" justify="center">
      And its value will <b className="px-2">KEEP</b> unless manually restore.
    </Row>
    <Row className="mb-4" justify="center">
      MobxLazy support all MobxRequest features, such as autoRestoreOnBecomeUnobserved and autoCancelOnBecomeUnobserved.
    </Row>
    <Row className="flex justify-center align-middle">
      <Button type="ghost" onClick={userLazyRequest.reset}>
        <b className="pr-2">RESET</b> user blank name
      </Button>
    </Row>
    <Row className="mt-4" justify="center">
      Note: <b className="pl-2">RESET</b>, not RESTORE, RESTORE only fill the value back. <b className="mx-2">RESET</b>
      restore value also reset the requested status.
    </Row>
  </Card>
))
