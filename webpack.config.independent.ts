import * as path from 'path'

import type { Configuration } from 'webpack'

import baseConfig from './webpack.config'

const resolveRoot = (relativePath: string) => path.resolve(__dirname, relativePath)

const config: Configuration = {
  ...baseConfig,
  entry: {
    main: resolveRoot('src/independent.ts'),
  },
  output: {
    filename: 'independent.umd.js',
    library: {
      type: 'var',
      name: 'mobxValue',
      export: 'default',
    },
    globalObject: 'window',
    publicPath: '/',
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
}

export default config
