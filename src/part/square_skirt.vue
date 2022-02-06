<template>
    <div>
        <div class="data-main">
            <div class="flex-edit-item">
                <input max="64" min="3" placeholder="6" step="1" type="number" v-model.number="count" value="6">
                <div style="margin-left: 20px">
                    <p class="data-item-title">{{tl("dialog.tlm_utils.add_present.square_skirt.count.title")}}</p>
                    <p class="data-item-desc">{{tl("dialog.tlm_utils.add_present.square_skirt.count.desc")}}</p>
                </div>
            </div>

            <div class="flex-edit-item">
                <input max="64" min="2" placeholder="6" step="1" type="number" v-model.number="length" value="6">
                <div style="margin-left: 20px">
                    <p class="data-item-title">{{tl("dialog.tlm_utils.add_present.square_skirt.length.title")}}</p>
                    <p class="data-item-desc">{{tl("dialog.tlm_utils.add_present.square_skirt.length.desc")}}</p>
                </div>
            </div>

            <div class="flex-edit-item">
                <input max="64" min="2" placeholder="6" step="1" type="number" v-model.number="height" value="6">
                <div style="margin-left: 20px">
                    <p class="data-item-title">{{tl("dialog.tlm_utils.add_present.square_skirt.height.title")}}</p>
                    <p class="data-item-desc">{{tl("dialog.tlm_utils.add_present.square_skirt.height.desc")}}</p>
                </div>
            </div>

            <div class="flex-edit-item">
                <input max="16" min="1" placeholder="2" step="1" type="number" v-model.number="side" value="2">
                <div style="margin-left: 20px">
                    <p class="data-item-title">{{tl("dialog.tlm_utils.add_present.square_skirt.side.title")}}</p>
                    <p class="data-item-desc">{{tl("dialog.tlm_utils.add_present.square_skirt.side.desc")}}</p>
                </div>
            </div>

            <div class="flex-edit-item">
                <input max="90" min="0" placeholder="10" step="1" type="number" v-model.number="deg" value="10">
                <div style="margin-left: 20px">
                    <p class="data-item-title">{{tl("dialog.tlm_utils.add_present.square_skirt.deg.title")}}</p>
                    <p class="data-item-desc">{{tl("dialog.tlm_utils.add_present.square_skirt.deg.desc")}}</p>
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
                length: 6,
                height: 6,
                side: 2,
                deg: 10
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
                let beta = Math.atan(Math.sin(Math.degToRad(this.deg) * Math.tan(Math.PI / this.count)));
                for (let i = 0; i < this.count; i++) {
                    let box1;
                    selectedGroup = addTlmGroup(selectedGroup, [0, 0, 0], [0, (360 / this.count) * i, 0]);
                    selectedGroup = addTlmGroup(selectedGroup, [0, 0, this.side * Math.cos(beta) + (this.length / 2)],
                        [-this.deg, 0, 0]);
                    addTlmCube(selectedGroup, [-this.length / 2, -this.side * Math.sin(beta), (this.side * Math.cos(beta) + this.length / 2) / Math.tan(Math.PI / this.count)],
                        [this.length, this.height, 0]);
                    box1 = addTlmGroup(selectedGroup, [this.length / 2, -this.side * Math.sin(beta), this.side * Math.cos(beta) + this.length / 2], [0, 0, Math.radToDeg(beta)]);
                    addTlmCube(box1, [this.length / 2, -this.side * Math.sin(beta), (this.side * Math.cos(beta) + this.length / 2) / Math.tan(Math.PI / this.count) - 0.001], [this.side, this.height, 0]);
                    box1 = addTlmGroup(selectedGroup, [-this.length / 2, -this.side * Math.sin(beta), this.side * Math.cos(beta) + this.length / 2], [0, 0, -Math.radToDeg(beta)]);
                    addTlmCube(box1, [-this.length / 2 - this.side, -this.side * Math.sin(beta), (this.side * Math.cos(beta) + this.length / 2) / Math.tan(Math.PI / this.count) + 0.001], [this.side, this.height, 0]);
                    selectedGroup = rootGroup;
                }

                Undo.finishEdit("add_square_skirt_bone", {
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