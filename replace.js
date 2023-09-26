const fs = require("fs");

fs.readFile("tlm-utils.js", "utf-8", (error, data) => {
    console.log(typeof data)
    let out = data.replaceAll("__vue_component__", "__vue_component__tlm")
        .replaceAll("__vue_script__", "__vue_script__tlm")
        .replaceAll("__vue_render__", "__vue_render__tlm")
    fs.writeFile("tlm-utils.js", out, (error) => {
    })
})