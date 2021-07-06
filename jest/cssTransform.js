// This is a custom Jest transformer turning style imports into empty objects.
// http://facebook.github.io/jest/docs/en/webpack.html

module.exports = {
  process() {
    return `module.exports = {
      use: jest.fn(),
      unuse: jest.fn(),
    };`
  },
  getCacheKey() {
    // The output is always the same.
    return 'cssTransform'
  },
}
