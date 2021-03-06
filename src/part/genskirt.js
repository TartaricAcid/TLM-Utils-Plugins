export var addSkirtMenu = {
    is_tlm_add_menu: true,
    icon: 'fa-female',
    name: '生成裙子',
    condition: {modes: ['edit'], method: () => (Format.id === "bedrock_old")},
    children: [
        {
            icon: 'fa-female',
            name: '下垂的长裙',
            click: function (group) {
                let formData = {
                    count: 14, width: 2, height: 12, length: 2, deg: 23
                }
                genSkirt(formData, group);
            }
        }, {
            icon: 'fa-female',
            name: '适中的裙子',
            click: function (group) {
                let formData = {
                    count: 12, width: 2, height: 8, length: 2, deg: 23
                }
                genSkirt(formData, group);
            }
        }, {
            icon: 'fa-female',
            name: '撑开的圆裙',
            click: function (group) {
                let formData = {
                    count: 16, width: 2, height: 8, length: 2, deg: 45
                }
                genSkirt(formData, group);
            }
        }, {
            icon: 'fa-female',
            name: '短裙',
            click: function (group) {
                let formData = {
                    count: 12, width: 2, height: 6, length: 2, deg: 45
                }
                genSkirt(formData, group);
            }
        }, {
            icon: 'fa-cogs',
            name: '自定义裙子',
            click: function (group) {
                addSkirt(group);
            }
        }
    ]
};

function addSkirt(rootGroup) {
    new Dialog({
        title: "输入裙子参数",
        form: {
            count: {
                type: "number",
                label: "裙褶个数",
                value: 12, min: 4, max: 50, step: 1
            },
            width: {
                type: "number",
                label: "裙褶长度",
                value: 2, min: 0, max: 10, step: 1
            },
            length: {
                type: "number",
                label: "裙褶宽度",
                value: 2, min: 0, max: 10, step: 1
            },
            height: {
                type: "number",
                label: "裙褶高度",
                value: 6, min: 1, max: 100, step: 1
            },
            deg: {
                type: "number",
                label: "裙褶倾角",
                value: 23, min: 0, max: 180, step: 1
            }
        },
        onConfirm: function (formData) {
            genSkirt(formData, rootGroup)
            this.hide()
        }
    }).show();
}

function genSkirt(formData, rootGroup) {
    let count = formData.count;
    let width = formData.width;
    let height = formData.height;
    let length = formData.length;
    let deg = formData.deg;

    Undo.initEdit({outliner: true, elements: [], selection: true});
    let cubesBefore = elements.length;

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
    for (let i = 0; i < count; i++) {
        let z2 = Math.sqrt(length ** 2 + width ** 2) / 2 / Math.tan(Math.PI / count);
        selectedGroup = addSkirtGroup(selectedGroup, [0, 0, 0], [0, 360 / count * i, 0]);
        selectedGroup = addSkirtGroup(selectedGroup, [0, 0, z2], [-deg, 0, 0]);
        selectedGroup = addSkirtGroup(selectedGroup, [0, 0, z2], [0, Math.radToDeg(Math.atan(length / width)), 0]);
        addSkirtCube(selectedGroup, [-width / 2, 0, z2 - length / 2], [width, height, length]);
        selectedGroup = rootGroup;
    }

    Undo.finishEdit('add_skirt_bone', {
        outliner: true,
        elements: elements.slice().slice(cubesBefore),
        selection: true
    })

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