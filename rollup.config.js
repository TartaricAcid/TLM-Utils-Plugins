import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import {terser} from "rollup-plugin-terser";
import image from "@rollup/plugin-image";
import css from "rollup-plugin-import-css";

export default {
    input: "src/main.js",
    output: {
        file: "tlm-utils.js",
        format: "cjs"
    },
    plugins: [
        json(),
        resolve(),
        commonjs(),
        //terser(),
        image(),
        css({
            minify: true
        })
    ],
    external: ["path"]
};