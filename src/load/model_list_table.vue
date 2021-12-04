<template>
    <div>
        <div class="models-table-top">
            <button style="width: 100%; height: 30px">
                <i class="fas fa-plus-circle"></i>
                {{tl("dialog.tlm_utils.load_pack.detail.model_list.add")}}
            </button>
        </div>
        <ul style="max-height: 550px; overflow-y: auto; text-align: center;" v-sortable="{onUpdate: onUpdateSort, handle:'.handle'}">
            <li :class="{'selected':index===parent.selectedId}" :key="modelInfo['model_id']" @click="parent.selectedModel(index)" class="model-item"
                v-for="(modelInfo, index) in parent.showInfo.data['model_list']">
                <p :title="tl('dialog.tlm_utils.load_pack.list.normal_egg')" class="egg" v-if="hasNormalEgg(modelInfo)">
                    <i class="fas fa-hashtag fa-fw"></i>
                    {{modelInfo["easter_egg"]["tag"]}}
                </p>
                <p :title="tl('dialog.tlm_utils.load_pack.list.encrypt_egg')" class="egg" v-else-if="hasEncryptEgg(modelInfo)">
                    <i class="fas fa-asterisk fa-fw"></i>
                    {{modelInfo["easter_egg"]["tag"].substr(0,10)+"..."}}
                </p>
                <p v-else>{{getLocalModelName(modelInfo)}}</p>
                <i :title="tl('dialog.tlm_utils.load_pack.list.sort.move')" class="fas fa-arrows-alt handle"></i>
            </li>
        </ul>
    </div>
</template>

<script>
    import {isEmpty} from "../utils/string";
    import {getTranslationResult} from "../utils/language";

    export default {
        props: {
            parent: {
                type: Object,
                required: true
            }
        },
        methods: {
            tl: tl,
            getLocalModelName: function (modelInfo) {
                let name = modelInfo["name"];
                let local = this.parent.showInfo.local;
                if (isEmpty(name)) {
                    let modelId = modelInfo["model_id"];
                    if (!isEmpty(modelId)) {
                        let key = `model.${modelId.replace(":", ".")}.name`;
                        if (!local || isEmpty(local[key])) {
                            return key;
                        }
                        return local[key];
                    }
                } else {
                    return getTranslationResult(name, local);
                }
            },
            onUpdateSort: function (event) {
                let info = this.parent.showInfo;
                let modelList = info.data["model_list"];
                modelList.splice(event.newIndex, 0, modelList.splice(event.oldIndex, 1)[0]);

                let modelListFile = (info.type === "maid") ? `${info.namespacePath}/maid_model.json` : `${info.namespacePath}/maid_chair.json`;
                let previousFile = fs.readFileSync(modelListFile, "utf8");
                if (previousFile.charCodeAt(0) === 0xFEFF) {
                    previousFile = previousFile.substr(1);
                }
                let previousData = JSON.parse(previousFile);
                previousData["model_list"] = modelList;
                fs.writeFileSync(modelListFile, autoStringify(previousData));
            },
            hasNormalEgg: function (modelInfo) {
                return modelInfo["easter_egg"] && modelInfo["easter_egg"]["tag"] && !isEmpty(modelInfo["easter_egg"]["tag"]) && !modelInfo["easter_egg"]["encrypt"];
            },
            hasEncryptEgg: function (modelInfo) {
                return modelInfo["easter_egg"] && modelInfo["easter_egg"]["tag"] && !isEmpty(modelInfo["easter_egg"]["tag"]) && modelInfo["easter_egg"]["encrypt"];
            }
        }
    };
</script>

<style scoped>
    .models-table-top {
        height: 32px;
        margin-bottom: 8px;
        margin-top: 0
    }

    .model-item {
        display: flex;
        width: 98%;
        height: 30px;
        margin: 1px;
        background-color: #3a3f4b;
        align-items: center;
    }

    .model-item:hover {
        background-color: #3e90ff;
        cursor: pointer;
    }

    .selected, .selected:hover {
        background-color: #21252b;
        pointer-events: none;
        border-left-color: #23d400;
        border-left-style: solid;
        border-left-width: 5px;
    }

    .selected > i {
        color: #3a3f4b;
    }

    .model-item > p {
        width: 83%;
        padding-left: 5%;
        margin-right: 2%;
        text-align: left;
        font-size: small;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .handle {
        width: 10%;
        margin-right: 5%;
        font-size: medium;
    }

    .handle:hover {
        color: #ffffff;
        cursor: grab;
    }

    .ghostClass, .sortable-drag, .sortable-chosen {
        background-color: darkred;
        cursor: grab;
    }

    .egg {
        font-style: italic;
        color: #92dcff;
    }
</style>