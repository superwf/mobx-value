import { render } from '@testing-library/react'
import { noop } from 'lodash'
import { autorun, isObservable, observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'

import { mobxLazy } from './lazy'
import { sleep } from './sleep'

describe('lazyProperty', () => {
  function mockRequest() {
    return Promise.resolve({
      name: 'abc',
    })
  }

  const user = mobxLazy({ value: { name: '' }, request: mockRequest })

  afterEach(() => {
    user.reset()
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

  it('refresh', async () => {
    const dispose = autorun(() => {
      console.log(user.value.name)
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

  it('refresh连续执行，后面的refresh先执行完，前面的refresh后执行，确保最后调用的refresh的值是最终值', async () => {
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
      console.log(callTime.value)
    })
    callTime.ready.catch(noop)
    callTime.refresh()
    await sleep(20)
    expect(callTime.value).toBe('second')
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

  it('测试cancel', async () => {
    async function mockRequestLazy() {
      await sleep(20)
      return 'ok'
    }
    const lazy = mobxLazy({ value: '', request: mockRequestLazy })
    expect(lazy.value).toBe('')
    let isReady = false
    ;(async () => {
      await lazy.ready
      isReady = true
    })()
    try {
      lazy.cancel()
      await lazy.requestResult
      // eslint-disable-next-line no-empty
    } catch {}
    await sleep(30)
    expect(lazy.value).toBe('')
    expect(isReady).toBe(false)
  })

  describe('react组件中的表现', () => {
    it('挂载组件', async () => {
      const Comp: FC = observer(() => {
        if (user.value.name) {
          return <b>has a name</b>
        }
        return <b>no name</b>
      })
      const app = render(<Comp />)
      expect(app.container.textContent).toBe('no name')
      await user.ready
      app.rerender(<Comp />)
      expect(app.container.textContent).toBe('has a name')
      app.unmount()
    })
  })
})
