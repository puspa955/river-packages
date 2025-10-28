import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.js",
  output: [
    { file: "dist/index.js", format: "cjs", sourcemap: true, exports: "named" },
    { file: "dist/index.esm.js", format: "esm", sourcemap: true }
  ],
  external: ["react", "react-dom", "react/jsx-runtime"],
  plugins: [
    peerDepsExternal(),
    resolve({ extensions: [".js", ".jsx", ".ts", ".tsx"] }),
    babel({
      babelHelpers: "bundled",
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      exclude: "node_modules/**",
      presets: [
        "@babel/preset-env",
        ["@babel/preset-react", { runtime: "automatic" }]
      ]
    }),
    commonjs({ include: /node_modules/ }),
    postcss(),
    terser()
  ]
};
