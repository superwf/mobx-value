import { RouterStore } from '@superwf/mobx-react-router'
import { createBrowserHistory } from 'history'

const history = createBrowserHistory()
export const router = new RouterStore(history)
