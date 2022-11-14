import * as path from 'path'

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { HtmlWebpackInjectExternalsPlugin } from 'html-webpack-inject-externals-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { ProvidePlugin } from 'webpack'
import type { Configuration } from 'webpack'
import 'webpack-dev-server'

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
  'react-router': 'ReactRouter',
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
    name: 'react-router',
    path: '/umd/react-router.production.min.js',
  },
  {
    name: 'react-router-dom',
    path: '/umd/react-router-dom.production.min.js',
  },
  {
    name: 'mobx',
    path: '/dist/mobx.umd.development.js',
  },
  {
    name: 'moment',
    path: '/min/moment-with-locales.min.js',
  },
  {
    name: 'mobx-react-lite',
    path: '/dist/mobxreactlite.umd.development.js',
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
    hot: true,
    compress: true,
    port,
    static: './public',
    https: false,
    open: `http://127.0.0.1:${port}/mobxSetter`,
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
      process: resolveRoot('node_modules/process/browser.js'),
    }),
  ],
  devtool: 'source-map',
}

export default config
