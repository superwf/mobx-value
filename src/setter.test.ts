/* eslint-disable max-classes-per-file */
import { autorun, isObservable, observable, runInAction } from 'mobx'

import { mobxSetter } from '.'

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

  it('object value, default decorator is observer', () => {
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

  it('object value, decorator shallow', () => {
    const b = mobxSetter({
      value: [
        0,
        {
          name: 'x',
        },
      ] as [number, { name: string }],
      annotation: observable.shallow,
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
})
