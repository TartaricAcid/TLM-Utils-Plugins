export var addSkirtMenu = {
    is_tlm_add_menu: true,
    icon: 'fa-chevron-circle-right',
    name: '生成裙子',
    condition: {modes: ['edit']},
    click: function (group) {
        addSkirt(group);
    }
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
                label: "裙褶宽度",
                value: 2, min: 1, max: 10, step: 1
            },
            length: {
                type: "number",
                label: "裙褶长度",
                value: 6, min: 1, max: 100, step: 1
            },
            deg: {
                type: "number",
                label: "裙褶倾角",
                value: 23, min: 0, max: 180, step: 1
            }
        },
        onConfirm: function (formData) {
            let count = formData.count;
            let width = formData.width;
            let length = formData.length;
            let deg = formData.deg;
            let selectedGroup = rootGroup;

            if (!selectedGroup && selectedGroup.length) {
                Blockbench.notification("当前所选组不正确", "请选择或创建一个空组");
                return;
            }

            for (let i = 0; i < count; i++) {
                let z1 = Math.SQRT2 / 2 * (1 / Math.tan(Math.PI / count) - 1) * width;
                let z2 = Math.SQRT2 / 2 * width / Math.tan(Math.PI / count);
                selectedGroup = addSkirtGroup(selectedGroup, [0, 0, 0], [0, 360 / count * i, 0]);
                selectedGroup = addSkirtGroup(selectedGroup, [0, 0, z2], [-deg, 0, 0]);
                selectedGroup = addSkirtGroup(selectedGroup, [0, 0, z1], [0, -45, 0]);
                addSkirtCube(selectedGroup, width, length);
                selectedGroup = rootGroup;
            }
            Canvas.updateAll();
            this.hide();
        }
    }).show();
}

function addSkirtCube(selectedGroup, width, length) {
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
                from: [originPos[0], originPos[1], originPos[2]],
                to: [originPos[0] + width, originPos[1] + length, originPos[2] + width],
                origin: originPos.slice()
            })
        }
    }
}

function addSkirtGroup(selectedGroup, pivot, rotation) {
    let baseGroup = new Group({
        origin: [pivot[0], pivot[1], pivot[2]],
        rotation: [rotation[0], rotation[1], rotation[2]]
    });
    baseGroup.addTo(selectedGroup);
    // 不明白的参数
    baseGroup.isOpen = true;
    // 检查骨骼命名
    if (Format.bone_rig) {
        baseGroup.createUniqueName()
    }
    baseGroup.init();
    return baseGroup;
}