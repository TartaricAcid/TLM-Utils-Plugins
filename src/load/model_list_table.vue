<template>
    <div>
        <div class="models-table-top">
            <button style="width: 100%; height: 30px">
                <i class="fas fa-plus-circle"></i>
                {{tl("dialog.tlm_utils.load_pack.detail.model_list.add")}}
            </button>
        </div>
        <ul style="max-height: 550px; overflow-y: auto; text-align: center;" v-sortable="{onUpdate: onUpdateSort, handle:'.handle'}">
            <li :key="modelInfo['model_id']" class="model-item" v-for="modelInfo in parent.showInfo.data['model_list']">
                {{getLocalModelName(modelInfo)}}
                <i class="fas fa-arrows-alt handle"></i>
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
                // TODO: When edit pack is true
                fs.writeFileSync(modelListFile, autoStringify(info.data));
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
        position: relative;
        display: block;
        width: 98%;
        height: 30px;
        margin: 1px;
        padding: 5px 10px;
        font-size: small;
        text-align: left;
        background-color: #3a3f4b;
    }

    .model-item:hover {
        background-color: #3e90ff;
        cursor: pointer;
    }

    .handle {
        position: relative;
        display: inline-block;
        margin-top: 2px;
        font-size: medium;
        float: right;
    }

    .handle:hover {
        color: #ffffff;
        cursor: grab;
    }

    .ghostClass, .sortable-drag, .sortable-chosen {
        background-color: darkred;
        cursor: grab;
    }
</style>