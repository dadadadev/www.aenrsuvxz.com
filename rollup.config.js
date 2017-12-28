import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';


export default {
  entry: 'src/js/input.js',
  dest: 'public_html/app.js',
  format: 'es',
  plugins: [
    nodeResolve({ jsnext: true }),
    commonjs(),
    babel()
  ]
}
