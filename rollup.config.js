import { terser } from "rollup-plugin-terser";

export default {
    input: 'src/main.js',
    output: {
        file: 'tlm-utils.js',
        format: 'cjs'
    },
    plugins: [terser()],
    external: ['path']
};