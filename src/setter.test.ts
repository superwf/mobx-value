/* eslint-disable max-classes-per-file */
import { autorun, runInAction, isObservable } from 'mobx'

import { mobxSetter } from './setter'

describe('setter', () => {
  const n = mobxSetter({ value: 1 })

  it('test setter', () => {
    expect(n.value).toBe(1)
    const spy = jest.fn()
    const dispose = autorun(() => {
      if (n.value > 1) {
        spy()
      }
    })
    n.set(3)
    expect(spy).toHaveBeenCalled()
    expect(n.value).toBe(3)
    n.restore()
    expect(n.value).toBe(1)
    dispose()
  })

  it('multi instance', () => {
    const b = mobxSetter({ value: 3 })
    expect(n.value).toBe(1)
    expect(b.value).toBe(3)
    n.set(2)
    expect(n.value).toBe(2)
    expect(b.value).toBe(3)
  })

  it('object value, default: recursive false', () => {
    const b = mobxSetter({
      value: [
        0,
        {
          name: 'x',
        },
      ] as [number, { name: string }],
    })
    const spy = jest.fn()
    expect(b.value).toEqual([
      0,
      {
        name: 'x',
      },
    ])
    expect(isObservable(b.value[1])).toBe(false)
    const dispose = autorun(() => {
      if (b.value[1].name !== 'x') {
        spy()
      }
    })
    expect(spy).not.toHaveBeenCalled()
    runInAction(() => {
      b.value[1].name = 'newName'
    })
    expect(b.value).toEqual([
      0,
      {
        name: 'newName',
      },
    ])
    expect(spy).not.toHaveBeenCalled()
    dispose()
  })

  it('object value, default: recursive true', () => {
    const b = mobxSetter({
      value: [
        0,
        {
          name: 'x',
        },
      ] as [number, { name: string }],
      recursive: true,
    })
    const spy = jest.fn()
    expect(b.value).toEqual([
      0,
      {
        name: 'x',
      },
    ])
    expect(isObservable(b.value[1])).toBe(true)
    const dispose = autorun(() => {
      if (b.value[1].name !== 'x') {
        spy()
      }
    })
    expect(spy).not.toHaveBeenCalled()
    runInAction(() => {
      b.value[1].name = 'newName'
    })
    expect(b.value).toEqual([
      0,
      {
        name: 'newName',
      },
    ])
    expect(spy).toHaveBeenCalled()
    dispose()
  })
})
