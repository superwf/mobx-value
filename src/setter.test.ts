/* eslint-disable max-classes-per-file */
import { getMobx } from './mobx'

import { mobxSetter, setter } from '.'

describe('setter', () => {
  const { autorun, isObservable, observable, onBecomeObserved, onBecomeUnobserved, runInAction } = getMobx()

  const n = mobxSetter({ value: 1, name: 'test case n' })

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
    const b = mobxSetter<number>({ value: 3 })
    expect(n.value).toBe(1)
    expect(b.value).toBe(3)
    n.set(2)
    expect(n.value).toBe(2)
    expect(b.value).toBe(3)
    n.restore()
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
    const a = mobxSetter({ value: 1, autoRestoreOnBecomeUnobserved: true })
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

  it('alias autoRestore', () => {
    const a = mobxSetter({ value: 1, autoRestore: true })
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

  it('short alias', () => {
    expect(setter).toBe(mobxSetter)
  })

  describe('test primitive parameter', () => {
    it('test setter number', () => {
      const m = setter(1)
      expect(m.value).toBe(1)
      const spy = jest.fn()
      const dispose = autorun(() => {
        if (m.value > 1) {
          spy()
        }
      })
      m.set(3)
      expect(spy).toHaveBeenCalled()
      expect(m.value).toBe(3)
      m.restore()
      expect(m.value).toBe(1)
      dispose()
    })

    it('test setter string', () => {
      const m = setter('')
      expect(m.value).toBe('')
      const spy = jest.fn()
      const dispose = autorun(() => {
        spy(m.value)
      })
      expect(spy).toHaveBeenCalledTimes(1)
      m.set('a')
      expect(spy).toHaveBeenCalledTimes(2)
      expect(m.value).toBe('a')
      m.restore()
      expect(spy).toHaveBeenCalledTimes(3)
      expect(m.value).toBe('')
      dispose()
    })

    it('type reflection', () => {
      const n1 = setter('')
      n1.set('')
      const n2 = setter<string>('')
      n2.set('')
      const n3 = setter<string>('')
      n3.set('')
      const n4 = setter<string>({ value: '' })
      n4.set('')
      const n5 = setter(null)
      n5.set(null)
      const n6 = setter(undefined)
      n6.set(undefined)
      const n7 = setter(Symbol('a'))
      n7.set(Symbol('b'))
      const n8 = setter<symbol>(Symbol('a'))
      n8.set(Symbol('b'))
      expect('type refrelection ok').toBe('type refrelection ok')
    })

    it('call set with function type', () => {
      expect(n.value).toBe(1)

      n.set(prev => prev + 1)
      expect(n.value).toBe(2)
      n.set(prev => prev + 1)
      expect(n.value).toBe(3)
      n.set(prev => prev + 1)
      expect(n.value).toBe(4)

      n.restore()
    })

    it('merge', () => {
      const o = setter({
        value: {} as { m: number; n: number },
        annotation: observable.ref,
      })
      o.merge({
        n: 1,
      })
      expect(o.value).toEqual({ n: 1 })

      o.merge({
        m: 2,
      })
      expect(o.value).toEqual({ n: 1, m: 2 })

      o.merge({
        n: 3,
        m: 4,
      })
      expect(o.value).toEqual({ n: 3, m: 4 })

      o.merge({ m: 5 })
      expect(o.value).toEqual({ n: 3, m: 5 })

      o.restore()
      expect(o.value).toEqual({})
    })

    it('merge function type', () => {
      const o = setter({
        value: {} as { m: number; n: number },
        annotation: observable.ref,
      })
      o.merge(() => ({ n: 1 }))
      expect(o.value).toEqual({ n: 1 })

      o.merge(prev => ({
        ...prev,
        m: 2,
      }))
      expect(o.value).toEqual({ n: 1, m: 2 })

      o.merge(prev => ({
        n: prev.m,
        m: prev.n,
      }))
      expect(o.value).toEqual({ n: 2, m: 1 })

      o.restore()
      expect(o.value).toEqual({})
    })
  })
})
