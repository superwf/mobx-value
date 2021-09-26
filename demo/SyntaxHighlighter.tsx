import * as React from 'react'
import * as shiki from 'shiki'

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
export const SyntaxHighlighter: React.FC<Props> = ({ code, lang }) => {
  const [highlightedCode, setHighlightedCode] = React.useState('')
  React.useEffect(() => {
    getHighlighter().then(highlighter => {
      const highlighted = highlighter.codeToHtml(code, lang)
      setHighlightedCode(highlighted)
    })
  }, [code])
  return <div dangerouslySetInnerHTML={{ __html: highlightedCode }}></div>
}
