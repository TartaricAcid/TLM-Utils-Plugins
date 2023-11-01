<template>
    <div>
        <div class="data-main">
            <button @click="clickCollapse" style="width: 100%">
                {{ tl("dialog.tlm_utils.add_present.custom.collapse") }}
            </button>
            <vue-prism-editor :highlight="highlighter" :line-numbers="false" class="js_input dark_bordered"
                              v-if="!collapse" v-model="example"/>
            <div style="display: flex; margin-top: 10px; font-size: larger">
                <button :title="tl('dialog.tlm_utils.add_present.custom.button.import')" @click="importCode"
                        style="width: 5%; min-width: 5%; padding: 0; margin-left: 83%">
                    <i class="fas fa-file-import fa-fw"></i></button>
                <button :title="tl('dialog.tlm_utils.add_present.custom.button.save')" @click="saveCode"
                        style="width: 5%; min-width: 5%; padding: 0; margin-left: 1%">
                    <i class="fas fa-save fa-fw"></i></button>
                <button :title="tl('dialog.tlm_utils.add_present.custom.button.clear')" @click="clearCode"
                        style="width: 5%; min-width: 5%; padding: 0; margin-left: 1%">
                    <i class="fas fa-trash-alt fa-fw"></i></button>
            </div>
            <vue-prism-editor :highlight="highlighter" :line-numbers="true" @blur="cacheCode"
                              class="js_input dark_bordered" v-model="code"/>
            <vue-prism-editor :highlight="highlighterError" :line-numbers="false" class="error_output" readonly="true"
                              v-if="error" v-model="error"/>

            <div style="display: flex; margin-top: 10px">
                <button @click="preview" style="width: 49%">{{ tl("button.tlm_utils.preview") }}</button>
                <button @click="confirm" style="width: 49%; margin-left: 2%">{{ tl("button.tlm_utils.save") }}</button>
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
            example: `// ${tl("dialog.tlm_utils.add_present.custom.example.title")}
// rootGroup: ${tl("dialog.tlm_utils.add_present.custom.example.root_group")}
let selected = rootGroup;
// addTlmGroup(group, pivot, rotation): ${tl("dialog.tlm_utils.add_present.custom.example.add_group")}
selected = addTlmGroup(selected, [0, 9.43, 0], [0, 32.5, 0]);
// addTlmCube(group, start, size, inflate): ${tl("dialog.tlm_utils.add_present.custom.example.add_cube")}
addTlmCube(selected, [-4, -4.25, -4], [8, 8, 8], -0.5);
// ${tl("dialog.tlm_utils.add_present.custom.example.math")}
`,
            code: "\n\n\n",
            error: "",
            collapse: true
        };
    },
    components: {VuePrismEditor},
    mounted() {
        this.initCode();
    },
    methods: {
        tl: tl,
        clearCode: function () {
            let index = electron.dialog.showMessageBoxSync(currentwindow, {
                title: tl("dialog.tlm_utils.add_present.custom.button.clear"),
                message: tl("dialog.tlm_utils.add_present.custom.button.clear.warning"),
                type: "warning",
                buttons: [tl("button.tlm_utils.confirm"), tl("button.tlm_utils.cancel")],
                defaultId: 1,
                cancelId: 1,
                noLink: true
            });
            if (index === 0) {
                this.code = "\n\n\n";
                this.cacheCode();
            }
        },
        saveCode: function () {
            let file = electron.dialog.showSaveDialogSync(currentwindow, {
                properties: ["showOverwriteConfirmation"],
                title: tl("dialog.tlm_utils.add_present.custom.button.save"),
                filters: [{name: "JS", extensions: ["js"]}]
            });
            if (file) {
                fs.writeFileSync(file, this.code, "utf8");
                Blockbench.showQuickMessage(tl("dialog.tlm_utils.add_present.custom.button.save.success"), 3000);
            }
        },
        importCode: function () {
            let filePaths = electron.dialog.showOpenDialogSync(currentwindow, {
                properties: ["openFile"],
                title: tl("dialog.tlm_utils.add_present.custom.button.import"),
                filters: [{name: "JS", extensions: ["js"]}]
            });
            if (filePaths) {
                this.code = fs.readFileSync(filePaths[0], "utf8");
                this.cacheCode();
            }
        },
        initCode: function () {
            let code = sessionStorage.getItem("AddPresentCustomCode");
            if (code) {
                this.code = code;
            }
        },
        cacheCode: function () {
            sessionStorage.setItem("AddPresentCustomCode", this.code);
        },
        clickCollapse: function () {
            this.collapse = !this.collapse;
        },
        highlighter(code) {
            return highlight(code, Prism.languages.javascript);
        },
        highlighterError(code) {
            return highlight(code, Prism.languages.jsstacktrace);
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
            try {
                this.error = false;
                customCode(rootGroup);
            } catch (e) {
                this.error = e.toString();
            }
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

.error_output {
    overflow-y: hidden;
    min-height: 20px;
    height: auto;
    margin-bottom: auto;
    font-size: small;
}
</style>