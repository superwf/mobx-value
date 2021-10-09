import { Button, Card, Row, Spin, Table } from 'antd'
import { observer } from 'mobx-react-lite'
import * as React from 'react'

import { mockRequest } from './mockRequest'
import type { User } from './type'

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
    name: 'a',
    key: '1',
  },
  {
    name: 'b',
    key: '2',
  },
]

export const MultipleInstance: React.FC = observer(() => {
  const wrongColumns = [
    {
      title: 'name',
      dataIndex: 'name',
    },
    {
      title: 'operation',
      key: 'operation',
      width: 200,
      render() {
        const Comp = observer(() => (
          <Button type="primary" loading={updateUser.loading} onClick={() => updateUser.request()}>
            update user
          </Button>
        ))
        return <Comp />
      },
    },
  ]

  const rightColumns = [
    {
      title: 'name',
      dataIndex: 'name',
    },
    {
      title: 'operation',
      key: 'operation',
      width: 200,
      render() {
        const Comp = observer(() => {
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
        return <Comp />
      },
    },
  ]

  return (
    <Card title="Multiple instance in one page" className="text-center">
      <Row className="mb-4" justify="center">
        All above examples use only one data instance in one page, as singleton mode.
        <br />
        But when there are more same data in one component, it will be a problem.
        <br />
        One data instance update, all related component will update.
      </Row>
      <Table bordered columns={wrongColumns} dataSource={dataSource} size="small" pagination={false} />
      <Row className="my-4" justify="center">
        One way is use React.useMemo to create independent data instance in each component.
      </Row>
      <Table bordered columns={rightColumns} dataSource={dataSource} size="small" pagination={false} />
    </Card>
  )
})
