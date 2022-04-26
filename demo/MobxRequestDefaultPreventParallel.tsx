import { Button, Card, Row, Spin } from 'antd'
import { observer } from 'mobx-react-lite'
import * as React from 'react'

import type { User } from './type'

import { request } from '../src'
import { sleep } from '../src/sleep'

const userRequest = request({
  value: { name: '' } as User,
  request: async () => {
    await sleep(1000)
    return fetch('/user.json').then(res => res.json())
  },
})

export const MobxRequestDefaultPreventParallel: React.FC = observer(() => {
  const onClick = React.useCallback(() => {
    userRequest.request()
  }, [])
  return (
    <Card title="MobxRequest default prevent parallel" className="text-center">
      <Row className="mb-4" justify="center">
        User name:
        <Spin spinning={userRequest.loading}>
          <b className="px-2">{userRequest.value.name}</b>
        </Spin>
      </Row>
      <Row className="mb-4" justify="center">
        This time, the button does not has loading state to prevent repeat click, and by default, mobxRequest will
        <b className="px-2">NOT</b>
        request before previous request finished.
      </Row>
      <Row className="flex justify-center align-middle">
        <Button type="primary" onClick={onClick}>
          click here as quick as you can, and watch the chrome network pannel.
        </Button>
        <Button type="ghost" onClick={userRequest.restore}>
          restore user blank name
        </Button>
      </Row>
    </Card>
  )
})
