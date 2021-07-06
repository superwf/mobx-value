import { mount } from 'enzyme'
import { noop } from 'lodash'
import { autorun, isObservable, observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'

import { sleep } from './sleep'

import { mobxLazy } from '.'

describe('lazyProperty', () => {
  let mockRequest = jest.fn(() =>
    Promise.resolve({
      name: 'abc',
    }),
  )

  let user = mobxLazy({ value: { name: '' }, request: mockRequest })

  beforeEach(() => {
    mockRequest = jest.fn(() =>
      Promise.resolve({
        name: 'abc',
      }),
    )
    user = mobxLazy({ value: { name: '' }, request: mockRequest })
  })

  it('test lazy init value', () => {
    expect(user.loading).toBe(false)
    const dispose = autorun(() => {
      expect(user.value).toEqual({ name: '' })
    })
    expect(user.loading).toBe(true)
    dispose()
  })

  it('current is value alias', () => {
    expect(user.value).toBe(user.value)
  })

  it('restore', async () => {
    expect(user.loading).toBe(false)
    const dispose = autorun(() => {
      if (user.requested && !user.loading) {
        expect(user.value).toEqual({ name: 'abc' })
      } else {
        expect(user.value).toEqual({ name: '' })
      }
    })
    expect(user.loading).toBe(true)
    await user.ready
    expect(user.loading).toBe(false)
    expect(user.value).toEqual({ name: 'abc' })
    dispose()
    user.restore()
    expect(user.loading).toBe(false)
    expect(user.requested).toBe(true)
    expect(user.value).toEqual({ name: '' })
  })

  it('reset', async () => {
    expect(user.loading).toBe(false)
    const dispose = autorun(() => {
      if (user.requested && !user.loading) {
        expect(user.value).toEqual({ name: 'abc' })
      } else {
        expect(user.value).toEqual({ name: '' })
      }
    })
    expect(user.loading).toBe(true)
    await user.ready
    expect(user.loading).toBe(false)
    expect(user.value).toEqual({ name: 'abc' })
    dispose()
    user.reset()
    expect(user.loading).toBe(false)
    expect(user.requested).toBe(false)
    expect(user.value).toEqual({ name: '' })
  })

  it('refresh', async () => {
    const dispose = autorun(() => {
      noop(user.value.name)
    })
    await user.ready
    expect(user.value).toEqual({ name: 'abc' })
    expect(user.loading).toBe(false)
    user.refresh()
    expect(user.loading).toBe(true)
    await user.ready
    expect(user.value).toEqual({ name: 'abc' })
    expect(user.loading).toBe(false)
    dispose()
  })

  it('如果已经在请求状态，由于默认防抖，只请求一次', async () => {
    user.refresh()
    const dispose = autorun(() => {
      noop(user.value.name)
    })
    expect(mockRequest).toHaveBeenCalledTimes(1)
    user.refresh()
    expect(mockRequest).toHaveBeenCalledTimes(1)
    await user.ready
    expect(mockRequest).toHaveBeenCalledTimes(1)
    dispose()
  })

  it('two lazy property should all work', async () => {
    const spy = jest.fn(() => Promise.resolve({ name: 'def' }))
    const user1 = mobxLazy({ value: { name: '' }, request: spy })
    const dispose = autorun(() => {
      if (user.requested && !user.loading) {
        expect(user.value).toEqual({ name: 'abc' })
      } else {
        expect(user.value).toEqual({ name: '' })
      }
      if (user1.requested && !user1.loading) {
        expect(user1.value).toEqual({ name: 'def' })
      } else {
        expect(user1.value).toEqual({ name: '' })
      }
    })
    // expect(user.value).toEqual(user1.value)
    // expect(user.value).toEqual({ name: '' })
    // expect(user.loading).toBe(true)
    await Promise.all([user.ready, user1.ready])
    expect(user1.loading).toBe(false)
    dispose()
  })

  it('获取数据出错时catch', async () => {
    const errorUser = mobxLazy({
      value: { name: '' },
      request: () => Promise.reject(new Error('fetch error')),
    })
    expect(errorUser.loading).toBe(false)
    const dispose = autorun(() => {
      expect(errorUser.value).toEqual({ name: '' })
    })
    expect(errorUser.value).toEqual({ name: '' })
    expect(errorUser.loading).toBe(true)
    dispose()
    await errorUser.ready.catch(e => {
      expect(e.toString()).toBe('Error: fetch error')
    })
  })

  it('refresh连续执行，后面的refresh会被防抖忽略', async () => {
    let firstInvoke = true
    async function mockRequestLazy() {
      let resolveValue = 'first'
      if (firstInvoke) {
        resolveValue = 'first'
        firstInvoke = false
        await sleep(15)
      } else {
        resolveValue = 'second'
        await sleep(5)
      }
      return resolveValue
    }

    const callTime = mobxLazy({ value: '', request: mockRequestLazy })
    const dispose = autorun(() => {
      noop(callTime.value)
    })
    callTime.ready.catch(noop)
    callTime.refresh()
    await sleep(20)
    expect(callTime.value).toBe('first')
    dispose()
  })

  describe('测试annotation为shallow', () => {
    it('指定shallow', () => {
      const notRecursiveUser = mobxLazy({
        value: { box: [1, 2, 3] },
        request: () => Promise.resolve({ box: [4, 5, 6] }),
        annotation: observable.shallow,
      })
      expect(isObservable(notRecursiveUser.value.box)).toBe(false)
    })

    it('默认不指定为observable', () => {
      const notRecursiveUser = mobxLazy({
        value: { box: [1, 2, 3] },
        request: () => Promise.resolve({ box: [4, 5, 6] }),
      })
      expect(isObservable(notRecursiveUser.value.box)).toBe(true)
    })
  })

  it('cancel', async () => {
    async function mockRequestLazy() {
      await sleep(20)
      return 'ok'
    }
    const lazy = mobxLazy({ value: '', request: mockRequestLazy })
    lazy.cancel()
    expect(lazy.loading).toBe(false)
    autorun(() => noop(lazy.value))
    expect(lazy.loading).toBe(true)
    expect(lazy.value).toBe('')
    let isReady = false
    lazy.ready
      .then(() => {
        isReady = true
      })
      .catch(noop)
    lazy.cancel()
    await sleep(30)
    expect(lazy.value).toBe('')
    expect(isReady).toBe(false)
  })

  describe('work in react', () => {
    it('mount component', async () => {
      const Comp: FC = observer(() => {
        if (user.value.name) {
          return <b>has a name</b>
        }
        return <b>no name</b>
      })
      const app = mount(<Comp />)
      expect(app.text()).toBe('no name')
      await user.ready
      app.update()
      expect(app.text()).toBe('has a name')
      app.unmount()
    })
  })
})
