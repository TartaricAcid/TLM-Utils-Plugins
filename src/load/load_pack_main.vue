<template>
    <div>
        <div v-if="newSubModelPack">
            <newSubModelPackFormVue :parent="this"/>
        </div>
        <div style="display:flex" v-else-if="!categoryIsEmpty">
            <div style="width: 70%">
                <topTypeButtonVue :parent="this"/>
                <modelListInfoVue :parent="this" v-if="isShowList"/>
            </div>
            <div style="width: 30%; padding-left: 10px;">
                <modelListTableVue :parent="this" v-if="isShowList"/>
            </div>
        </div>
    </div>
</template>

<script>
    import newSubModelPackFormVue from "./new_sub_model_pack_form.vue";
    import topTypeButtonVue from "./top_type_button.vue";
    import modelListInfoVue from "./model_list_info.vue";
    import modelListTableVue from "./model_list_table.vue";
    import {splitStringVersion, TlmPackInfo} from "../info/pack_info";
    import {isEmpty} from "../utils/string";
    import {getPackLanguage} from "../utils/language";

    export default {
        props: {
            assetsPath: {
                type: String,
                required: true
            },
            namespaceMap: {
                type: Object,
                required: true
            },
            packEditDialog: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                openCategory: Object.keys(this.namespaceMap)[0],
                selected: "maid",
                newSubModelPack: false,
                selectedId: -1
            };
        },
        components: {
            newSubModelPackFormVue,
            modelListInfoVue,
            topTypeButtonVue,
            modelListTableVue
        },
        methods: {
            reset: function () {
                this.selectedId = -1;
                let children = this.$children[1];
                if (children) {
                    children.reset();
                }
            },
            addDefaultModelData: function (modelInfo, name) {
                if (!modelInfo.hasOwnProperty(name)) {
                    modelInfo[name] = true;
                }
            },
            addMaidDefaultModelData: function (modelInfo) {
                this.addDefaultModelData(modelInfo, "show_backpack");
                this.addDefaultModelData(modelInfo, "show_custom_head");
                this.addDefaultModelData(modelInfo, "can_hold_trolley");
                this.addDefaultModelData(modelInfo, "show_hata");
                this.addDefaultModelData(modelInfo, "can_hold_vehicle");
                this.addDefaultModelData(modelInfo, "can_riding_broom");
                if (!modelInfo.hasOwnProperty("easter_egg")) {
                    modelInfo["easter_egg"] = {
                        "encrypt": false,
                        "tag": ""
                    };
                } else {
                    let egg = modelInfo["easter_egg"];
                    if (!egg.hasOwnProperty("encrypt")) {
                        egg["encrypt"] = false;
                    }
                    if (!egg.hasOwnProperty("tag")) {
                        egg["tag"] = "";
                    }
                }
            },
            addChairDefaultModelData: function (modelInfo) {
                if (!modelInfo.hasOwnProperty("mounted_height")) {
                    modelInfo["mounted_height"] = 3;
                }
                if (!modelInfo.hasOwnProperty("no_gravity")) {
                    modelInfo["no_gravity"] = false;
                }
                this.addDefaultModelData(modelInfo, "tameable_can_ride");
            },
            selectedModel: function (index) {
                this.reset();
                this.selected = this.selected + " ";
                this.selected = this.selected.trim();
                this.selectedId = index;

                if (this.showInfo && this.showInfo.data && this.showInfo.data["model_list"]) {
                    let modelList = this.showInfo.data["model_list"];
                    if (this.selectedId < modelList.length) {
                        let modelInfo = modelList[this.selectedId];
                        if (!modelInfo.hasOwnProperty("render_item_scale")) {
                            modelInfo["render_item_scale"] = 1.0;
                        }
                        if (!modelInfo.hasOwnProperty("render_entity_scale")) {
                            modelInfo["render_entity_scale"] = 1.0;
                        }
                        if (this.selected === "maid") {
                            this.addMaidDefaultModelData(modelInfo);
                        } else {
                            this.addChairDefaultModelData(modelInfo);
                        }
                        let children = this.$children[1];
                        if (children) {
                            children.selectedModel(index);
                        }
                    }
                }
            },
            readInfo: function (type) {
                let namespacePath = `${this.assetsPath}/${this.openCategory}`;
                let modelListFile = (type === "maid") ? `${namespacePath}/maid_model.json` : `${namespacePath}/maid_chair.json`;
                if (fs.existsSync(modelListFile)) {
                    let info = new TlmPackInfo();
                    let text = fs.readFileSync(modelListFile, "utf8");
                    if (text.charCodeAt(0) === 0xFEFF) {
                        text = text.substr(1);
                    }
                    info.data = JSON.parse(text);

                    let version = info.data.version;
                    if (isEmpty(version)) {
                        info.version = [1, 0, 0];
                        info.data.version = "1.0.0";
                    } else {
                        info.version = splitStringVersion(version);
                    }

                    info.type = type;
                    info.namespace = this.openCategory;
                    info.namespacePath = namespacePath;
                    info.animationPath = `${namespacePath}/animation`;
                    info.langPath = `${namespacePath}/lang`;
                    info.modelsPath = `${namespacePath}/models/entity`;
                    info.texturesPath = `${namespacePath}/textures/entity`;
                    info.lang = getPackLanguage(info.langPath, "en_us");
                    info.local = getPackLanguage(info.langPath);

                    return info;
                }
            },
            hasModelListFile: function (type) {
                let namespacePath = `${this.assetsPath}/${this.openCategory}`;
                let modelListFile = (type === "maid") ? `${namespacePath}/maid_model.json` : `${namespacePath}/maid_chair.json`;
                return fs.existsSync(modelListFile);
            }
        },
        computed: {
            showInfo: function () {
                return this.readInfo(this.selected);
            },
            isShowList: function () {
                return this.showInfo && this.showInfo.data && this.showInfo.data["model_list"];
            },
            categoryIsEmpty: function () {
                return isEmpty(this.openCategory);
            }
        }
    };
</script>

<style scoped>
</style>