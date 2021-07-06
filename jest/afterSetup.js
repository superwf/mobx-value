import 'jest-enzyme'
import { noop } from 'lodash'
import fetchMock from 'fetch-mock'

import { queryForm } from '../src/store/queryForm'
import { router } from '../src/store/router'
import './extend/isStructureEqual'

afterEach(() => {
  fetchMock.restore()
  router.push('/')
  queryForm.query = {}
})

// 抑制validator报错
beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(noop)
  // jest.spyOn(console, 'error').mockImplementation(noop)
})
