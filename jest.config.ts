import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest/setup.js'],
}
export default config
