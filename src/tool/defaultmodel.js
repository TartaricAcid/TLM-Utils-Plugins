import defaultMaidModel from "../json/default.json";
// import playerMaidModel from "../json/player_maid.json";
import {clearAll, TLM_PROJECT_INFO} from "../projectinfo";
import {isEmpty} from "../utils/string";

function newWorkSpace() {
    // 新建一个项目
    if (newProject(Formats['bedrock_old'], false)) {
        new Dialog({
            title: "选择你要创建的内容",
            form: {
                type: {
                    type: "select",
                    label: "创建类型",
                    default: 'maid',
                    options: {
                        maid: "女仆模型",
                        chair: "坐垫模型",
                    }
                }
            },
            onConfirm: function (formData) {
                let type = formData.type;
                if (type === "chair") {
                    TLM_PROJECT_INFO.type = "chair"
                    $("#status_saved").text("坐垫模型")
                    this.hide();
                } else {
                    TLM_PROJECT_INFO.type = "maid"
                    $("#status_saved").text("女仆模型")
                    defaultMaidModelDialog.show();
                }
            }
        }).show();
    }
}

export var createDefaultModel = new Action('create_default_model', {
    name: '创建模型工作区',
    icon: 'fa-file-alt',
    click: function () {
        // 先检查残留问题
        let modelId = TLM_PROJECT_INFO.model_id;
        if (!isEmpty(modelId)) {
            Blockbench.showMessageBox({
                    title: "提醒!",
                    message: "是否覆盖之前 保存/导入 的模型？",
                    icon: "warning",
                    confirm: 0,
                    cancel: 1,
                    buttons: ["是", "否"]
                },
                (result) => {
                    if (result === 1) {
                        clearAll()
                    }
                    newWorkSpace();
                });
        } else {
            newWorkSpace();
        }
    }
})

// var selectDiffMaidModelDialog = new Dialog({
//     title: "选择预设的女仆模型",
//     form: {
//         type: {
//             type: "select",
//             label: "预设类型",
//             default: 'default',
//             options: {
//                 default: "默认女仆",
//                 player: "缩小版本的玩家模型",
//             }
//         }
//     },
//     onConfirm: function (formData) {
//         let type = formData.type;
//         if (type === "default") {
//             defaultMaidModelDialog.show();
//         } else {
//             let copyModel = JSON.parse(JSON.stringify(playerMaidModel));
//             this.hide();
//             Codecs["bedrock_old"].parse(copyModel, null);
//         }
//     }
// })


var defaultMaidModelDialog = new Dialog({
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
        let copyModel = JSON.parse(JSON.stringify(defaultMaidModel));
        let bones = copyModel["geometry.model"]["bones"];
        for (let i in formData) {
            for (let j = 0; j < bones.length; j++) {
                if (bones[j].name === i && !formData[i]) {
                    bones.splice(j, 1);
                    break;
                }
            }
        }
        this.hide();
        Codecs["bedrock_old"].parse(copyModel, null);
    }
});