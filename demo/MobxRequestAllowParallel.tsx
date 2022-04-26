import { Button, Card, Row } from 'antd'
import * as React from 'react'

import { request } from '../src'
import { sleep } from '../src/sleep'

type User = {
  name: string
}

const userRequest = request({
  value: { name: '' } as User,
  parallel: true,
  request: async () => {
    await sleep(1000)
    return fetch('/user.json').then(res => res.json())
  },
})

export const MobxRequestAllowParallel: React.FC = () => {
  const onClick = React.useCallback(() => {
    userRequest.request()
  }, [])
  return (
    <Card title="MobxRequest allow parallel" className="text-center">
      <Row className="mb-4" justify="center">
        Some times we do not care the return result, request parallel should not be stopped.
      </Row>
      <Row className="flex justify-center align-middle">
        <Button type="primary" onClick={onClick}>
          each click make a request.
        </Button>
        <Button type="ghost" onClick={userRequest.restore}>
          restore user blank name
        </Button>
      </Row>
    </Card>
  )
}
