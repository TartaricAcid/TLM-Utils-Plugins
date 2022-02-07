<template>
    <div>
        <div class="data-main">
            <button @click="clickCollapse" style="width: 100%">{{tl("dialog.tlm_utils.add_present.custom.collapse")}}</button>
            <vue-prism-editor :highlight="highlighter" :line-numbers="true" class="js_input dark_bordered" v-if="!collapse" v-model="example"/>
            <vue-prism-editor :highlight="highlighter" :line-numbers="true" class="js_input dark_bordered" v-model="code"/>

            <div style="display: flex; margin-top: 10px">
                <button @click="preview" style="width: 49%">{{tl("button.tlm_utils.preview")}}</button>
                <button @click="confirm" style="width: 49%; margin-left: 2%">{{tl("button.tlm_utils.save")}}</button>
            </div>
        </div>
    </div>
</template>

<script>
    import "../utils/prism.js";

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
                example: `// rootGroup: ${tl("dialog.tlm_utils.add_present.custom.example.root_group")}
let selected = rootGroup;
// addTlmGroup(group, pivot, rotation): ${tl("dialog.tlm_utils.add_present.custom.example.add_group")}
selected = addTlmGroup(selected, [0, 9.43, 0], [0, 32.5, 0]);
// addTlmCube(group, start, size, inflate): ${tl("dialog.tlm_utils.add_present.custom.example.add_cube")}
addTlmCube(selected, [-4, -4.25, -4], [8, 8, 8], -0.5);
// ${tl("dialog.tlm_utils.add_present.custom.example.math")}
`,
                code: "\n\n\n",
                collapse: false
            };
        },
        components: {VuePrismEditor},
        methods: {
            tl: tl,
            clickCollapse: function () {
                this.collapse = !this.collapse;
            },
            highlighter(code) {
                return highlight(code, Prism.languages.javascript);
            },
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
                let customCode = new Function("rootGroup", this.code);
                customCode(rootGroup);
                Undo.finishEdit("add_custom_code_bone", {
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
    .js_input {
        margin-top: 10px;
        overflow-y: hidden;
        min-height: 20px;
        height: auto;
        margin-bottom: auto;
        font-size: small;
    }
</style>