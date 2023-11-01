<template>
    <div style="display: flex;">
        <button :class="{'inactive':isMaidButtonActive}" @click="selectMaid" class="left-button"
                v-if="hasModelListFile('maid')">
            {{ tl("dialog.tlm_utils.create_new_model.choose_type.maid") }}
        </button>
        <button @click="newModelList('maid')" class="left-button" v-else>
            <i class="fas fa-folder-plus"></i>
            {{ tl("button.tlm_utils.new_maid_list") }}
        </button>

        <button :class="{'inactive':isChairButtonActive}" @click="selectChair" class="right-button"
                v-if="hasModelListFile('chair')">
            {{ tl("dialog.tlm_utils.create_new_model.choose_type.chair") }}
        </button>
        <button @click="newModelList('chair')" class="right-button" v-else>
            <i class="fas fa-folder-plus"></i>
            {{ tl("button.tlm_utils.new_chair_list") }}
        </button>
    </div>
</template>

<script>
import {getPackLanguage} from "../utils/language";

export default {
    props: {
        parent: {
            type: Object,
            required: true
        }
    },
    data() {
        return {};
    },
    methods: {
        tl: tl,
        hasModelListFile: function (type) {
            let namespacePath = `${this.parent.assetsPath}/${this.parent.openCategory}`;
            let modelListFile = (type === "maid") ? `${namespacePath}/maid_model.json` : `${namespacePath}/maid_chair.json`;
            return fs.existsSync(modelListFile);
        },
        selectMaid: function () {
            if (this.parent.selected !== "maid") {
                this.parent.selected = "maid";
                this.parent.reset();
            }
        },
        selectChair: function () {
            if (this.parent.selected !== "chair") {
                this.parent.selected = "chair";
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
                let modelListFile = (type === "maid") ? `${namespacePath}/maid_model.json` : `${namespacePath}/maid_chair.json`;
                let packNameKey = `${type}_pack.${this.parent.openCategory}.name`;
                let initData = {
                    "pack_name": `{${packNameKey}}`,
                    "model_list": []
                };
                fs.writeFileSync(modelListFile, autoStringify(initData));
                let langPath = `${namespacePath}/lang`;
                let langMap = getPackLanguage(langPath, "en_us");
                langMap[packNameKey] = "";
                this.parent.selected = type + " ";
                this.parent.selected = this.parent.selected.trim();
                this.parent.reset();
                this.$forceUpdate();
            }
        }
    },
    computed: {
        isMaidButtonActive: function () {
            return this.parent.selected === "maid";
        },
        isChairButtonActive: function () {
            return this.parent.selected === "chair";
        }
    }
};
</script>

<style scoped>
.inactive {
    background-color: #21252b;
    pointer-events: none;
}

.left-button {
    width: 48%;
    height: 30px
}

.right-button {
    width: 48%;
    height: 30px;
    margin-left: 2%
}
</style>