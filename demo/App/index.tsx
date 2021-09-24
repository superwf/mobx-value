import { Layout } from 'antd'
import { observer } from 'mobx-react-lite'
import raw from 'raw.macro'
import type { FC } from 'react'
import { Route, Router, Switch } from 'react-router-dom'

import { Sider } from './Sider'

import { MobxBoolean } from '../MobxBoolean'
import { MobxBooleanAutoRestore } from '../MobxBooleanAutoRestore'
import { MobxRequest } from '../MobxRequest'
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
const requestDefaultPreventParallelCode = raw('../MobxRequestDefaultPreventParallel.tsx')

const { Content } = Layout

export const App: FC = observer(() => (
  <Router history={router.history}>
    <Layout style={{ minHeight: '100vh' }}>
      <Sider />
      <Layout>
        <Content>
          <Switch location={router.location}>
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
              path="/mobxRequestDefaultPreventParallel"
              component={() => (
                <RenderWithSourceCode
                  code={requestDefaultPreventParallelCode}
                  Component={MobxRequestDefaultPreventParallel}
                />
              )}
            />
          </Switch>
        </Content>
      </Layout>
    </Layout>
  </Router>
))
