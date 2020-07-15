import maidBoneList from "../json/animation_maid.json";
import chairBoneList from "../json/animation_chair.json";
import allBoneList from "../json/animation_all.json"
import {TLM_PROJECT_INFO} from "../projectinfo";

export var addBoneMenu = {
    is_tlm_add_menu: true,
    icon: 'fa-chart-pie',
    name: '生成动画骨骼',
    description: "生成一些拥有默认动画的骨骼",
    condition: {modes: ['edit']},
    children: function () {
        if (TLM_PROJECT_INFO.type === "chair") {
            return getChairBoneMenu();
        } else {
            return getMaidBoneMenu();
        }
    }
};

function getChairBoneMenu() {
    let out = [
        {
            icon: 'fa-baby-carriage',
            name: '乘客动画',
            description: "依据乘客的旋转、隐藏等动画",
            children: []
        }, {
            icon: 'fa-globe',
            name: '维度动画',
            description: "依据维度不同，隐藏或显示骨骼",
            children: []
        }, {
            icon: 'fa-flag',
            name: '浮动动画',
            description: "始终上下小幅度飘动的动画",
            children: []
        }, {
            icon: 'fa-sync-alt',
            name: '旋转动画',
            description: "各个朝向、不同速度的旋转动画",
            children: []
        }, {
            icon: 'fa-undo',
            name: '往复摆动画',
            description: "各个朝向，小幅度往复摆动的动画",
            children: []
        }, {
            icon: 'fa-clock',
            name: '游戏时间动画',
            description: "依据游戏时间显示、旋转的动画",
            children: []
        }, {
            icon: 'fa-history',
            name: '系统时间动画',
            description: "依据系统时间旋转的动画",
            children: []
        }
    ];
    for (let o of chairBoneList.concat(allBoneList)) {
        switch (o.group) {
            case "passenger":
                out[0].children.push(getMenu(o));
                break;
            case "dimension":
                out[1].children.push(getMenu(o));
                break;
            case "float":
                out[2].children.push(getMenu(o));
                break;
            case "rotation":
                out[3].children.push(getMenu(o));
                break;
            case "reciprocate":
                out[4].children.push(getMenu(o));
                break;
            case "game_time":
                out[5].children.push(getMenu(o));
                break;
            case "sys_time":
                out[6].children.push(getMenu(o));
                break;
        }
    }
    return out;
}

