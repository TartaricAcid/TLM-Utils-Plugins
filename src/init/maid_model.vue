<template>
    <div>
        <h1 style="text-align: center">{{ tl("dialog.tlm_utils.create_new_model.choose_type") }}</h1>
        <ul style="display: grid; max-height: 465px; padding: 5px; overflow-y: auto; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); grid-gap: 5px;">
            <li :style="{'background-color': '#17191d', 'cursor': 'pointer', 'text-align': 'center'}">
                <button @click="openDefaultMaidModelDialog" style="width: 100%; height: 100%">
                    <img :src="imgMaid" alt="" width="200px">
                    <h2 style="margin: 10px">{{ tl("dialog.tlm_utils.create_new_model.choose_type.maid") }}</h2>
                </button>
            </li>
            <li :style="{'background-color': '#17191d', 'cursor': 'pointer', 'text-align': 'center'}">
                <button @click="createEmptyWorkspace" style="width: 100%; height: 100%">
                    <img :src="imgChair" alt="" width="200px">
                    <h2 style="margin: 10px">{{ tl("dialog.tlm_utils.create_new_model.choose_type.chair") }}</h2>
                </button>
            </li>
        </ul>
    </div>
</template>

<script>
import TLM_IMG_MAID from "../../assets/img/maid.png";
import TLM_IMG_CHAIR from "../../assets/img/chair.png";
import {createDefaultDialog, defaultMaidModelDialog} from "./create_default";

export default {
    name: "maid_model_choose",
    data() {
        return {
            imgMaid: TLM_IMG_MAID,
            imgChair: TLM_IMG_CHAIR
        };
    },
    methods: {
        tl: tl,
        createEmptyWorkspace: function () {
            createDefaultDialog.hide();
            newProject(Formats["bedrock_old"]);
        },
        openDefaultMaidModelDialog: function () {
            createDefaultDialog.hide();
            defaultMaidModelDialog.show();
        }
    }
};
</script>

<style scoped>
</style>