export var rotateArray = new Action('rotation_array_tlm_delete', {
        icon: 'content_copy',
        category: 'edit',
        name: "旋转阵列",
        label: "用来旋转阵列模型",
        condition: () => (Modes.edit && (selected.length || Group.selected) && Format.id === "bedrock_old"),
        click: function () {
            rotationArrayDialog.show()
        }
    }
)

var rotationArrayDialog = new Dialog({
    id: "rotation_array_dialog",
    title: "旋转阵列",
    form: {
        count: {
            type: "number",
            label: "阵列个数",
            value: 5, min: 1, max: 31, step: 1
        },
        deg: {
            type: "number",
            label: "偏转角度",
            value: 60, min: 0, max: 360,
        },
        axis: {
            type: "select",
            label: "旋转轴",
            default: 0,
            options: {
                0: "X 轴",
                1: "Y 轴",
                2: "Z 轴"
            }
        }
    },
    onConfirm: function (formData) {
        let count = formData.count;
        let deg = formData.deg;
        let axis = formData.axis;

        if (Group.selected && (Group.selected.matchesSelection() || selected.length === 0)) {
            let startDeg = Group.selected.rotation[axis]
            let raw = Group.selected;

            Undo.initEdit({outliner: true, elements: [], selection: true});
            let cubesBefore = elements.length;
            for (let i = 1; i < count + 1; i++) {
                let g = raw.duplicate();
                g.rotation[axis] = Math.trimDeg(startDeg + i * deg);
            }
            Undo.finishEdit('rotation_array', {
                outliner: true,
                elements: elements.slice().slice(cubesBefore),
                selection: true
            })
        }

        Canvas.updateAll()
        rotationArrayDialog.hide()
    }
})