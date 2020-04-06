import json from '@rollup/plugin-json';

export default {
    input: 'src/main.js',
    output: {
        file: 'tlm-utils.js',
        format: 'cjs'
    },
    plugins: [json()],
    external: ['path']
};