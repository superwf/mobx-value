import * as path from 'path'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import open from 'open'
import type { Configuration } from 'webpack'

const resolveRoot = (relativePath: string) => path.resolve(__dirname, relativePath)

const port = 3000

const config: Configuration = {
  mode: 'development',
  entry: {
    main: resolveRoot('src/demo.tsx'),
  },
  output: {
    filename: 'demo.js',
    publicPath: '/',
  },
  devServer: {
    historyApiFallback: true,
    host: '0.0.0.0',
    inline: true,
    hot: true,
    hotOnly: true,
    compress: true,
    clientLogLevel: 'none',
    injectClient: true,
    quiet: false,
    disableHostCheck: true,
    port,
    contentBase: './public',
    https: false,
    after: () => open(`http://127.0.0.1:${port}`),
  },
  externals: {
    mobx: 'mobx',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
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
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: true,
      publicPath: '/',
    }),
  ],
  devtool: 'source-map',
}

export default config
