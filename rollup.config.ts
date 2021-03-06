import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import type { RollupOptions } from 'rollup'
import { terser } from 'rollup-plugin-terser'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

/** @type {import('rollup').RollupOptions} */
const option: RollupOptions = {
  input: 'src/index.ts',
  output: [
    {
      dir: 'module',
      banner: '/* eslint-disable */',
      format: 'module',
      preferConst: true,
      sourcemap: true,
      // globals: { mobx: 'mobx', lodash: '_' },
      name: 'mobxValue',
    },
  ],
  // external: ['mobx'],

  plugins: [
    babel({
      presets: ['react-app'],
      babelHelpers: 'runtime',
      extensions,
    }),
    nodeResolve({
      extensions,
      preferBuiltins: true,
    }),
    commonjs(),
    terser({
      compress: {
        dead_code: true,
      },
      format: {
        beautify: true,
        comments: true,
        ecma: 2020,
        indent_level: 2,
      },
      module: true,
      mangle: false,
    }),
  ],
}

export default option
