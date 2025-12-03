import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from "rollup-plugin-peer-deps-external";


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
    '@tanstack/react-query',
  ],
 plugins: [
  peerDepsExternal(),
  resolve({
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  }),
  babel({
    babelHelpers: "bundled",
    exclude: "node_modules/**",
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    presets: [
      ["@babel/preset-env", { targets: { node: "14" } }],
      ["@babel/preset-react", { runtime: "automatic" }],
    ],
  }),
  commonjs({
    include: /node_modules/,
  }),
  postcss({
    extensions: [".css"],
    minimize: true,
    inject: false,
    extract: false,
  }),
  terser(),
]
};