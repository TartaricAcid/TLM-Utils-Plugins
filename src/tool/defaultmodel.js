import defaultMaidModel from "../json/default.json";

export var createDefaultMaidModel = new Action('create_default_maid_model', {
    name: '创建默认女仆模型',
    description: '创建一个默认标准格式的女仆模型',
    icon: 'fa-file-alt',
    click: function () {
        // 新建一个项目
        if (newProject(Formats['bedrock_old'], false)) {
            let copyModel = JSON.parse(JSON.stringify(defaultMaidModel));
            let exportDefaultModelDialog = new Dialog({
                title: "请选择你想要导入的模型部件",
                form: {
                    head: {
                        label: "头部",
                        type: "checkbox",
                        value: true
                    },
                    blink: {
                        label: "眨眼表情",
                        type: "checkbox",
                        value: true
                    },
                    body: {
                        label: "身体",
                        type: "checkbox",
                        value: true
                    },
                    armLeft: {
                        label: "左臂",
                        type: "checkbox",
                        value: true
                    },
                    armRight: {
                        label: "右臂",
                        type: "checkbox",
                        value: true
                    },
                    legLeft: {
                        label: "左腿",
                        type: "checkbox",
                        value: true
                    },
                    legRight: {
                        label: "右腿",
                        type: "checkbox",
                        value: true
                    },
                    wingLeft: {
                        label: "左侧翅膀",
                        type: "checkbox",
                        value: false
                    },
                    wingRight: {
                        label: "右侧翅膀",
                        type: "checkbox",
                        value: false
                    },
                    tail: {
                        label: "尾巴",
                        type: "checkbox",
                        value: false
                    },
                    ahoge: {
                        label: "呆毛",
                        type: "checkbox",
                        value: false
                    }
                },
                onConfirm: function (formData) {
                    let bones = copyModel["geometry.model"]["bones"];
                    for (let i in formData) {
                        for (let j = 0; j < bones.length; j++) {
                            if (bones[j].name === i && !formData[i]) {
                                bones.splice(j, 1);
                                break;
                            }
                        }
                    }
                    exportDefaultModelDialog.hide();
                    Codecs["bedrock_old"].parse(copyModel, null);
                }
            });
            exportDefaultModelDialog.show();
        }
    }
});