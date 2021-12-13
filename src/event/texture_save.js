import {join as pathJoin} from "path";

export function registerTextureEvent() {
    Blockbench.on("add_texture", changeTextureName);
}

export function removeTextureEvent() {
    Blockbench.removeListener("add_texture", changeTextureName);
}

function changeTextureName() {
    if (Project && Project.selected && Project["tlm_list_info"] && Project["tlm_model_info"]) {
        let listInfo = Project["tlm_list_info"];
        let modelInfo = Project["tlm_model_info"];
        let path = getTexturePath(listInfo, modelInfo);
        let textures = Project.textures;
        if (textures.length > 0) {
            let texture = textures[0];
            saveTexture(path, texture);
        }
    }
}

function saveTexture(path, texture) {
    if (path && texture.path !== path) {
        let index = electron.dialog.showMessageBoxSync(currentwindow, {
            title: tl("dialog.tlm_utils.texture_save.title"),
            message: tl("dialog.tlm_utils.texture_save.desc"),
            type: "warning",
            buttons: [tl("button.tlm_utils.confirm"), tl("button.tlm_utils.cancel")],
            defaultId: 1,
            cancelId: 1,
            noLink: true
        });
        if (index === 0) {
            texture.path = path;
            let image;
            if (texture.mode === "link") {
                image = electron.nativeImage.createFromPath(texture.source.replace(/\?\d+$/, "")).toPNG();
            } else {
                image = electron.nativeImage.createFromDataURL(texture.source).toPNG();
            }
            fs.writeFile(texture.path, image, () => {
                texture.fromPath(texture.path);
            });
        }
    }
}

function getTexturePath(listInfo, modelInfo) {
    if (modelInfo && listInfo) {
        let modelId = modelInfo["model_id"];
        let texture = modelInfo["texture"];
        if (texture) {
            let res = texture.split(":", 2);
            if (res.length > 1) {
                return pathJoin(listInfo.namespacePath, res[1]);
            }
        } else {
            let res = modelId.split(":", 2);
            if (res.length > 1) {
                return pathJoin(listInfo.texturesPath, res[1] + ".png");
            }
        }
    }
}