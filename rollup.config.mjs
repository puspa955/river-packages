import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
      exports: 'named',
    },
  ],
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    /^@fortawesome\//,
    /^@radix-ui\//,
    'class-variance-authority',
    'clsx',
    'cmdk',
    'date-fns',
    'dayjs',
    'react-day-picker',
    'tailwind-merge',
  ],
  plugins: [
    // Resolve first to find modules
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    // Transform JSX BEFORE commonjs tries to parse it
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      presets: [
        ['@babel/preset-env', {
          targets: { node: '14' }
        }],
        ['@babel/preset-react', { 
          runtime: 'automatic' 
        }]
      ],
    }),
    // Now commonjs can work with the transformed code
    commonjs({
      include: /node_modules/,
    }),
    postcss({
      extensions: ['.css'],
      minimize: true,
      inject: false,
      extract: false,
    }),
    terser(),
  ],
};