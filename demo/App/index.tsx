import { Layout } from 'antd'
import { observer } from 'mobx-react-lite'
import raw from 'raw.macro'
import type { FC } from 'react'
import { Route, Router, Switch } from 'react-router-dom'

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

const { Content } = Layout

export const App: FC = observer(() => (
  <Router history={router.history}>
    <Layout style={{ minHeight: '100vh' }}>
      <Sider />
      <Layout>
        <Content>
          <Switch location={router.location}>
            <Route path="/api" component={Home} />
            <Route
              path="/mobxSetter"
              component={() => <RenderWithSourceCode code={setterCode} Component={MobxSetter} />}
            />
            <Route
              path="/mobxSetterAutoRestore"
              component={() => <RenderWithSourceCode code={setterAutoRestoreCode} Component={MobxSetterAutoRestore} />}
            />
            <Route
              path="/mobxBoolean"
              component={() => <RenderWithSourceCode code={booleanCode} Component={MobxBoolean} />}
            />
            <Route
              path="/mobxBooleanAutoRestore"
              component={() => (
                <RenderWithSourceCode code={booleanAutoRestoreCode} Component={MobxBooleanAutoRestore} />
              )}
            />
            <Route
              path="/mobxRequest"
              component={() => <RenderWithSourceCode code={requestCode} Component={MobxRequest} />}
            />
            <Route
              path="/mobxRequestAutoRestore"
              component={() => (
                <RenderWithSourceCode code={requestAutoRestoreCode} Component={MobxRequestAutoRestore} />
              )}
            />
            <Route
              path="/mobxRequestDefaultPreventParallel"
              component={() => (
                <RenderWithSourceCode
                  code={requestDefaultPreventParallelCode}
                  Component={MobxRequestDefaultPreventParallel}
                />
              )}
            />
            <Route
              path="/mobxRequestAllowParallel"
              component={() => (
                <RenderWithSourceCode code={requestAllowParallelCode} Component={MobxRequestAllowParallel} />
              )}
            />
            <Route
              path="/mobxRequestAutoCancel"
              component={() => <RenderWithSourceCode code={requestAutoCancelCode} Component={MobxRequestAutoCancel} />}
            />
            <Route path="/mobxLazy" component={() => <RenderWithSourceCode code={lazyCode} Component={MobxLazy} />} />
          </Switch>
        </Content>
      </Layout>
    </Layout>
  </Router>
))
