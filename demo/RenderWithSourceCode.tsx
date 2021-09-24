import { Card, Row, Switch } from 'antd'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import * as shiki from 'shiki'

import { mobxBoolean } from '../src'

export type Props = {
  code: string
  Component: React.FC
}

export const RenderWithSourceCode: React.FC<Props> = observer(({ code, Component }) => {
  const [highlightedCode, setHighlightedCode] = React.useState('')
  const showCode = React.useMemo(mobxBoolean, [])
  React.useEffect(() => {
    shiki
      .getHighlighter({
        theme: 'nord',
      })
      .then(highlighter => {
        const highlighted = highlighter.codeToHtml(code, 'js')
        setHighlightedCode(highlighted)
      })
  }, [code])
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
      {showCode.value && <div dangerouslySetInnerHTML={{ __html: highlightedCode }}></div>}
    </Card>
  )
})
