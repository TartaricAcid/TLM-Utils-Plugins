<template>
    <div class="new-sub-model-pack-form-main">
        <div>
            <h5 style="margin: 0; padding: 0">
                {{tl("dialog.tlm_utils.load_pack.new.id")}}
                <span style="color: #ff0000">*</span>
            </h5>
            <p style="color: #6a6a6d">{{tl("dialog.tlm_utils.load_pack.new.id.desc")}}</p>
            <input class="new-sub-model-pack-form-input" v-model="newSubModelPackId" type="text"
                   @blur="checkNewSubModelPackId" required>
        </div>
        <div style="margin-top: 10px; height: 20px">
            <p style="color: red">{{newSubModelPackIdTip}}</p>
        </div>
        <div style="display: flex; margin-top: 15px">
            <div style="width: 50%; height: 30px">
                <button @click="newSubModelPackIdConfirm" style="width: 98%">
                    {{tl("button.tlm_utils.confirm")}}
                </button>
            </div>
            <div style="width: 50%; height: 30px">
                <button @click="newSubModelPackIdCancel" style="width: 98%; margin-left: 2%">
                    {{tl("button.tlm_utils.cancel")}}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import {mkdirs} from "../utils/filesystem";

    export default {
        props: {
            parent: {
                type: Object,
                required: true
            },
        },
        data() {
            return {
                newSubModelPackId: "",
                newSubModelPackIdTip: "",
            };
        },
        methods: {
            tl: tl,
            checkNewSubModelPackId: function () {
                this.newSubModelPackId = this.newSubModelPackId.toLowerCase().replace(/\s|-/g, "_");
                if (!this.newSubModelPackId) {
                    this.newSubModelPackIdTip = tl("dialog.tlm_utils.create_new_pack.pack_id.warn.empty.desc");
                    return false;
                }
                if (this.newSubModelPackId.length < 6) {
                    this.newSubModelPackIdTip = tl("dialog.tlm_utils.create_new_pack.pack_id.warn.length.desc");
                    return false;
                }
                if (!(/^[\w.]+$/.test(this.newSubModelPackId))) {
                    this.newSubModelPackIdTip = tl("dialog.tlm_utils.create_new_pack.pack_id.warn.invalid.desc");
                    return false;
                }
                if (this.parent.packEditDialog.sidebar.pages[this.newSubModelPackId]) {
                    this.newSubModelPackIdTip = tl("dialog.tlm_utils.load_pack.new.id.warn.duplicate");
                    return false;
                }
                this.newSubModelPackIdTip = "";
                return true;
            },
            newSubModelPackIdConfirm: function () {
                let pages = this.parent.packEditDialog.sidebar.pages;
                if (pages && this.checkNewSubModelPackId()) {
                    let createRootPath = `${this.parent.assetsPath}/${this.newSubModelPackId}`;
                    mkdirs(createRootPath);
                    mkdirs(`${createRootPath}/animation`);
                    mkdirs(`${createRootPath}/lang`);
                    mkdirs(`${createRootPath}/models/entity`);
                    mkdirs(`${createRootPath}/textures/entity`);
                    pages[this.newSubModelPackId] = this.newSubModelPackId;
                    this.parent.packEditDialog.sidebar.setPage(this.newSubModelPackId);
                    this.parent.packEditDialog.sidebar.build();
                }
            },
            newSubModelPackIdCancel: function () {
                let pages = this.parent.packEditDialog.sidebar.pages;
                if (pages && Object.keys(pages).length > 0) {
                    this.parent.packEditDialog.sidebar.setPage(Object.keys(pages)[0]);
                } else {
                    this.parent.packEditDialog.sidebar.setPage("");
                }
            }
        }
    };
</script>

<style scoped>
    .new-sub-model-pack-form-main {
        background-color: #21252b;
        width: 100%;
        height: 330px;
        overflow-y: auto;
        padding: 10px 20px
    }

    .new-sub-model-pack-form-input {
        border-radius: 1px;
        margin-top: 5px;
        padding: 5px;
        width: 100%;
        height: 50px;
        font-size: 30px;
        background-color: #1c2026;
    }
</style>