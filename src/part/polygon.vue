<template>
    <div>
        <div class="data-main">
            <div class="flex-edit-item">
                <input max="50" min="3" placeholder="6" step="1" type="number" v-model.number="count" value="6">
                <div style="margin-left: 20px">
                    <p class="data-item-title">{{tl("dialog.tlm_utils.add_present.polygon.count.title")}}</p>
                    <p class="data-item-desc">{{tl("dialog.tlm_utils.add_present.polygon.count.desc")}}</p>
                </div>
            </div>

            <div class="flex-edit-item">
                <input max="16" min="1" placeholder="2" step="1" type="number" v-model.number="width" value="2">
                <div style="margin-left: 20px">
                    <p class="data-item-title">{{tl("dialog.tlm_utils.add_present.polygon.width.title")}}</p>
                    <p class="data-item-desc">{{tl("dialog.tlm_utils.add_present.polygon.width.desc")}}</p>
                </div>
            </div>

            <div class="flex-edit-item">
                <input max="180" min="-180" placeholder="0" step="1" type="number" v-model.number="flip" value="0">
                <div style="margin-left: 20px">
                    <p class="data-item-title">{{tl("dialog.tlm_utils.add_present.polygon.flip.title")}}</p>
                    <p class="data-item-desc">{{tl("dialog.tlm_utils.add_present.polygon.flip.desc")}}</p>
                </div>
            </div>

            <div style="display: flex; margin-top: 10px">
                <button @click="preview" style="width: 49%">{{tl("button.tlm_utils.preview")}}</button>
                <button @click="confirm" style="width: 49%; margin-left: 2%">{{tl("button.tlm_utils.save")}}</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {addTlmCube, addTlmGroup} from "../utils/add";

    export default {
        props: {
            group: {
                type: Object,
                required: true
            },
            isPreview: {
                type: Object,
                required: true
            },
            dialog: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                count: 6,
                width: 2,
                flip: 0
            };
        },
        methods: {
            tl: tl,
            initRootGroup: function () {
                let rootGroup = new Group({
                    origin: this.group ? this.group.origin : undefined
                });
                this.isPreview.group = rootGroup;
                rootGroup.addTo(this.group);
                if (Format.bone_rig) {
                    rootGroup.createUniqueName();
                }
                rootGroup.init();
                return rootGroup;
            },
            generate: function () {
                Undo.initEdit({outliner: true, elements: [], selection: true});
                let cubesBefore = elements.length;

                let rootGroup = this.initRootGroup();
                let selectedGroup = rootGroup;
                for (let i = 0; i < this.count; i++) {
                    let z = (this.width / 2) / Math.tan(Math.PI / this.count);
                    let deg = 360 / this.count * i;
                    selectedGroup = addTlmGroup(selectedGroup, [0, 0, 0], [this.flip, deg, 0]);
                    addTlmCube(selectedGroup, [-this.width / 2, 0, z], [this.width, 1, 0]);
                    selectedGroup = rootGroup;
                }

                Undo.finishEdit("add_polygon_bone", {
                    outliner: true,
                    elements: elements.slice().slice(cubesBefore),
                    selection: true
                });

                Canvas.updateAll();
            },
            preview: function () {
                if (this.isPreview.data && this.isPreview.group) {
                    this.isPreview.group.remove(false);
                }
                this.generate();
                this.isPreview.data = true;
            },
            confirm: function () {
                if (this.isPreview.data && this.isPreview.group) {
                    this.isPreview.group.remove(false);
                }
                this.generate();
                this.isPreview.data = false;
                this.isPreview.group = false;
                this.dialog.hide();
            }
        }
    };
</script>

<style scoped>
    .flex-edit-item {
        display: flex;
        align-items: center;
        margin-bottom: 20px
    }

    .flex-edit-item > input {
        border-radius: 1px;
        margin-top: 5px;
        padding: 2px;
        text-align: center;
        width: 50px;
        height: 30px;
        font-size: 20px;
        background-color: #1c2026;
        border: #17191d 1px solid
    }

    .data-item-title {
        margin: 0;
        padding: 0;
        font-size: large
    }

    .data-item-desc {
        margin: 0;
        padding: 0;
        color: #6a6a6d
    }
</style>