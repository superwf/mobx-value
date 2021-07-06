import isObject from 'lodash/isObject'

const isStructureEqual = (received, expected) => {
  // eslint-disable-next-line
  for (const key in received) {
    if (!(key in expected)) {
      return false
    }
    if (isObject(received[key])) {
      const isEqual = isStructureEqual(received[key], expected[key])
      if (!isEqual) {
        return isEqual
      }
    }
  }
  return true
}

expect.extend({
  toStructureEqual(received, expected) {
    if (isStructureEqual(received, expected)) {
      return {
        pass: true,
      }
    }
    return {
      pass: false,
      message: () => `${received} structure not equal expected`,
    }
  },
})
