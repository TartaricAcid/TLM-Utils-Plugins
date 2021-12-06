import animationAll from "../../assets/animation/animation_all.json";
import animationChair from "../../assets/animation/animation_chair.json";
import animationMaid from "../../assets/animation/animation_maid.json";
import animationOrder from "../../assets/animation/animation_order.json";

export var MAID_ANIMATION_REFERENCES = new Map();
export var MAID_ANIMATION_BONES = new Map();
export var CHAIR_ANIMATION_REFERENCES = new Map();
export var CHAIR_ANIMATION_BONES = new Map();
export var REFERENCES_ORDER;

export function initPresentAnimations() {
    for (let item of animationAll) {
        addPath(MAID_ANIMATION_REFERENCES, item);
        addBone(MAID_ANIMATION_BONES, item);
        addPath(CHAIR_ANIMATION_REFERENCES, item);
        addBone(CHAIR_ANIMATION_BONES, item);
    }
    for (let item of animationMaid) {
        addPath(MAID_ANIMATION_REFERENCES, item);
        addBone(MAID_ANIMATION_BONES, item);
    }
    for (let item of animationChair) {
        addPath(CHAIR_ANIMATION_REFERENCES, item);
        addBone(CHAIR_ANIMATION_BONES, item);
    }
    REFERENCES_ORDER = animationOrder;
}

function addPath(map, item) {
    if (item["path"]) {
        let path = item["path"];
        let name = tl(`model.tlm_utils.preset.${item["name"]}`);
        let desc = tl(`model.tlm_utils.preset.${item["name"]}.desc`);
        if (typeof path === "string") {
            map.set(path, {"name": name, "desc": desc});
        }
        if (Array.isArray(path)) {
            path.forEach(v => {
                map.set(v, {"name": name, "desc": desc});
            });
        }
    }
}

function addBone(map, item) {
    if (item["bone"]) {
        let bone = item["bone"];
        let path = item["path"];

        let references = [];
        if (typeof path === "string") {
            references.push(path);
        }
        if (Array.isArray(path)) {
            references = references.concat(path);
        }
        let name = tl(`model.tlm_utils.preset.${item["name"]}`);
        let desc = tl(`model.tlm_utils.preset.${item["name"]}.desc`);
        if (typeof bone === "string") {
            map.set(bone, {"name": name, "desc": desc, "ref": references});
        }
        if (Array.isArray(bone)) {
            bone.forEach(v => {
                map.set(v, {"name": name, "desc": desc, "ref": references});
            });
        }
    }
}