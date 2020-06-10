export var addBoneMenu = {
    is_tlm_add_menu: true,
    icon: 'fa-chart-pie',
    name: '生成动画骨骼',
    description: "生成一些拥有默认动画的骨骼",
    condition: {modes: ['edit']},
    children: function () {
        let out = [
            {
                icon: 'fa-home',
                name: '基础部分',
                description: "头、手、腿等基础动画部件",
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
                icon: 'fa-crosshairs',
                name: '定位骨骼',
                description: "各个定位骨骼部件",
                children: []
            }
        ];
        for (let o of boneNameList) {
            switch (o.group) {
                case "base":
                    out[0].children.push(getMenu(o));
                    break;
                case "extra":
                    out[1].children.push(getMenu(o));
                    break;
                case "armor":
                    out[2].children.push(getMenu(o));
                    break;
                case "hide_armor":
                    out[3].children.push(getMenu(o));
                    break;
                case "position":
                    out[4].children.push(getMenu(o));
                    break;
            }
        }
        return out;
    }
};

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

var boneNameList = [
    {bone: "head", name: "头部", description: "头部旋转，祈求动作", color: "#718c00", parents: [], group: "base"},
    {
        bone: "armLeft",
        name: "左臂",
        description: "行走时手臂动画效果，手臂末端持有物品的显示，待命时手臂合拢效果",
        color: "#718c00",
        parents: [],
        group: "base"
    },
    {
        bone: "armRight",
        name: "右臂",
        description: "行走时手臂动画效果，手臂末端持有物品的显示，待命时手臂合拢效果",
        color: "#718c00",
        parents: [],
        group: "base"
    },
    {bone: "legLeft", name: "左腿", description: "行走时腿部动画效果，待命骑行时腿部坐下效果", color: "#718c00", parents: [], group: "base"},
    {bone: "legRight", name: "右腿", description: "行走时腿部动画效果，待命骑行时腿部坐下效果", color: "#718c00", parents: [], group: "base"},
    {bone: "wingLeft", name: "左翅膀", description: "翅膀往复摆动画", color: "#fe9750", group: "extra"},
    {bone: "wingRight", name: "右翅膀", description: "翅膀往复摆动画", color: "#fe9750", group: "extra"},
    {bone: "ahoge", name: "呆毛", description: "祈求状态下的呆毛圆锥摆动画", color: "#fe9750", parents: ["head"], group: "extra"},
    {bone: "blink", name: "眨眼", description: "日常的眨眼动画", color: "#fe9750", parents: ["head"], group: "base"},
    {bone: "tail", name: "尾巴", description: "以旋转点为中心，Z 方向的小幅度圆锥摆", color: "#fe9750", group: "extra"},
    {
        bone: ["sinFloat", "cosFloat", "_sinFloat", "_cosFloat"],
        name: "漂浮部件",
        description: "以旋转点为中心的上下小距离浮动",
        color: "#fe9750",
        group: "extra"
    },
    {
        bone: "helmet",
        name: "头盔",
        description: "穿戴头盔后显示该模型",
        color: "#66cccc",
        group: "armor"
    },
    {
        bone: ["chestPlate", "chestPlateLeft", "chestPlateMiddle", "chestPlateRight"],
        name: "胸甲",
        description: "穿戴胸甲后显示该模型", color: "#66cccc", group: "armor"
    },
    {
        bone: ["leggings", "leggingsLeft", "leggingsMiddle", "leggingsRight"],
        name: "护腿",
        description: "穿戴护腿后显示该模型",
        color: "#66cccc", group: "armor"
    },
    {bone: ["bootsLeft", "bootsRight"], name: "靴子", description: "穿戴靴子后显示该模型", color: "#66cccc", group: "armor"},
    {
        bone: "_helmet", name: "反向头盔", description: "穿戴头盔后隐藏该模型", color: "#6699cc",
        group: "hide_armor"
    },
    {
        bone: ["_chestPlate", "_chestPlateLeft", "_chestPlateMiddle", "_chestPlateRight"],
        name: "反向胸甲",
        description: "穿戴胸甲后隐藏该模型",
        color: "#6699cc",
        group: "hide_armor"
    },
    {
        bone: ["_leggings", "_leggingsLeft", "_leggingsMiddle", "_leggingsRight"],
        name: "反向护腿",
        description: "穿戴护腿后隐藏该模型",
        color: "#6699cc",
        group: "hide_armor"
    },
    {
        bone: ["_bootsLeft", "_bootsRight"], name: "反向靴子", description: "穿戴靴子后隐藏该模型", color: "#6699cc",
        group: "hide_armor"
    },
    {
        bone: "armLeftPositioningBone",
        name: "左手臂定位骨骼",
        description: "女仆手持物品的定位骨骼，为空骨骼。空骨骼的旋转点决定了手持物品的起始位置",
        color: "#cc99cc",
        parents: ["armLeft"],
        group: "position"
    },
    {
        bone: "armRightPositioningBone",
        name: "右手臂定位骨骼",
        description: "女仆手持物品的定位骨骼，为空骨骼。它的旋转点决定了手持物品的起始位置",
        color: "#cc99cc",
        parents: ["armRight"],
        group: "position"
    },
    {
        bone: "backpackPositioningBone",
        name: "背包定位骨骼",
        description: "女仆背包的定位骨骼，为空骨骼。它的旋转点决定了背包肩带的中心点",
        color: "#cc99cc",
        parents: [],
        group: "position"
    },
];