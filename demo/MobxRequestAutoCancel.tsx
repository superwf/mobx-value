import { Button, Card, Row, Spin } from 'antd'
import { observer } from 'mobx-react-lite'
import * as React from 'react'

import { mobxRequest } from '../src'
import { sleep } from '../src/sleep'

type User = {
  name: string
}

const userRequest = mobxRequest({
  value: { name: '' } as User,
  autoCancelOnBecomeUnobserved: true,
  request: async () => {
    await sleep(2000)
    return fetch('/user.json').then(res => res.json())
  },
})

export const MobxRequestAutoCancel: React.FC = observer(() => {
  const onClick = React.useCallback(() => {
    userRequest.request()
  }, [])
  return (
    <Card title="MobxRequest auto cancel" className="text-center">
      <Row className="mb-4" justify="center">
        User name:
        <Spin spinning={userRequest.loading}>
          <b className="px-2">{userRequest.value.name}</b>
        </Spin>
      </Row>
      <Row className="mb-4" justify="center">
        Click and change to other page, see this request has been canceled.
      </Row>
      <Row className="mb-4" justify="center">
        The chrome dev pannel concle will display a <b className="px-2">FLOW_CANCELLED</b> error.
      </Row>
      <Row className="flex justify-center align-middle">
        <Button type="primary" onClick={onClick}>
          click here and switch other page quickly. return here to see that the user name is not filled.
        </Button>
        <Button type="ghost" onClick={userRequest.restore}>
          restore user blank name
        </Button>
      </Row>
    </Card>
  )
})