function getMaidBoneMenu() {
    let out = [
        {
            icon: 'fa-flushed',
            name: '头部',
            description: "与头部有关系的动画，包括眨眼，呆毛等",
            children: []
        }, {
            icon: 'fa-hand-spock',
            name: '手臂',
            description: "与手臂有关系的动画，包括正常的摆臂，手臂上垂直的骨骼等",
            children: []
        }, {
            icon: 'fa-socks',
            name: '腿部',
            description: "与腿部有关系的动画，包括正常的摆腿，腿部上垂直的骨骼等",
            children: []
        }, {
            icon: 'fa-chair',
            name: '坐下',
            description: "与坐下有关系的动画，主要包含裙子相关的动画",
            children: []
        }, {
            icon: 'fa-expand-arrows-alt',
            name: '额外部件',
            description: "翅膀、呆毛，尾巴等额外动画部件",
            children: []
        }, {
            icon: 'fa-tshirt',
            name: '护甲',
            description: "各个护甲部件",
            children: []
        }, {
            icon: 'fa-minus-circle',
            name: '隐藏护甲',
            description: "各个隐藏式护甲部件",
            children: []
        }, {
            icon: 'fa-user-secret',
            name: '特殊护甲',
            description: "仅在特定天气、气温环境下显示的骨骼",
            children: []
        }, {
            icon: 'fa-hammer',
            name: '工作模式',
            description: "仅在特定工作模型下显示、隐藏的骨骼",
            children: []
        }, {
            icon: 'fa-crosshairs',
            name: '定位骨骼',
            description: "各个定位骨骼部件",
            children: []
        }, {
            icon: 'fa-globe',
            name: '维度动画',
            description: "依据维度不同，隐藏或显示骨骼",
            children: []
        }, {
            icon: 'fa-flag',
            name: '浮动动画',
            description: "始终上下小幅度飘动的动画",
            children: []
        }, {
            icon: 'fa-sync-alt',
            name: '旋转动画',
            description: "各个朝向、不同速度的旋转动画",
            children: []
        }, {
            icon: 'fa-undo',
            name: '往复摆动画',
            description: "各个朝向，小幅度往复摆动的动画",
            children: []
        }, {
            icon: 'fa-clock',
            name: '游戏时间动画',
            description: "依据游戏时间显示、旋转的动画",
            children: []
        }, {
            icon: 'fa-history',
            name: '系统时间动画',
            description: "依据系统时间旋转的动画",
            children: []
        }
    ];
    for (let o of maidBoneList.concat(allBoneList)) {
        switch (o.group) {
            case "head":
                out[0].children.push(getMenu(o));
                break;
            case "arm":
                out[1].children.push(getMenu(o));
                break;
            case "leg":
                out[2].children.push(getMenu(o));
                break;
            case "sit":
                out[3].children.push(getMenu(o));
                break;
            case "extra":
                out[4].children.push(getMenu(o));
                break;
            case "armor":
                out[5].children.push(getMenu(o));
                break;
            case "hide_armor":
                out[6].children.push(getMenu(o));
                break;
            case "armor_special":
                out[7].children.push(getMenu(o));
                break;
            case "task":
                out[8].children.push(getMenu(o));
                break;
            case "position":
                out[9].children.push(getMenu(o));
                break;
            case "dimension":
                out[10].children.push(getMenu(o));
                break;
            case "float":
                out[11].children.push(getMenu(o));
                break;
            case "rotation":
                out[12].children.push(getMenu(o));
                break;
            case "reciprocate":
                out[13].children.push(getMenu(o));
                break;
            case "game_time":
                out[14].children.push(getMenu(o));
                break;
            case "sys_time":
                out[15].children.push(getMenu(o));
                break;
        }
    }
    return out;
}

function getMenu(menu) {
    return {
        icon: "fa-chevron-circle-right",
        name: menu.name,
        condition: {modes: ['edit'], method: () => (Format.id === "bedrock_old")},
        description: menu.description,
        color: menu.color,
        click: function (group) {
            let allGroups = Group.all.slice();
            let boneName;
            if (Array.isArray(menu.bone)) {
                let allBone = menu.bone.slice();
                // 做布尔操作，将重复的进行剔除
                for (let g of allGroups) {
                    if (allBone.includes(g.name)) {
                        allBone.splice(allBone.indexOf(g.name), 1);
                    }
                }
                if (allBone.length < 1) {
                    // 布尔操作后为空，说明已经全部覆盖
                    Blockbench.notification("重名骨骼", "发现当前名称骨骼已经存在，创建失败");
                    return;
                } else {
                    // 否则取第一个即可
                    boneName = allBone[0];
                }
            } else {
                // 检查重名
                for (let g of allGroups) {
                    if (g.name === menu.bone) {
                        Blockbench.notification("重名骨骼", "发现当前名称骨骼已经存在，创建失败");
                        return;
                    }
                }
                boneName = menu.bone;
            }

            // 父类骨骼检查
            if (menu.parents) {
                if (menu.parents.length < 1) {
                    // 如果长度为 0，说明检查的是 root Group
                    if (group) {
                        Blockbench.notification("骨骼位置不对", "当前骨骼必须最顶层骨骼！");
                        return;
                    }
                } else {
                    // 长度不为 0，说明检查的是特定名称骨骼
                    if (!group || !menu.parents.includes(group.name)) {
                        Blockbench.notification("骨骼位置不对", `当前骨骼必须位于 ${menu.parents} 骨骼之下！`);
                        return;
                    }
                }
            }

            Undo.initEdit({outliner: true, elements: [], selection: true});
            let cubesBefore = elements.length;
            // 生成骨骼
            let baseGroup = new Group({
                name: boneName,
                origin: group ? group.origin : undefined
            });
            baseGroup.addTo(group);
            // 不明白的参数
            baseGroup.isOpen = true;
            baseGroup.init().select();
            Undo.finishEdit('add_bone', {
                outliner: true,
                elements: elements.slice().slice(cubesBefore),
                selection: true
            })
        }
    };
}