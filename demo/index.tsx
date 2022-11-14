import * as mobx from 'mobx'
import ReactDOM from 'react-dom/client'

import './index.css'
import { App } from './App'

mobx.configure({
  enforceActions: 'always',
})

const root = ReactDOM.createRoot(document.querySelector('#app'))

root.render(<App />)
