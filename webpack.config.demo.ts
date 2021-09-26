import * as path from 'path'

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { HtmlWebpackInjectExternalsPlugin } from 'html-webpack-inject-externals-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import open from 'open'
import { ProvidePlugin } from 'webpack'
import type { Configuration } from 'webpack'

const resolveRoot = (relativePath: string) => path.resolve(__dirname, relativePath)

const port = 3000

const externals: Record<string, string> = {
  react: 'React',
  'react-dom': 'ReactDOM',
  shiki: 'shiki',
  mobx: 'mobx',
  antd: 'antd',
  moment: 'moment',
  history: 'HistoryLibrary',
  'mobx-react-lite': 'mobxReactLite',
  'react-router-dom': 'ReactRouterDOM',
}

const unpkgHost = 'https://unpkg.com'

const packages: ConstructorParameters<typeof HtmlWebpackInjectExternalsPlugin>[0]['packages'] = [
  {
    name: 'antd',
    path: '/dist/antd.min.css',
  },
  {
    name: 'react',
    path: '/umd/react.development.js',
  },
  {
    name: 'history',
    path: '/umd/history.production.min.js',
  },
  {
    name: 'shiki',
    path: '',
  },
  {
    name: 'react-dom',
    path: '/umd/react-dom.development.js',
  },
  {
    name: 'react-router-dom',
    path: '/umd/react-router-dom.min.js',
  },
  {
    name: 'mobx',
    path: '/dist/mobx.umd.production.min.js',
  },
  {
    name: 'moment',
    path: '/min/moment-with-locales.min.js',
  },
  {
    name: 'mobx-react-lite',
    path: '/dist/mobxreactlite.umd.production.min.js',
  },
  {
    name: 'antd',
    path: '/dist/antd-with-locales.min.js',
  },
]

const config: Configuration = {
  mode: 'development',
  entry: {
    main: resolveRoot('demo/index.tsx'),
  },
  output: {
    filename: 'main.js',
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
    after: () => open(`http://127.0.0.1:${port}/mobxSetter`),
  },
  externals,
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: {
      assert: require.resolve('assert'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        include: [resolveRoot('src'), resolveRoot('demo')],
        loader: 'babel-loader',
        options: {
          customize: require.resolve('babel-preset-react-app/webpack-overrides'),
          cacheDirectory: true,
          cacheCompression: false,
          compact: true,
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: true,
      publicPath: '/',
    }),
    new HtmlWebpackInjectExternalsPlugin({
      host: unpkgHost,
      packages,
    }),
    new ReactRefreshWebpackPlugin({
      overlay: false,
    }),
    new ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  devtool: 'source-map',
}

export default config
