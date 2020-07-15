import maidBoneList from "../json/animation_maid.json";
import chairBoneList from "../json/animation_chair.json";
import allBoneList from "../json/animation_all.json"
import {TLM_PROJECT_INFO} from "../projectinfo";
import {isEmpty} from "../utils/string";

export function registerSaveEvent() {
    Blockbench.on("save_project", saveAnimation);
}

export function removeSaveEvent() {
    Blockbench.removeListener("save_project", saveAnimation);
}

function getBoneList() {
    if (TLM_PROJECT_INFO.type === "chair") {
        return chairBoneList.concat(allBoneList);
    } else {
        return maidBoneList.concat(allBoneList);
    }
}

function insertPath(model, o) {
    if (!model["animation"]) {
        model["animation"] = []
    }
    let path = o["path"];
    if (Array.isArray(path)) {
        for (let p of path) {
            if (!model["animation"].includes(p)) {
                model["animation"].push(p)
            }
        }
    } else {
        if (isEmpty(path)) {
            return;
        }
        if (!model["animation"].includes(path)) {
            model["animation"].push(path)
        }
    }
}

function addAnimations(model) {
    let allGroups = Group.all.slice();
    for (let o of getBoneList()) {
        if (Array.isArray(o.bone)) {
            let allBone = o.bone.slice();
            // 做布尔操作，将重复的进行剔除
            for (let g of allGroups) {
                if (allBone.includes(g.name)) {
                    insertPath(model, o);
                }
            }
        } else {
            for (let g of allGroups) {
                if (g.name === o.bone) {
                    insertPath(model, o);
                }
            }
        }
    }
}

function saveFile(type, pack_data) {
    let jsonFilePath;
    if (type === "maid") {
        jsonFilePath = `${TLM_PROJECT_INFO.namespace_path}/maid_model.json`;
    } else {
        jsonFilePath = `${TLM_PROJECT_INFO.namespace_path}/maid_chair.json`;
    }
    fs.writeFileSync(jsonFilePath, autoStringify(pack_data));
}

function saveAnimation() {
    let modelId = `${TLM_PROJECT_INFO.namespace}:${TLM_PROJECT_INFO.model_id}`;
    let pack_data = TLM_PROJECT_INFO.pack_data;
    let type = TLM_PROJECT_INFO.type;

    if (!isEmpty(modelId)) {
        let model_list = pack_data["model_list"]
        model_list.forEach(model => {
            if (model["model_id"] === modelId) {
                addAnimations(model);
                saveFile(type, pack_data);
            }
        })
    }
}