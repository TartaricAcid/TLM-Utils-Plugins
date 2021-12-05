import animationAll from "../../assets/animation/animation_all.json";
import animationChair from "../../assets/animation/animation_chair.json";
import animationMaid from "../../assets/animation/animation_maid.json";

export var MAID_ANIMATION_REFERENCES = new Map();
export var CHAIR_ANIMATION_REFERENCES = new Map();

export function initPresentAnimations() {
    for (let item of animationAll) {
        addPath(MAID_ANIMATION_REFERENCES, item);
        addPath(CHAIR_ANIMATION_REFERENCES, item);
    }
    for (let item of animationMaid) {
        addPath(MAID_ANIMATION_REFERENCES, item);
    }
    for (let item of animationChair) {
        addPath(CHAIR_ANIMATION_REFERENCES, item);
    }
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