import { Layout, Menu } from 'antd'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import { Link } from 'react-router-dom'

import { router } from '../router'

export const Sider: FC = observer(() => (
  <Layout.Sider width="280">
    <Menu theme="dark" defaultSelectedKeys={[router.location.pathname]} mode="inline">
      <Menu.Item key="/api">
        <Link to="/api">api</Link>
      </Menu.Item>
      <Menu.Item key="/mobxSetter">
        <Link to="/mobxSetter">mobxSetter</Link>
      </Menu.Item>
      <Menu.Item key="/mobxSetterAutoRestore">
        <Link to="/mobxSetterAutoRestore">mobxSetter auto restore</Link>
      </Menu.Item>
      <Menu.Item key="/mobxBoolean">
        <Link to="/mobxBoolean">mobxBoolean</Link>
      </Menu.Item>
      <Menu.Item key="/mobxBooleanAutoRestore">
        <Link to="/mobxBooleanAutoRestore">mobxBoolean auto restore</Link>
      </Menu.Item>
      <Menu.Item key="/mobxRequest">
        <Link to="/mobxRequest">mobxRequest</Link>
      </Menu.Item>
      <Menu.Item key="/mobxRequestAutoRestore">
        <Link to="/mobxRequestAutoRestore">mobxRequest auto restore</Link>
      </Menu.Item>
      <Menu.Item key="/mobxRequestDefaultPreventParallel">
        <Link to="/mobxRequestDefaultPreventParallel">mobxRequest default prevent parallel</Link>
      </Menu.Item>
      <Menu.Item key="/mobxRequestAllowParallel">
        <Link to="/mobxRequestAllowParallel">mobxRequest allow parallel</Link>
      </Menu.Item>
      <Menu.Item key="/mobxRequestAutoCancel">
        <Link to="/mobxRequestAutoCancel">mobxRequest auto cancel</Link>
      </Menu.Item>
      <Menu.Item key="/mobxLazy">
        <Link to="/mobxLazy">mobxLazy</Link>
      </Menu.Item>
      <Menu.Item key="/multipleInstance">
        <Link to="/multipleInstance">multiple instance in one page</Link>
      </Menu.Item>
    </Menu>
  </Layout.Sider>
))
