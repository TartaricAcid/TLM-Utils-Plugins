export var addSkirt2Menu = {
    is_tlm_add_menu: true,
    icon: 'fa-vector-square',
    name: '生成方裙',
    condition: {modes: ['edit'], method: () => (Format.id === "bedrock_old")},
    children: [
        {
            icon: 'fa-vector-square',
            name: '四方裙',
            click: function (group) {
                let formData = {
                    length: 5, deg: 10, number: 4, side: 2
                }
                genSkirt2(formData, group);
            }
        }, {
            icon: 'fa-vector-square',
            name: '六方裙',
            click: function (group) {
                let formData = {
                    length: 2, deg: 15, number: 6, side: 2
                }
                genSkirt2(formData, group);
            }
        }, {
            icon: 'fa-vector-square',
            name: '八方裙',
            click: function (group) {
                let formData = {
                    length: 1, deg: 18, number: 8, side: 2
                }
                genSkirt2(formData, group);
            }
        }, {
            icon: 'fa-cogs',
            name: '自定义方裙',
            click: function (group) {
                addSkirt2(group);
            }
        }
    ]
};

function addSkirt2(rootGroup) {
    new Dialog({
        title: "输入方裙参数",
        form: {
            length: {
                type: "number",
                label: "方裙长度",
                value: 6, min: 2, max: 64, step: 1
            },
            deg: {
                type: "number",
                label: "方裙倾角",
                value: 10, min: 0, max: 90, step: 1
            },
            number: {
                type: "number",
                label: "方裙边数",
                value: 6, min: 3, max: 64, step: 1
            },
            side: {
                type: "number",
                label: "衔接边宽度",
                value: 2, min: 1, max: 16, step: 1
            }
        },
        onConfirm: function (formData) {
            genSkirt2(formData, rootGroup)
            this.hide()
        }
    }).show();
}

function genSkirt2(formData, rootGroup) {
    let length = formData.length;
    let deg = formData.deg;
    let number = formData.number;
    let side = formData.side;

    // 如果没有选择任何组，那就创建一个组
    if (!rootGroup) {
        rootGroup = new Group({});
        // 检查骨骼命名
        if (Format.bone_rig) {
            rootGroup.createUniqueName()
        }
        rootGroup.init();
    }

    // 创建裙子
    let selectedGroup = rootGroup;
    if (!selectedGroup && selectedGroup.length) {
        Blockbench.notification("当前所选组不正确", "请选择或创建一个空组");
        return;
    }
    let y = 6
    let beta = Math.atan(Math.sin(Math.degToRad(deg) * Math.tan(Math.PI / number)))
    for (let i = 0; i < number; i++) {
        let box1;
        selectedGroup = addSkirtGroup(selectedGroup, [0, 0, 0], [0, (360 / number) * i, 0])
        selectedGroup = addSkirtGroup(selectedGroup, [0, 0, side * Math.cos(beta) + (length / 2)],
            [-deg, 0, 0])
        addSkirtCube(selectedGroup, [-length / 2, -side * Math.sin(beta), (side * Math.cos(beta) + length / 2) / Math.tan(Math.PI / number)],
            [length, y, 0])
        box1 = addSkirtGroup(selectedGroup, [length / 2, -side * Math.sin(beta), side * Math.cos(beta) + length / 2], [0, 0, Math.radToDeg(beta)])
        addSkirtCube(box1, [length / 2, -side * Math.sin(beta), (side * Math.cos(beta) + length / 2) / Math.tan(Math.PI / number) - 0.001], [side, y, 0])
        box1 = addSkirtGroup(selectedGroup, [-length / 2, -side * Math.sin(beta), side * Math.cos(beta) + length / 2], [0, 0, -Math.radToDeg(beta)])
        addSkirtCube(box1, [-length / 2 - side, -side * Math.sin(beta), (side * Math.cos(beta) + length / 2) / Math.tan(Math.PI / number) + 0.001], [side, y, 0])
        selectedGroup = rootGroup;
    }
    rootGroup.select();
    Canvas.updateSelected();

}

function addSkirtCube(selectedGroup, start, size) {
    // 方块构建
    let baseCube = new Cube({
        autouv: (settings.autouv.value ? 1 : 0)
    }).init();
    baseCube.addTo(selectedGroup);
    // 方块参数设置
    if (Format.bone_rig) {
        if (selectedGroup) {
            let originPos = selectedGroup.origin.slice();
            baseCube.extend({
                from: [start[0], start[1], start[2]],
                to: [start[0] + size[0], start[1] + size[1], start[2] + size[2]],
                origin: originPos.slice()
            });
        }
    }
}

function addSkirtGroup(selectedGroup, pivot, rotation) {
    let baseGroup = new Group({
        origin: [pivot[0], pivot[1], pivot[2]],
        rotation: [rotation[0], rotation[1], rotation[2]]
    });
    baseGroup.addTo(selectedGroup);
    // 检查骨骼命名
    if (Format.bone_rig) {
        baseGroup.createUniqueName()
    }
    baseGroup.init();
    return baseGroup;
}