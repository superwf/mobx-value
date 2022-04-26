import { Skeleton } from 'antd'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import * as shiki from 'shiki'

import { mobxBoolean } from '../src'

export type Props = {
  code: string
  lang: shiki.Lang
}

let highlighterCache: shiki.Highlighter | null = null

const getHighlighter = async () => {
  if (highlighterCache) {
    return highlighterCache
  }
  highlighterCache = await shiki.getHighlighter({
    theme: 'material-darker',
    langs: ['javascript', 'sh', 'typescript'],
  })
  return highlighterCache
}

/**
 * SyntaxHighlighter with shiki
 * */
export const SyntaxHighlighter: React.FC<Props> = observer(({ code, lang }) => {
  const [highlightedCode, setHighlightedCode] = React.useState('')
  const loading = React.useMemo(() => mobxBoolean({ value: true }), [])
  React.useEffect(() => {
    getHighlighter().then(highlighter => {
      const highlighted = highlighter.codeToHtml(code, { lang })
      setHighlightedCode(highlighted)
      loading.setFalse()
    })
  }, [code])
  if (loading.value) {
    return <Skeleton active />
  }
  return <div dangerouslySetInnerHTML={{ __html: highlightedCode }}></div>
})
