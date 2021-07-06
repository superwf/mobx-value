interface IParam {
  hrefAssignSpy?: ReturnType<typeof jest.fn>
}

/**
 * @author superwf@gmail.com
 * @param { hrefAssignSpy: Mock }
 * @description
 *   mock window location object
 *   make assign to location.href is posibble
 * @return function to restore location to orgin
 * */
export const mockWindowLocation = ({ hrefAssignSpy }: IParam) => {
  const { location: originLocation } = window
  const mockLocation = {
    ...originLocation,
  }

  Reflect.defineProperty(window, 'location', {
    value: mockLocation,
  })

  Object.defineProperty(mockLocation, 'href', {
    set(v: string) {
      if (hrefAssignSpy) {
        hrefAssignSpy(v)
      }
    },
    get() {
      return originLocation.href
    },
  })

  return () => {
    // restore origin location
    Reflect.defineProperty(window, 'location', {
      value: originLocation,
    })
  }
}
