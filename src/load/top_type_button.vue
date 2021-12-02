<template>
    <div style="display: flex;">
        <div style="width: 50%; height: 30px">
            <button v-if="hasModelListFile('maid')" @click="selectMaid" style="width: 98%"
                    :class="{'inactive-tlm-selected-type-button':isMaidButtonActive}">
                {{tl("dialog.tlm_utils.create_new_model.choose_type.maid")}}
            </button>
            <button v-else @click="newModelList('maid')" style="width: 98%">
                <i class="fas fa-folder-plus"></i>
                {{tl("button.tlm_utils.new_maid_list")}}
            </button>
        </div>
        <div style="width: 50%; height: 30px">
            <button v-if="hasModelListFile('chair')" @click="selectChair" style="width: 98%; margin-left: 2%"
                    :class="{'inactive-tlm-selected-type-button':isChairButtonActive}">
                {{tl("dialog.tlm_utils.create_new_model.choose_type.chair")}}
            </button>
            <button v-else @click="newModelList('chair')" style="width: 98%; margin-left: 2%">
                <i class="fas fa-folder-plus"></i>
                {{tl("button.tlm_utils.new_chair_list")}}
            </button>
        </div>
    </div>
</template>

<script>
    import {getPackLanguage} from "../utils/language";

    export default {
        props: {
            parent: {
                type: Object,
                required: true
            },
        },
        data() {
            return {};
        },
        methods: {
            tl: tl,
            hasModelListFile: function (type) {
                let namespacePath = `${this.parent.assetsPath}/${this.parent.openCategory}`;
                let modelFile = (type === "maid") ? `${namespacePath}/maid_model.json` : `${namespacePath}/maid_chair.json`;
                return fs.existsSync(modelFile);
            },
            selectMaid: function () {
                if (this.parent.selected !== "maid") {
                    this.parent.selected = "maid";
                    this.parent.isEditPackInfo = false;
                    this.parent.selectedIconPath = "";
                    this.parent.reset();
                }
            },
            selectChair: function () {
                if (this.parent.selected !== "chair") {
                    this.parent.selected = "chair";
                    this.parent.isEditPackInfo = false;
                    this.parent.selectedIconPath = "";
                    this.parent.reset();
                }
            },
            newModelList: function (type) {
                let index = electron.dialog.showMessageBoxSync(currentwindow, {
                    title: tl("dialog.tlm_utils.load_pack.new_list"),
                    message: tl("dialog.tlm_utils.load_pack.new_list.desc"),
                    type: "warning",
                    buttons: [tl("button.tlm_utils.confirm"), tl("button.tlm_utils.cancel")],
                    defaultId: 1,
                    cancelId: 1,
                    noLink: true
                });
                if (index === 0) {
                    let namespacePath = `${this.parent.assetsPath}/${this.parent.openCategory}`;
                    let modelFile = (type === "maid") ? `${namespacePath}/maid_model.json` : `${namespacePath}/maid_chair.json`;
                    let packNameKey = `${type}_pack.${this.parent.openCategory}.name`;
                    let initData = {
                        "pack_name": `{${packNameKey}}`,
                        "model_list": []
                    };
                    fs.writeFileSync(modelFile, autoStringify(initData));
                    let langPath = `${namespacePath}/lang`;
                    let langMap = getPackLanguage(langPath, "en_us");
                    langMap[packNameKey] = "";
                    this.parent.selected = type + " ";
                    this.parent.selected = this.parent.selected.trim();
                    this.parent.isEditPackInfo = false;
                    this.parent.selectedIconPath = "";
                }
            }
        },
        computed: {
            isMaidButtonActive: function () {
                return this.parent.selected === "maid";
            },
            isChairButtonActive: function () {
                return this.parent.selected === "chair";
            },
        }
    };
</script>

<style scoped>
    .inactive-tlm-selected-type-button {
        background-color: #21252b;
        pointer-events: none;
    }

    .inactive-tlm-edit-pack-button {
        background-color: #1c2026;
        pointer-events: none;
    }
</style>