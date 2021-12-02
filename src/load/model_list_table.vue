<template>
    <div>
        <p>
            <i class="fas fa-clipboard-list fa-fw"></i>
            {{tl("dialog.tlm_utils.load_pack.detail.model_list")}}
        </p>
        <ul style="max-height: 550px; overflow-y: auto; text-align: center;">
            <li v-for="modelInfo in parent.showInfo.data['model_list']" :key="modelInfo['model_id']">
                <button class="model-button"> {{getLocalModelName(modelInfo)}}</button>
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
            },
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
            }
        }
    };
</script>

<style scoped>
    p {
        height: 32px;
        color: #848891;
        justify-content: center;
        background-color: #21252b;
        display: flex;
        align-items: center;
        border-radius: 1px;
        margin-bottom: 8px;
        margin-top: 0
    }

    .model-button {
        width: 98%;
        height: 30px;
        margin: 1px;
        font-size: small
    }
</style>