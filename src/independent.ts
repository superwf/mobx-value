import * as mobx from 'mobx'
import * as mobxReactLite from 'mobx-react-lite'

import indexExport from './index'

mobx.configure({ isolateGlobalState: true })

export * from './index'

export { mobx, mobxReactLite }
export default {
  mobx,
  mobxReactLite,
  ...indexExport,
}
