import maidBoneList from "../../assets/animation/animation_maid.json";
import chairBoneList from "../../assets/animation/animation_chair.json";
import allBoneList from "../../assets/animation/animation_all.json";

export var addMaidMenu = {
    is_tlm_add_menu: true,
    icon: "fa-chart-pie",
    name: "menu.tlm_utils.add_present_group.maid.title",
    condition: {modes: ["edit"]},
    children: function () {
        return getMaidMenu();
    }
};

export var addChairMenu = {
    is_tlm_add_menu: true,
    icon: "fa-chart-pie",
    name: "menu.tlm_utils.add_present_group.chair.title",
    condition: {modes: ["edit"]},
    children: function () {
        return getChairMenu();
    }
};

function getMaidMenu() {
    let out = [
        {
            icon: "fa-flushed",
            name: "model.tlm_utils.preset_group.head",
            children: []
        }, {
            icon: "fa-hand-spock",
            name: "model.tlm_utils.preset_group.arm",
            children: []
        }, {
            icon: "fa-socks",
            name: "model.tlm_utils.preset_group.leg",
            children: []
        }, {
            icon: "fa-chair",
            name: "model.tlm_utils.preset_group.sit",
            children: []
        }, {
            icon: "fa-expand-arrows-alt",
            name: "model.tlm_utils.preset_group.extra",
            children: []
        }, {
            icon: "fa-tshirt",
            name: "model.tlm_utils.preset_group.armor",
            children: []
        }, {
            icon: "fa-minus-circle",
            name: "model.tlm_utils.preset_group.hide_armor",
            children: []
        }, {
            icon: "fa-user-secret",
            name: "model.tlm_utils.preset_group.armor_special",
            children: []
        }, {
            icon: "fa-hammer",
            name: "model.tlm_utils.preset_group.task",
            children: []
        }, {
            icon: "fa-crosshairs",
            name: "model.tlm_utils.preset_group.position",
            children: []
        }, {
            icon: "fa-globe",
            name: "model.tlm_utils.preset_group.dimension",
            children: []
        }, {
            icon: "fa-flag",
            name: "model.tlm_utils.preset_group.float",
            children: []
        }, {
            icon: "fa-sync-alt",
            name: "model.tlm_utils.preset_group.rotation",
            children: []
        }, {
            icon: "fa-undo",
            name: "model.tlm_utils.preset_group.reciprocate",
            children: []
        }, {
            icon: "fa-clock",
            name: "model.tlm_utils.preset_group.game_time",
            children: []
        }, {
            icon: "fa-history",
            name: "model.tlm_utils.preset_group.sys_time",
            children: []
        }, {
            icon: "fa-bed",
            name: "model.tlm_utils.preset_group.sleep",
            children: []
        }, {
            icon: "fa-heart",
            name: "model.tlm_utils.preset_group.health",
            children: []
        }, {
            icon: "fa-candy-cane",
            name: "model.tlm_utils.preset_group.festival",
            children: []
        }, {
            icon: "fa-question-circle",
            name: "model.tlm_utils.preset_group.other",
            description: "",
            children: []
        }
    ];
    for (let item of maidBoneList.concat(allBoneList)) {
        switch (item.group) {
            case "head":
                out[0].children.push(getMenu(item));
                break;
            case "arm":
                out[1].children.push(getMenu(item));
                break;
            case "leg":
                out[2].children.push(getMenu(item));
                break;
            case "sit":
                out[3].children.push(getMenu(item));
                break;
            case "extra":
                out[4].children.push(getMenu(item));
                break;
            case "armor":
                out[5].children.push(getMenu(item));
                break;
            case "hide_armor":
                out[6].children.push(getMenu(item));
                break;
            case "armor_special":
                out[7].children.push(getMenu(item));
                break;
            case "task":
                out[8].children.push(getMenu(item));
                break;
            case "position":
                out[9].children.push(getMenu(item));
                break;
            case "dimension":
                out[10].children.push(getMenu(item));
                break;
            case "float":
                out[11].children.push(getMenu(item));
                break;
            case "rotation":
                out[12].children.push(getMenu(item));
                break;
            case "reciprocate":
                out[13].children.push(getMenu(item));
                break;
            case "game_time":
                out[14].children.push(getMenu(item));
                break;
            case "sys_time":
                out[15].children.push(getMenu(item));
                break;
            case "sleep":
                out[16].children.push(getMenu(item));
                break;
            case "health":
                out[17].children.push(getMenu(item));
                break;
            case "festival":
                out[18].children.push(getMenu(item));
                break;
            default:
                out[19].children.push(getMenu(item));
        }
    }
    return out;
}

