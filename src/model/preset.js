import defaultMaidModel from "../../assets/model/maid/default.json";
import sr2MaidModel from "../../assets/model/maid/sr2.json";
import emptyMaidModel from "../../assets/model/maid/empty.json";

export var sr2ModelInfo = {
    form: {
        head: {
            label: "model.tlm_utils.preset.head",
            type: "checkbox",
            value: true
        },
        blink: {
            label: "model.tlm_utils.preset.blink",
            type: "checkbox",
            value: true
        },
        body: {
            label: "model.tlm_utils.preset.body",
            type: "checkbox",
            value: true
        },
        armLeft: {
            label: "model.tlm_utils.preset.arm_left",
            type: "checkbox",
            value: true
        },
        armRight: {
            label: "model.tlm_utils.preset.arm_right",
            type: "checkbox",
            value: true
        },
        legLeft: {
            label: "model.tlm_utils.preset.leg_left",
            type: "checkbox",
            value: true
        },
        legRight: {
            label: "model.tlm_utils.preset.leg_right",
            type: "checkbox",
            value: true
        }
    },
    model: sr2MaidModel,
    name: "dialog.tlm_utils.create_new_model.maid.little_maid_sr2"
};

export var defaultModelInfo = {
    form: {
        head: {
            label: "model.tlm_utils.preset.head",
            type: "checkbox",
            value: true
        },
        blink: {
            label: "model.tlm_utils.preset.blink",
            type: "checkbox",
            value: true
        },
        body: {
            label: "model.tlm_utils.preset.body",
            type: "checkbox",
            value: true
        },
        armLeft: {
            label: "model.tlm_utils.preset.arm_left",
            type: "checkbox",
            value: true
        },
        armRight: {
            label: "model.tlm_utils.preset.arm_right",
            type: "checkbox",
            value: true
        },
        legLeft: {
            label: "model.tlm_utils.preset.leg_left",
            type: "checkbox",
            value: true
        },
        legRight: {
            label: "model.tlm_utils.preset.leg_right",
            type: "checkbox",
            value: true
        },
        wingLeft: {
            label: "model.tlm_utils.preset.wing_left",
            type: "checkbox",
            value: false
        },
        wingRight: {
            label: "model.tlm_utils.preset.wing_right",
            type: "checkbox",
            value: false
        },
        tail: {
            label: "model.tlm_utils.preset.tail",
            type: "checkbox",
            value: false
        },
        ahoge: {
            label: "model.tlm_utils.preset.ahoge",
            type: "checkbox",
            value: false
        }
    },
    model: defaultMaidModel,
    name: "dialog.tlm_utils.create_new_model.maid.default"
};

export var emptyModelInfo = {
    form: {},
    model: emptyMaidModel,
    name: "dialog.tlm_utils.create_new_model.maid.empty"
};

export var presentModel = {
    "default": defaultModelInfo,
    "sr2": sr2ModelInfo,
    "empty": emptyModelInfo
};