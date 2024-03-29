import { getMobx } from './mobx'

import { boolean, mobxBoolean } from '.'

describe('mobxBoolean', () => {
  const { autorun, observe } = getMobx()
  const a = mobxBoolean()
  it('default false', () => {
    expect(a.value).toBe(false)
    const b = mobxBoolean({})
    expect(b.value).toBe(false)
  })

  it('observe', () => {
    const spy = jest.fn()
    observe(a, 'value', () => {
      spy()
    })
    a.setTrue()
    expect(spy).toHaveBeenCalled()
    expect(a.value).toBe(true)
    a.setFalse()
    expect(a.value).toBe(false)
  })

  it('toggle', () => {
    expect(a.value).toBe(false)
    a.toggle()
    expect(a.value).toBe(true)
    a.toggle()
    expect(a.value).toBe(false)
    a.toggle()
    expect(a.value).toBe(true)
    a.restore()
    expect(a.value).toBe(false)
  })

  it('set', () => {
    expect(a.value).toBe(false)
    a.set(true)
    expect(a.value).toBe(true)
    a.set(false)
    expect(a.value).toBe(false)
    a.restore()
  })

  it('multi instance', () => {
    const b = mobxBoolean()
    a.setTrue()
    expect(a.value).toBe(true)
    expect(b.value).toBe(false)
  })

  it('set auto restore when not observed', () => {
    const b = mobxBoolean({ autoRestoreOnBecomeUnobserved: true, name: 'test case boolean b' })
    expect(b.value).toBe(false)
    b.setTrue()
    expect(b.value).toBe(true)
    const dispose = autorun(() => {
      expect(b.value).toBe(true)
    })
    dispose()
    expect(b.value).toBe(false)
  })

  it('alias autoRestore', () => {
    const b = mobxBoolean({ autoRestore: true, name: 'test case boolean b' })
    expect(b.value).toBe(false)
    b.setTrue()
    expect(b.value).toBe(true)
    const dispose = autorun(() => {
      expect(b.value).toBe(true)
    })
    dispose()
    expect(b.value).toBe(false)
  })

  it('short alias', () => {
    expect(boolean).toBe(mobxBoolean)
  })
})
