import { noop } from 'lodash'
import { autorun, isObservable, observable, onBecomeObserved, onBecomeUnobserved } from 'mobx'

import { sleep } from './sleep'

import { mobxRequest, request } from '.'

describe('requestProperty', () => {
  const mockFetch = jest.fn(
    (param?: {
      path: { id: number }
      body: {
        name: string
      }
    }) => {
      const name = param?.body?.name
      return Promise.resolve({
        name: name?.repeat(2),
      })
    },
  )

  afterEach(() => {
    mockFetch.mockClear()
  })

  it('test setter', () => {
    const user = mobxRequest({ value: { name: '' }, request: mockFetch })
    expect(user.value).toEqual({ name: '' })
    expect(user.loading).toBe(false)
  })

  it('multi instance', () => {
    const user = mobxRequest({ value: { name: '' }, request: mockFetch })
    const user1 = mobxRequest({ value: { name: '' }, request: mockFetch })
    expect(user.loading).toBe(false)
    expect(user1.loading).toBe(false)
    user.request({ path: { id: 1 }, body: { name: 'ad' } })
    expect(user.loading).toBe(true)
    expect(user1.loading).toBe(false)
  })

  it('request data', done => {
    const user = mobxRequest({ value: { name: '' }, request: mockFetch })
    user
      .request({
        path: {
          id: 23,
        },
        body: {
          name: 'xxx',
        },
      })
      .then(() => {
        expect(user.value).toEqual({ name: 'xxxxxx' })

        user.restore()
        expect(user.value).toEqual({ name: '' })
        expect(user.loading).toBe(false)
        done()
      })
    expect(user.loading).toBe(true)
  })

  it('refresh', () => {
    const user = mobxRequest({ value: { name: '' }, request: mockFetch })
    expect(mockFetch).toHaveBeenCalledTimes(0)
    const req = user.refresh()
    req.catch(noop)
    expect(mockFetch).toHaveBeenCalledTimes(1)
    req.cancel()
  })

  it('fetch and restore at once', done => {
    const user = mobxRequest({ value: { name: '' }, request: mockFetch })
    const req = user.request({
      path: {
        id: 23,
      },
      body: {
        name: 'xxx',
      },
    })
    req.catch(() => {
      done()
    })
    expect(user.loading).toBe(true)
    req.cancel()
    expect(user.loading).toBe(false)
  })

  it('default annotation is observable', () => {
    const mock = jest.fn(() =>
      Promise.resolve({
        name: '',
        box: [],
      }),
    )
    const user = mobxRequest({ value: { name: '', box: [] }, request: mock })
    const user1 = mobxRequest({ value: { name: '', box: [] }, request: mock, annotation: observable.shallow })
    expect(isObservable(user.value.box)).toBe(true)
    expect(isObservable(user1.value.box)).toBe(false)
  })

  it('catch error', async () => {
    const e = new Error('request error')
    const mock = jest.fn(() => Promise.reject(e))
    const user = mobxRequest({ value: { name: '' }, request: mock })
    await user.request().catch(err => {
      expect(err).toBeInstanceOf(Error)
      expect(user.error).toBe(e)
      expect(err.message).toBe(e.message)
    })
  })

  it('cancel current request', done => {
    const mock = jest.fn(() => Promise.resolve('abc'))
    const name = mobxRequest({ value: '', request: mock })
    name.request().catch(noop)
    expect(name.value).toBe('')
    name.cancel()
    setTimeout(() => {
      expect(name.value).toBe('')
      done()
    })
  })

  it('more requests cancel', done => {
    let i = 0
    const mock = jest.fn(async () => {
      i += 1
      const j = i
      await sleep(j * 10)
      return Promise.resolve(j)
    })
    const user = mobxRequest({ value: 0, request: mock })
    const req1 = user.request()
    req1.catch(noop)
    req1.cancel()

    const req2 = user.request()
    req2.catch(noop)
    req2.cancel()

    user.request().then(() => {
      expect(user.value).toBe(3)
      done()
    })
  })

  it('default no parallel', async () => {
    const mock = jest.fn(() => Promise.resolve('abc'))
    const name = mobxRequest({ value: '', request: mock })
    await Promise.all([name.request(), name.request(), name.request()])
    expect(name.value).toBe('abc')
    expect(mock).toHaveBeenCalledTimes(1)
  })

  it('with parallel', async () => {
    const mock = jest.fn(() => Promise.resolve('abc'))
    const name = mobxRequest({ value: '', request: mock, parallel: true })
    await Promise.all([name.request().catch(noop), name.request().catch(noop), name.request().catch(noop)])
    expect(name.value).toBe('abc')
    expect(mock).toHaveBeenCalledTimes(3)
  })

  it('set auto restore when not observed', async () => {
    const mock = jest.fn(() => Promise.resolve('a'))
    const name = mobxRequest({ value: '', request: mock, parallel: true, autoRestoreOnBecomeUnobserved: true })
    const mockOnObserved = jest.fn()
    const mockOnUnobserved = jest.fn()
    const stop1 = onBecomeObserved(name, 'value', mockOnObserved)
    expect(mockOnObserved).not.toHaveBeenCalled()
    expect(name.value).toBe('')
    await name.request()
    const dispose1 = autorun(() => {
      expect(name.value).toBe('a')
    })
    expect(mockOnObserved).toHaveBeenCalledTimes(1)
    const stop2 = onBecomeUnobserved(name, 'value', mockOnUnobserved)
    expect(mockOnUnobserved).not.toHaveBeenCalled()
    dispose1()
    expect(name.value).toBe('')
    expect(mockOnUnobserved).toHaveBeenCalledTimes(1)

    stop1()
    stop2()
  })

  it('set auto cancel when not observed', async () => {
    const mock = jest.fn(() => new Promise(resolve => setTimeout(() => resolve('aaa'), 10)))
    const name = mobxRequest({ value: '', request: mock, parallel: true, autoCancelOnBecomeUnobserved: true })
    const mockOnObserved = jest.fn()
    const mockOnUnobserved = jest.fn()
    const stop1 = onBecomeObserved(name, 'value', mockOnObserved)
    const stop2 = onBecomeUnobserved(name, 'value', mockOnUnobserved)
    expect(name.value).toBe('')
    const requestPromise = name.request()
    requestPromise.catch(noop)
    expect(name.loading).toBe(true)
    const spy = jest.spyOn(requestPromise, 'cancel')
    const dispose1 = autorun(() => {
      expect(name.value).toBe('')
    })
    expect(mockOnObserved).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledTimes(0)
    expect(name.value).toBe('')
    dispose1()
    expect(mockOnUnobserved).toHaveBeenCalledTimes(1)
    expect(name.loading).toBe(false)
    await sleep(30)
    expect(name.value).toBe('')
    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()

    stop1()
    stop2()
  })

  it('short alias', () => {
    expect(request).toBe(mobxRequest)
  })
})
