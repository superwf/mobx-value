/* eslint-disable max-classes-per-file */
import { autorun, isObservable, observable, onBecomeObserved, onBecomeUnobserved, runInAction } from 'mobx'

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

  it('default, no auto restore when not observed', () => {
    const a = mobxSetter({ value: 1 })
    const mockOnObserved = jest.fn()
    const mockOnUnobserved = jest.fn()
    const stop1 = onBecomeObserved(a, 'value', mockOnObserved)
    expect(mockOnObserved).not.toHaveBeenCalled()
    const dispose1 = autorun(() => {
      expect(a.value).toBe(1)
      a.set(2)
    })
    const dispose2 = autorun(() => {
      expect(a.value).toBe(2)
    })
    expect(mockOnObserved).toHaveBeenCalledTimes(1)
    const stop2 = onBecomeUnobserved(a, 'value', mockOnUnobserved)
    expect(mockOnUnobserved).not.toHaveBeenCalled()
    dispose1()
    dispose2()
    expect(a.value).toBe(2)
    expect(mockOnUnobserved).toHaveBeenCalledTimes(1)

    stop1()
    stop2()
  })

  it('set auto restore when not observed', () => {
    const a = mobxSetter({ value: 1, autoRestoreWhenNotObserved: true })
    const mockOnObserved = jest.fn()
    const mockOnUnobserved = jest.fn()
    const stop1 = onBecomeObserved(a, 'value', mockOnObserved)
    expect(mockOnObserved).not.toHaveBeenCalled()
    const dispose1 = autorun(() => {
      expect(a.value).toBe(1)
      a.set(2)
    })
    const dispose2 = autorun(() => {
      expect(a.value).toBe(2)
    })
    expect(mockOnObserved).toHaveBeenCalledTimes(1)
    const stop2 = onBecomeUnobserved(a, 'value', mockOnUnobserved)
    expect(mockOnUnobserved).not.toHaveBeenCalled()
    dispose1()
    dispose2()
    expect(a.value).toBe(1)
    expect(mockOnUnobserved).toHaveBeenCalledTimes(1)

    stop1()
    stop2()
  })
})
