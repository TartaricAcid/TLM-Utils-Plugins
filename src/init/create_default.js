import maidModelChooseVue from "./maid_model.vue";
import {defaultModelInfo, sr2ModelInfo} from "../model/preset";

export var createDefaultAction = new Action("tlm_utils.create_new_model", {
    name: "menu.tlm_utils.create_new_model",
    icon: "fa-file-alt",
    click: function () {
        createDefaultDialog.show();
    }
});


export var createDefaultDialog = new Dialog("create_new_model", {
    title: "menu.tlm_utils.create_new_model",
    width: 800,
    singleButton: true,
    component: maidModelChooseVue
});

export var defaultMaidModelDialog = new Dialog({
    title: "dialog.tlm_utils.create_new_model.maid.title",
    sidebar: {
        pages: {
            default: tl("dialog.tlm_utils.create_new_model.maid.default"),
            sr2: tl("dialog.tlm_utils.create_new_model.maid.little_maid_sr2")
        },
        page: "default",
        onPageSwitch(page) {
            if (page === "sr2") {
                defaultMaidModelDialog.hide();
                sr2MaidModelDialog.show();
                for (let k in sr2MaidModelDialog.sidebar["page_menu"]) {
                    let li = sr2MaidModelDialog.sidebar["page_menu"][k];
                    li.classList.toggle("selected", k === page);
                }
            }
        }
    },
    form: defaultModelInfo.form,
    onConfirm: function (formData) {
        this.hide();
        createPresetModelWorkspace(formData, defaultModelInfo.model);
    }
});

var sr2MaidModelDialog = new Dialog({
    title: "dialog.tlm_utils.create_new_model.maid.title",
    sidebar: {
        pages: {
            default: tl("dialog.tlm_utils.create_new_model.maid.default"),
            sr2: tl("dialog.tlm_utils.create_new_model.maid.little_maid_sr2")
        },
        page: "sr2",
        onPageSwitch(page) {
            if (page === "default") {
                sr2MaidModelDialog.hide();
                defaultMaidModelDialog.show();
                for (let k in defaultMaidModelDialog.sidebar["page_menu"]) {
                    let li = defaultMaidModelDialog.sidebar["page_menu"][k];
                    li.classList.toggle("selected", k === page);
                }
            }
        }
    },
    form: sr2ModelInfo.form,
    onConfirm: function (formData) {
        this.hide();
        createPresetModelWorkspace(formData, sr2ModelInfo.model);
    }
});

var createPresetModelWorkspace = function (formData, model) {
    let copyModel = JSON.parse(JSON.stringify(model));
    let bones = copyModel["geometry.model"]["bones"];
    for (let i in formData) {
        for (let j = 0; j < bones.length; j++) {
            if (bones[j].name === i && !formData[i]) {
                bones.splice(j, 1);
                break;
            }
        }
    }
    Codecs["bedrock_old"].load(copyModel, {path: ""});
};