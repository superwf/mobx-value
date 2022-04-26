import { Layout } from 'antd'
import { observer } from 'mobx-react-lite'
import raw from 'raw.macro'
import type { FC } from 'react'
import * as React from 'react'
import { Route, Router, Routes } from 'react-router-dom'

import { Sider } from './Sider'

import { Home } from '../Home'
import { MobxBoolean } from '../MobxBoolean'
import { MobxBooleanAutoRestore } from '../MobxBooleanAutoRestore'
import { MobxLazy } from '../MobxLazy'
import { MobxRequest } from '../MobxRequest'
import { MobxRequestAllowParallel } from '../MobxRequestAllowParallel'
import { MobxRequestAutoCancel } from '../MobxRequestAutoCancel'
import { MobxRequestAutoRestore } from '../MobxRequestAutoRestore'
import { MobxRequestDefaultPreventParallel } from '../MobxRequestDefaultPreventParallel'
import { MobxSetter } from '../MobxSetter'
import { MobxSetterAutoRestore } from '../MobxSetterAutoRestore'
import { MultipleInstance } from '../MultipleInstance'
import { RenderWithSourceCode } from '../RenderWithSourceCode'
import { router } from '../router'

const setterCode = raw('../MobxSetter.tsx')
const setterAutoRestoreCode = raw('../MobxSetterAutoRestore.tsx')
const booleanCode = raw('../MobxBoolean.tsx')
const booleanAutoRestoreCode = raw('../MobxBooleanAutoRestore.tsx')
const requestCode = raw('../MobxRequest.tsx')
const requestAutoRestoreCode = raw('../MobxRequestAutoRestore.tsx')
const requestDefaultPreventParallelCode = raw('../MobxRequestDefaultPreventParallel.tsx')
const requestAllowParallelCode = raw('../MobxRequestAllowParallel.tsx')
const requestAutoCancelCode = raw('../MobxRequestAutoCancel.tsx')
const lazyCode = raw('../MobxLazy.tsx')
const multipleInstanceCode = raw('../MultipleInstance.tsx')

const { Content } = Layout

export const App: FC = observer(() => {
  const [state, setState] = React.useState({
    action: router.history.action,
    location: router.history.location,
  })
  React.useLayoutEffect(() => {
    router.history.listen(({ action, location }) => {
      setState({ action, location })
    })
  }, [])
  return (
    <Router navigator={router.history} location={state.location} navigationType={state.action}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider />
        <Layout>
          <Content>
            <Routes>
              <Route path="/api" element={<Home />} />
              <Route path="/mobxSetter" element={<RenderWithSourceCode code={setterCode} Component={MobxSetter} />} />
              <Route
                path="/mobxSetterAutoRestore"
                element={<RenderWithSourceCode code={setterAutoRestoreCode} Component={MobxSetterAutoRestore} />}
              />
              <Route
                path="/mobxBoolean"
                element={<RenderWithSourceCode code={booleanCode} Component={MobxBoolean} />}
              />
              <Route
                path="/mobxBooleanAutoRestore"
                element={<RenderWithSourceCode code={booleanAutoRestoreCode} Component={MobxBooleanAutoRestore} />}
              />
              <Route
                path="/mobxRequest"
                element={<RenderWithSourceCode code={requestCode} Component={MobxRequest} />}
              />
              <Route
                path="/mobxRequestAutoRestore"
                element={<RenderWithSourceCode code={requestAutoRestoreCode} Component={MobxRequestAutoRestore} />}
              />
              <Route
                path="/mobxRequestDefaultPreventParallel"
                element={
                  <RenderWithSourceCode
                    code={requestDefaultPreventParallelCode}
                    Component={MobxRequestDefaultPreventParallel}
                  />
                }
              />
              <Route
                path="/mobxRequestAllowParallel"
                element={<RenderWithSourceCode code={requestAllowParallelCode} Component={MobxRequestAllowParallel} />}
              />
              <Route
                path="/mobxRequestAutoCancel"
                element={<RenderWithSourceCode code={requestAutoCancelCode} Component={MobxRequestAutoCancel} />}
              />
              <Route path="/mobxLazy" element={<RenderWithSourceCode code={lazyCode} Component={MobxLazy} />} />
              <Route
                path="/multipleInstance"
                element={<RenderWithSourceCode code={multipleInstanceCode} Component={MultipleInstance} />}
              />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  )
})
