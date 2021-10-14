import { Button, Card, List, Row, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import * as React from 'react'

import { mockRequest } from './mockRequest'

import { mobxRequest } from '../src'

const updateUser = mobxRequest({
  value: {},
  request: mockRequest({
    data: {},
    delay: 1000,
  }),
})

const dataSource = [
  {
    name: 'Tom',
    key: '1',
  },
  {
    name: 'Jery',
    key: '2',
  },
]

const Wrong: React.FC = observer(() => (
  <List>
    <Typography.Title level={4}>Wrong Example</Typography.Title>
    {dataSource.map(row => (
      <List.Item
        key={row.key}
        actions={[
          <Button type="primary" loading={updateUser.loading} onClick={() => updateUser.request()}>
            update user
          </Button>,
        ]}
      >
        {row.name}
      </List.Item>
    ))}
  </List>
))

const IndependentButton: React.FC = observer(() => {
  const updateRowUser = React.useMemo(
    () =>
      mobxRequest({
        value: {},
        request: mockRequest({
          data: {},
          delay: 1000,
        }),
      }),
    [],
  )
  return (
    <Button type="primary" loading={updateRowUser.loading} onClick={() => updateRowUser.request()}>
      update user
    </Button>
  )
})

const Right: React.FC = observer(() => (
  <List>
    <Typography.Title level={4}>Right Example</Typography.Title>
    {dataSource.map(row => (
      <List.Item key={row.key} actions={[<IndependentButton />]}>
        {row.name}
      </List.Item>
    ))}
  </List>
))

export const MultipleInstance: React.FC = observer(() => (
  <Card title="Multiple instance in one page" className="text-center">
    <Row className="mb-4" justify="center">
      All above examples use only one data instance in one page, as singleton mode.
      <br />
      But when there are more same type data in more same type component, it will be a problem.
      <br />
      One data instance update, all related component will update.
      <br />
      It is not a good job 🤨.
    </Row>
    <Wrong />
    <Row className="my-4" justify="center">
      My way is use <b className="mx-2">React.useMemo</b> to create independent data instance in each component.
    </Row>
    <Right />
  </Card>
))
