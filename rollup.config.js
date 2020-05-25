import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: 'src/main.js',
    output: {
        file: 'tlm-utils.js',
        format: 'cjs'
    },
    plugins: [
        json(),
        resolve(),
        commonjs()
    ],
    external: ['path']
};