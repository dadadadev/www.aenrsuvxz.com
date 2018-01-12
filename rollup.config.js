import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

export default {
  format: 'es',
  plugins: [
    nodeResolve({ jsnext: true }),
    commonjs(),
    babel(),
    process.env.NODE_ENV === 'production' ? uglify({ output: {
      comments: function(node, comment) {
        var text = comment.value;
        var type = comment.type;
        if (type == "comment2") {
          return /@preserve|@license|@cc_on/i.test(text);
        }
      }
    }}, minify) : false
  ]
}
