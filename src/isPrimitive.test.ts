import { isPrimitive } from './isPrimitive'

describe('isPrimitive', () => {
  it('simple data', () => {
    expect(isPrimitive('')).toBe(true)
    expect(isPrimitive(1)).toBe(true)
    expect(isPrimitive(null)).toBe(true)
    expect(isPrimitive(undefined)).toBe(true)
    expect(isPrimitive(Number(2))).toBe(true)
    expect(isPrimitive(Symbol('a'))).toBe(true)
    expect(isPrimitive(Symbol.for('a'))).toBe(true)
    expect(isPrimitive(true)).toBe(true)
    expect(isPrimitive(false)).toBe(true)
  })

  it('object', () => {
    expect(isPrimitive({})).toBe(false)
    expect(isPrimitive(Object.create(null))).toBe(false)
    expect(isPrimitive([])).toBe(false)
    expect(isPrimitive(new Array(2))).toBe(false)
    expect(isPrimitive(Array)).toBe(false)
    expect(isPrimitive(Array.prototype)).toBe(false)
    expect(isPrimitive(Array.prototype.slice)).toBe(false)
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    expect(isPrimitive(() => {})).toBe(false)
    expect(isPrimitive(/x/)).toBe(false)
    expect(isPrimitive(new RegExp(/x/))).toBe(false)
  })
})
