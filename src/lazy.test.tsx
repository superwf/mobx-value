import { act, render } from '@testing-library/react'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'

import { getMobx } from './mobx'
import { noop } from './noop'
import { sleep } from './sleep'

import { lazy, mobxLazy } from '.'

describe('lazyProperty', () => {
  const { autorun, isObservable, observable, onBecomeObserved, onBecomeUnobserved } = getMobx()

  let mockRequest = jest.fn(() =>
    Promise.resolve({
      name: 'abc',
    }),
  )

  let user = lazy({ value: { name: '' }, request: mockRequest, name: 'lazy test case value user' })

  beforeEach(() => {
    mockRequest = jest.fn(() =>
      Promise.resolve({
        name: 'abc',
      }),
    )
    user = lazy({ value: { name: '' }, request: mockRequest })
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
    expect(user.requested).toBe(true)
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

  it('default debounce，only request once', async () => {
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
    const user1 = lazy({ value: { name: '' }, request: spy })
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

  it('catch when request occurs error', async () => {
    const errorUser = lazy({
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

  it('refresh debounce', async () => {
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

    const callTime = lazy({ value: '', request: mockRequestLazy })
    const dispose = autorun(() => {
      noop(callTime.value)
    })
    callTime.ready.catch(noop)
    callTime.refresh()
    await sleep(20)
    expect(callTime.value).toBe('first')
    dispose()
  })

  describe('use shallow for annotation', () => {
    it('指定shallow', () => {
      const notRecursiveUser = lazy({
        value: { box: [1, 2, 3] },
        request: () => Promise.resolve({ box: [4, 5, 6] }),
        annotation: observable.shallow,
      })
      expect(isObservable(notRecursiveUser.value.box)).toBe(false)
    })

    it('default observable', () => {
      const notRecursiveUser = lazy({
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
    const lazyData = lazy({ value: '', request: mockRequestLazy })
    lazyData.cancel()
    expect(lazyData.loading).toBe(false)
    autorun(() => noop(lazyData.value))
    expect(lazyData.loading).toBe(true)
    expect(lazyData.value).toBe('')
    let isReady = false
    lazyData.ready
      .then(() => {
        isReady = true
      })
      .catch(noop)
    lazyData.cancel()
    await sleep(30)
    expect(lazyData.value).toBe('')
    expect(isReady).toBe(false)
  })

  describe('work in react', () => {
    it('mount component', async () => {
      const user1 = lazy({ value: { name: '' }, request: mockRequest, autoRestoreOnBecomeUnobserved: true })

      const Comp: FC = observer(() => {
        if (user1.value.name) {
          return <b id="content">has a name</b>
        }
        return <b id="content">no name</b>
      })
      const app = render(<Comp />)
      await act(async () => {
        await user1.ready
      })
      const node = await app.findByText('has a name')
      expect(node.textContent).toBe('has a name')
      expect(user1.value.name).toBe('abc')
      app.unmount()
      expect(user1.value.name).toBe('')
      user1.reset()
    })

    it('mount component use alias autoRestore', async () => {
      const user1 = lazy({ value: { name: '' }, request: mockRequest, autoRestore: true })

      const Comp: FC = observer(() => {
        if (user1.value.name) {
          return <b id="content">has a name</b>
        }
        return <b id="content">no name</b>
      })
      const app = render(<Comp />)
      await act(async () => {
        await user1.ready
      })
      const node = await app.findByText('has a name')
      expect(node.textContent).toBe('has a name')
      expect(user1.value.name).toBe('abc')
      app.unmount()
      expect(user1.value.name).toBe('')
      user1.reset()
    })

    it('set auto restore when not observed', async () => {
      const user1 = lazy({ value: { name: '' }, request: mockRequest, autoRestoreOnBecomeUnobserved: true })

      const Comp: FC = observer(() => {
        if (user1.value.name) {
          return <b id="content">has a name</b>
        }
        return <b id="content">no name</b>
      })
      const mockOnObserved = jest.fn()
      const mockOnUnobserved = jest.fn()
      const stop1 = onBecomeObserved(user1, 'value', mockOnObserved)
      const stop2 = onBecomeUnobserved(user1, 'value', mockOnUnobserved)

      expect(mockOnObserved).not.toHaveBeenCalled()
      expect(mockOnUnobserved).not.toHaveBeenCalled()

      const app = render(<Comp />)
      expect(user1.value.name).toBe('')
      await app.findByText('no name')
      // await user1.ready
      expect(mockOnObserved).toHaveBeenCalledTimes(1)
      expect(mockOnUnobserved).not.toHaveBeenCalled()
      expect(user1.value.name).toBe('abc')

      app.unmount()
      expect(mockOnUnobserved).toHaveBeenCalledTimes(1)
      expect(user1.value.name).toBe('')

      stop1()
      stop2()
    })

    it('set auto restore when not observed, use alias autoRestore', async () => {
      const user1 = lazy({ value: { name: '' }, request: mockRequest, autoRestore: true })

      const Comp: FC = observer(() => {
        if (user1.value.name) {
          return <b id="content">has a name</b>
        }
        return <b id="content">no name</b>
      })
      const mockOnObserved = jest.fn()
      const mockOnUnobserved = jest.fn()
      const stop1 = onBecomeObserved(user1, 'value', mockOnObserved)
      const stop2 = onBecomeUnobserved(user1, 'value', mockOnUnobserved)

      expect(mockOnObserved).not.toHaveBeenCalled()
      expect(mockOnUnobserved).not.toHaveBeenCalled()

      const app = render(<Comp />)
      expect(user1.value.name).toBe('')
      await app.findByText('no name')
      // await user1.ready
      expect(mockOnObserved).toHaveBeenCalledTimes(1)
      expect(mockOnUnobserved).not.toHaveBeenCalled()
      expect(user1.value.name).toBe('abc')

      app.unmount()
      expect(mockOnUnobserved).toHaveBeenCalledTimes(1)
      expect(user1.value.name).toBe('')

      stop1()
      stop2()
    })
  })

  it('short alias', () => {
    expect(lazy).toBe(mobxLazy)
  })
})
