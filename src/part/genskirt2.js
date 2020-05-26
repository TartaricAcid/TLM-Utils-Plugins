export var addSkirt2Menu = {
    is_tlm_add_menu: true,
    icon: 'fa-vector-square',
    name: '生成方裙',
    condition: {modes: ['edit'], method: () => (Format.id === "bedrock_old")},
    children: [
        {
            icon: 'fa-vector-square',
            name: '默认预设',
            click: function (group) {
                let formData = {
                    length: 6, deg: 10
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
    for (let i = 0; i < 4; i++) {
        let box1;
        selectedGroup = addSkirtGroup(selectedGroup, [0, 0, 0], [0, 90 * i, 0])
        selectedGroup = addSkirtGroup(selectedGroup, [0, 0, Math.cos(Math.degToRad(deg)) + (length / 2)],
            [-Math.radToDeg(Math.asin(Math.tan(Math.degToRad(deg)))), 0, 0])
        addSkirtCube(selectedGroup, [-length / 2, -Math.sin(Math.degToRad(deg)), Math.cos(Math.degToRad(deg)) + (length / 2)],
            [length, y, 0])
        box1 = addSkirtGroup(selectedGroup, [length / 2, -Math.sin(Math.degToRad(deg)), Math.cos(Math.degToRad(deg)) + (length / 2)], [0, 0, deg])
        addSkirtCube(box1, [length / 2, -Math.sin(Math.degToRad(deg)), Math.cos(Math.degToRad(deg)) + (length / 2)], [1, y, 0])
        box1 = addSkirtGroup(selectedGroup, [-length / 2, -Math.sin(Math.degToRad(deg)), Math.cos(Math.degToRad(deg)) + (length / 2)], [0, 0, -deg])
        addSkirtCube(box1, [-length / 2 - 1, -Math.sin(Math.degToRad(deg)), Math.cos(Math.degToRad(deg)) + (length / 2)], [1, y, 0])
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