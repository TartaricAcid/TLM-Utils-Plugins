<template>
    <div>
        <div class="data-main">
            <div class="flex-edit-item">
                <input max="16" min="4" placeholder="4" step="1" type="number" v-model.number="side" value="4">
                <div style="margin-left: 20px">
                    <p class="data-item-title">{{tl("dialog.tlm_utils.add_present.pyramid.side.title")}}</p>
                    <p class="data-item-desc">{{tl("dialog.tlm_utils.add_present.pyramid.side.desc")}}</p>
                </div>
            </div>

            <div class="flex-edit-item">
                <input max="16" min="1" placeholder="6" step="1" type="number" v-model.number="iterate" value="6">
                <div style="margin-left: 20px">
                    <p class="data-item-title">{{tl("dialog.tlm_utils.add_present.pyramid.iterate.title")}}</p>
                    <p class="data-item-desc">{{tl("dialog.tlm_utils.add_present.pyramid.iterate.desc")}}</p>
                </div>
            </div>

            <div class="flex-edit-item">
                <input max="48" min="1" placeholder="5" step="1" type="number" v-model.number="width" value="5">
                <div style="margin-left: 20px">
                    <p class="data-item-title">{{tl("dialog.tlm_utils.add_present.pyramid.width.title")}}</p>
                    <p class="data-item-desc">{{tl("dialog.tlm_utils.add_present.pyramid.width.desc")}}</p>
                </div>
            </div>

            <div class="flex-edit-item">
                <input max="64" min="1" placeholder="10" step="1" type="number" v-model.number="height" value="10">
                <div style="margin-left: 20px">
                    <p class="data-item-title">{{tl("dialog.tlm_utils.add_present.pyramid.height.title")}}</p>
                    <p class="data-item-desc">{{tl("dialog.tlm_utils.add_present.pyramid.height.desc")}}</p>
                </div>
            </div>

            <div class="flex-edit-item">
                <input max="8" min="-8" placeholder="0" step="0.1" type="number" v-model.number="scale" value="0">
                <div style="margin-left: 20px">
                    <p class="data-item-title">{{tl("dialog.tlm_utils.add_present.pyramid.scale.title")}}</p>
                    <p class="data-item-desc">{{tl("dialog.tlm_utils.add_present.pyramid.scale.desc")}}</p>
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
                side: 4,
                iterate: 6,
                width: 5,
                height: 10,
                scale: 0
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

                let theta = Math.PI / this.side;
                let widthView = this.width + 2 * this.scale;
                let heightView = this.height + 2 * this.scale;
                let alpha = Math.asin(widthView / heightView) / 2;
                let beta = Math.asin(Math.tan(alpha) / Math.tan(theta));

                for (let i = 0; i < this.side; i++) {
                    let sideGroup = addTlmGroup(rootGroup, [0, 0, 0], [0, 360 / this.side * i, 0]);
                    let sideInnerGroup = addTlmGroup(sideGroup, [0, 0, -widthView * Math.cos(alpha) / Math.tan(theta)], [Math.radToDeg(beta), 0, 0]);
                    let leftGroup = addTlmGroup(sideInnerGroup, [0, -widthView * Math.sin(alpha), -widthView * Math.cos(alpha) / Math.tan(theta)], [0, 0, -Math.radToDeg(alpha)]);
                    let rightGroup = addTlmGroup(sideInnerGroup, [0, -widthView * Math.sin(alpha), -widthView * Math.cos(alpha) / Math.tan(theta)], [0, 0, Math.radToDeg(alpha)]);

                    let tmpA = widthView / Math.tan(alpha) - heightView;
                    let tmpB = -widthView * Math.sin(alpha) + heightView;
                    for (let j = 0; j < this.iterate; j++) {
                        if (j === 0) {
                            let start = [-widthView + this.scale, -widthView * Math.sin(alpha) + this.scale, -widthView * Math.cos(alpha) / Math.tan(theta) + this.scale];
                            let size = [this.width, this.height, this.width];
                            addTlmCube(leftGroup, start, [this.width, this.height, this.width], this.scale);
                            addTlmCube(rightGroup, [-start[0] - this.width, start[1], start[2]], size, this.scale);
                        } else {
                            let widthTmp = this.width;
                            let heightTmp = this.height;
                            let scaleTmp = 0;
                            do {
                                scaleTmp = (Math.sin(2 * alpha) / Math.sin(3 / 4 * Math.PI - 2 * alpha) * (tmpA - heightTmp + widthTmp) / Math.sqrt(2) - widthTmp) / 2;
                                if (widthTmp + 2 * scaleTmp > tmpA * Math.tan(alpha)) {
                                    break;
                                } else {
                                    heightTmp--;
                                }
                            } while (heightTmp >= widthTmp);

                            let start = [-widthView + scaleTmp, tmpB + scaleTmp, -widthView * Math.cos(alpha) / Math.tan(theta) + scaleTmp];
                            let size = [widthTmp, heightTmp, widthTmp];
                            addTlmCube(leftGroup, start, size, scaleTmp);
                            addTlmCube(rightGroup, [-start[0] - size[0], start[1], start[2]], size, scaleTmp);

                            tmpA = tmpA - (heightTmp + 2 * scaleTmp);
                            tmpB = tmpB + (heightTmp + 2 * scaleTmp);
                        }
                    }
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