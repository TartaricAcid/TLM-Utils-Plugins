import {join as pathJoin} from "path";

function zipModelPack(path, root, zipFile) {
    let relative = handleZipPath(path.substring(root.length));
    console.log(relative)
    if (fs.statSync(path).isDirectory()) {
        zipFile.folder(relative)
        let files = fs.readdirSync(path);
        files.forEach(f => {
            let tmpPath = pathJoin(path, f)
            zipModelPack(tmpPath, root, zipFile)
        });
    } else {
        if (relative.endsWith(".json") || relative.endsWith(".png") || relative.endsWith(".lang")
            || relative.endsWith(".ogg") || relative.endsWith(".js") || relative.endsWith(".mcmeta")) {
            zipFile.file(relative, fs.readFileSync(path), {binary: true})
        }
    }
}

function handleZipPath(rawPath) {
    let out = ""
    if (rawPath.startsWith("/") || rawPath.startsWith("\\")) {
        out = rawPath.substring(1)
    }
    return out.replaceAll("\\", "/");
}

export function zipModelPackAll(path, zipFilePath) {
    Blockbench.showQuickMessage(tl("dialog.tlm_utils.add_present.custom.button.save.saving"), 3000)
    let zip = new JSZip();
    zipModelPack(path, path, zip)
    zip.generateAsync({
        type: "nodebuffer",
        compression: "DEFLATE",
        compressionOptions: {
            level: 9
        },
        platform: "UNIX"
    }).then(function (content) {
        fs.writeFile(zipFilePath, content, cb => {
            Blockbench.showQuickMessage(tl("dialog.tlm_utils.add_present.custom.button.save.success"), 3000)
        })
    });
}