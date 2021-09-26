import { Card } from 'antd'
import raw from 'raw.macro'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import type { Lang } from 'shiki'

import { SyntaxHighlighter } from './SyntaxHighlighter'

const apiCode = raw('../README.md')

const components: React.ComponentProps<typeof ReactMarkdown>['components'] = {
  code({ inline, className, children, ...props }) {
    if (inline) {
      return <code className="p-1 text-green-200 bg-black rounded-sm">{children}</code>
    }
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
      <SyntaxHighlighter code={String(children).replace(/\n$/, '')} lang={match[1] as Lang} />
    ) : (
      <code className={className} {...props} />
    )
  },
  h1({ children }) {
    return <h1 id={String(children).toLowerCase()}>{children}</h1>
  },
  h2({ children }) {
    return <h2 id={String(children).toLowerCase()}>{children}</h2>
  },
  h3({ children }) {
    return <h3 id={String(children).toLowerCase()}>{children}</h3>
  },
  img() {
    return null
  },
}

export const Home: React.FC = () => (
  <Card>
    <ReactMarkdown components={components} plugins={[gfm]} children={apiCode}></ReactMarkdown>
  </Card>
)
