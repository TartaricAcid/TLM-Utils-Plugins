export var addPolygonMenu = {
    is_tlm_add_menu: true,
    icon: 'fa-draw-polygon',
    name: '生成多边形',
    condition: {modes: ['edit'], method: () => (Format.id === "bedrock_old")},
    children: [
        {
            icon: 'fa-draw-polygon',
            name: '正三边形',
            click: function (group) {
                let data = {
                    count: 3, width: 2, flip: 0
                }
                genPolygon(data, group)
            }
        }, {
            icon: 'fa-draw-polygon',
            name: '正五边形',
            click: function (group) {
                let data = {
                    count: 5, width: 2, flip: 0
                }
                genPolygon(data, group)
            }
        }, {
            icon: 'fa-draw-polygon',
            name: '正六边形',
            click: function (group) {
                let data = {
                    count: 6, width: 2, flip: 0
                }
                genPolygon(data, group)
            }
        }, {
            icon: 'fa-draw-polygon',
            name: '正八边形',
            click: function (group) {
                let data = {
                    count: 8, width: 2, flip: 0
                }
                genPolygon(data, group)
            }
        }, {
            icon: 'fa-draw-polygon',
            name: '十六边形',
            click: function (group) {
                let data = {
                    count: 16, width: 1, flip: 0
                }
                genPolygon(data, group)
            }
        }, {
            icon: 'fa-cogs',
            name: '自定义正多边形',
            click: function (group) {
                addPolygon(group);
            }
        }
    ]
};

function addPolygon(rootGroup) {
    new Dialog({
        title: "输入多边形参数",
        form: {
            count: {
                type: "number",
                label: "边数",
                value: 6, min: 3, max: 50, step: 1
            },
            width: {
                type: "number",
                label: "边长",
                value: 2, min: 1, max: 16, step: 1
            },
            flip: {
                type: "number",
                label: "翻转角度",
                value: 0, min: -180, max: 180, step: 1
            }
        },
        onConfirm: function (formData) {
            genPolygon(formData, rootGroup)
            this.hide();
        }
    }).show();
}

function genPolygon(formData, rootGroup) {
    let count = formData.count;
    let width = formData.width;

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
        let z = (width / 2) / Math.tan(Math.PI / count)
        let deg = 360 / count * i
        selectedGroup = addPolygonGroup(selectedGroup, [0, 0, 0], [formData.flip, deg, 0])
        addPolygonCube(selectedGroup, [-width / 2, 0, z], [width, 1, 0])
        selectedGroup = rootGroup;
    }
    Undo.finishEdit('add_polygon_bone', {
        outliner: true,
        elements: elements.slice().slice(cubesBefore),
        selection: true
    })
    rootGroup.select();
    Canvas.updateSelected();
}

function addPolygonCube(selectedGroup, start, size) {
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

function addPolygonGroup(selectedGroup, pivot, rotation) {
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