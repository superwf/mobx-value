import { Card, Row, Switch } from 'antd'
import { observer } from 'mobx-react-lite'
import * as React from 'react'

import { SyntaxHighlighter } from './SyntaxHighlighter'

import { mobxBoolean } from '../src'

export type Props = {
  code: string
  Component: React.FC
}

export const RenderWithSourceCode: React.FC<Props> = observer(({ code, Component }) => {
  const showCode = React.useMemo(mobxBoolean, [])
  return (
    <Card>
      <Component />
      <Row justify="center" className="my-2">
        <Switch
          checkedChildren="Show Source"
          unCheckedChildren="Hide Source"
          checked={showCode.value}
          onChange={showCode.set}
        />
      </Row>
      {showCode.value && <SyntaxHighlighter lang="typescript" code={code} />}
    </Card>
  )
})
