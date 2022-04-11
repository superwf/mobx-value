import * as path from 'path'

import type { Configuration } from 'webpack'

// eslint-disable-next-line import/extensions
import baseConfig from './webpack.config'

const resolveRoot = (relativePath: string) => path.resolve(__dirname, relativePath)

const config: Configuration = {
  ...baseConfig,
  entry: {
    main: resolveRoot('src/standalone.ts'),
  },
  output: {
    filename: 'standalone.js',
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
