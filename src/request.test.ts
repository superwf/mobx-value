import { noop } from 'lodash'
import { isObservable, observable } from 'mobx'

import { sleep } from './sleep'

import { mobxRequest } from '.'

describe('requestProperty', () => {
  function mockFetch(param?: {
    path: { id: number }
    body: {
      name: string
    }
  }) {
    const name = param?.body?.name
    return Promise.resolve({
      name: name?.repeat(2),
    })
  }

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

  it('fetch', done => {
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

  it('默认annotation为observable', () => {
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
    const mock = jest.fn(() => Promise.reject(new Error('request error')))
    const user = mobxRequest({ value: { name: '' }, request: mock })
    await user.request().catch(e => {
      expect(e).toBeInstanceOf(Error)
      expect(e.message).toBe('request error')
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

  it('when request many times, each request will auto cancel prev one', done => {
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
})
