import { act, fireEvent, render, renderHook } from '@testing-library/react'

import { useMobxValue } from './hook'

import { setter } from '.'

describe('hook', () => {
  it('render in component', async () => {
    const count = setter(1)
    const Comp = () => {
      const a = useMobxValue(count)
      return (
        <div>
          <main data-testid="main">{a}</main>
          <button data-testid="button" onClick={() => count.set(count.value + 1)}>
            +1
          </button>
        </div>
      )
    }
    const app = render(<Comp />)
    expect((await app.findByTestId('main')).textContent).toBe('1')
    const b = await app.findByTestId('button')
    fireEvent.click(b)
    expect((await app.findByTestId('main')).textContent).toBe('2')
  })

  it('only test hook', () => {
    const count = setter(1)
    const { result } = renderHook(() => useMobxValue(count))
    expect(result.current).toEqual(1)
    act(() => count.set(count.value + 1))
    expect(result.current).toEqual(2)
  })
})
