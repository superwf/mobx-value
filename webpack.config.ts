import * as path from 'path'

import type { Configuration } from 'webpack'

const resolveRoot = (relativePath: string) => path.resolve(__dirname, relativePath)

const config: Configuration = {
  entry: {
    main: resolveRoot('src/index.ts'),
  },
  output: {
    filename: 'index.js',
    library: {
      type: 'window',
      name: 'MobxValue',
      export: 'default',
    },
    globalObject: 'window',
    publicPath: '/',
  },
  externals: ['mobx'],
  resolve: {
    extensions: ['.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: [resolveRoot('src')],
        loader: 'babel-loader',
        options: {
          customize: require.resolve('babel-preset-react-app/webpack-overrides'),
          cacheDirectory: true,
          cacheCompression: false,
          compact: true,
        },
      },
    ],
  },
  plugins: [],
  devtool: 'source-map',
}

export default config