function getChairMenu() {
    let out = [
        {
            icon: "fa-baby-carriage",
            name: "model.tlm_utils.preset_group.passenger",
            children: []
        },
        {
            icon: "fa-globe",
            name: "model.tlm_utils.preset_group.dimension",
            children: []
        }, {
            icon: "fa-flag",
            name: "model.tlm_utils.preset_group.float",
            children: []
        }, {
            icon: "fa-sync-alt",
            name: "model.tlm_utils.preset_group.rotation",
            children: []
        }, {
            icon: "fa-undo",
            name: "model.tlm_utils.preset_group.reciprocate",
            children: []
        }, {
            icon: "fa-clock",
            name: "model.tlm_utils.preset_group.game_time",
            children: []
        }, {
            icon: "fa-history",
            name: "model.tlm_utils.preset_group.sys_time",
            children: []
        }, {
            icon: "fa-candy-cane",
            name: "model.tlm_utils.preset_group.festival",
            children: []
        }, {
            icon: "fa-question-circle",
            name: "model.tlm_utils.preset_group.other",
            description: "",
            children: []
        }
    ];
    for (let item of chairBoneList.concat(allBoneList)) {
        switch (item.group) {
            case "passenger":
                out[0].children.push(getMenu(item));
                break;
            case "dimension":
                out[1].children.push(getMenu(item));
                break;
            case "float":
                out[2].children.push(getMenu(item));
                break;
            case "rotation":
                out[3].children.push(getMenu(item));
                break;
            case "reciprocate":
                out[4].children.push(getMenu(item));
                break;
            case "game_time":
                out[5].children.push(getMenu(item));
                break;
            case "sys_time":
                out[6].children.push(getMenu(item));
                break;
            case "festival":
                out[7].children.push(getMenu(item));
                break;
            default:
                out[8].children.push(getMenu(item));
        }
    }
    return out;
}

function getMenu(menu) {
    return {
        icon: "fa-chevron-circle-right",
        name: `model.tlm_utils.preset.${menu.name}`,
        condition: {modes: ["edit"]},
        description: `model.tlm_utils.preset.${menu.name}.desc`,
        color: menu.color,
        click: function (group) {
            let boneName = checkDuplicate(menu);
            if (boneName && checkParents(menu, group)) {
                Undo.initEdit({outliner: true, elements: [], selection: true});
                let cubesBefore = elements.length;
                let baseGroup = new Group({
                    name: boneName,
                    origin: group ? group.origin : undefined
                });
                baseGroup.addTo(group);
                baseGroup.isOpen = true;
                baseGroup.init().select();
                Undo.finishEdit("add_bone", {
                    outliner: true,
                    elements: elements.slice().slice(cubesBefore),
                    selection: true
                });
            }
        }
    };
}

function checkDuplicate(menu) {
    let allGroups = Group.all.slice();
    if (Array.isArray(menu.bone)) {
        let allBone = menu.bone.slice();
        for (let group of allGroups) {
            if (allBone.includes(group.name)) {
                allBone.splice(allBone.indexOf(group.name), 1);
            }
        }
        if (allBone.length > 0) {
            return allBone[0];
        }
        Blockbench.notification(tl("dialog.tlm_utils.add_present_group.duplicate"),
            tl("dialog.tlm_utils.add_present_group.duplicate.desc"));
    } else {
        for (let group of allGroups) {
            if (group.name === menu.bone) {
                Blockbench.notification(tl("dialog.tlm_utils.add_present_group.duplicate"),
                    tl("dialog.tlm_utils.add_present_group.duplicate.desc"));
                return;
            }
        }
        return menu.bone;
    }
}

function checkParents(menu, group) {
    if (menu.parents) {
        if (menu.parents.length < 1) {
            if (group) {
                Blockbench.notification(tl("dialog.tlm_utils.add_present_group.location"),
                    tl("dialog.tlm_utils.add_present_group.location.root.desc"));
                return false;
            }
        } else {
            if (!group || !menu.parents.includes(group.name)) {
                Blockbench.notification(tl("dialog.tlm_utils.add_present_group.location"),
                    tl("dialog.tlm_utils.add_present_group.location.parents.desc", [menu.parents]));
                return false;
            }
        }
    }
    return true;
}