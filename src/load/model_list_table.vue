<template>
    <div>
        <div class="models-table-top">
            <div class="bg" v-if="newModel"></div>
            <div :class="[newModel?'show':'hidden']" id="tlm-draggable">
                <div class="tlm-draggable-handle">
                    <p style="width: 100%">{{tl("dialog.tlm_utils.create_new_model.title")}}</p>
                    <i @click="closeNewModel" class="fas fa-window-close fa-fw"></i>
                </div>
                <div style="padding: 20px">
                    <div>
                        <h5 style="margin: 0; padding: 0">
                            {{tl("dialog.tlm_utils.create_new_model.id")}}
                            <span style="color: #ff0000">*</span>
                        </h5>
                        <p style="color: #6a6a6d">{{tl("dialog.tlm_utils.create_new_model.id.desc")}}</p>
                        <input @blur="checkNewModelId" class="new-model-id-input" required type="text" v-model.trim="newModelId">
                    </div>

                    <div class="flex-edit-item" v-if="hasProject">
                        <input style="width: 40px; padding-left: 10px;" type="checkbox" v-model="useProject">
                        <div style="margin-left: 10px">
                            <p style="margin: 0; padding: 0; font-size: large">
                                {{tl("dialog.tlm_utils.create_new_model.use_project")}}
                            </p>
                            <p style="margin: 0; padding: 0; color: #6a6a6d">
                                {{tl("dialog.tlm_utils.create_new_model.use_project.desc")}}
                            </p>
                        </div>
                    </div>

                    <div style="margin-top: 10px" v-if="isMaid && !useProject">
                        <h5 style="margin: 0; padding: 0">
                            {{tl("dialog.tlm_utils.create_new_model.present")}}
                        </h5>
                        <p style="color: #6a6a6d">{{tl("dialog.tlm_utils.create_new_model.present.desc")}}</p>
                        <select class="new-model-present-select" v-model="selected">
                            <option :key="key" :value="key" v-for="(value,key) in presentTypes">{{tl(value.name)}}</option>
                        </select>
                        <div class="present">
                            <label :for="key" :key="key" v-for="(value,key) in selectedPresent.form">
                                <input :id="key" :value="key" type="checkbox" v-model="selectedPresentGroups">
                                {{tl(value.label)}}
                            </label>
                        </div>
                    </div>

                    <div style="margin-top: 10px; height: 20px">
                        <p style="color: red">{{newModelIdTip}}</p>
                    </div>

                    <div style="display: flex; margin-top: 20px">
                        <button @click="confirmNewModel" style="width: 49%; height: 30px">{{tl("button.tlm_utils.confirm")}}</button>
                        <button @click="closeNewModel" style="width: 49%; height: 30px; margin-left: 2%">{{tl("button.tlm_utils.cancel")}}</button>
                    </div>
                </div>
            </div>
            <button @click="addNewModel" style="width: 100%; height: 30px">
                {{tl("dialog.tlm_utils.load_pack.detail.model_list.add")}}
            </button>
        </div>
        <ul style="max-height: 550px; overflow-y: auto; text-align: center;" v-sortable="{onUpdate: onUpdateSort, handle:'.handle', animation: 100}">
            <li :class="{'selected':index===parent.selectedId}" :key="modelInfo['model_id']" @click="parent.selectedModel(index)" class="model-item"
                v-for="(modelInfo, index) in parent.showInfo.data['model_list']">
                <p :title="tl('dialog.tlm_utils.load_pack.list.normal_egg')" class="egg" v-if="hasNormalEgg(modelInfo)">
                    <i class="fas fa-hashtag fa-fw"></i>
                    {{modelInfo["easter_egg"]["tag"]}}
                </p>
                <p :title="tl('dialog.tlm_utils.load_pack.list.encrypt_egg')" class="egg" v-else-if="hasEncryptEgg(modelInfo)">
                    <i class="fas fa-asterisk fa-fw"></i>
                    {{modelInfo["easter_egg"]["tag"].substr(0,10)+"..."}}
                </p>
                <p v-else>{{getLocalModelName(modelInfo)}}</p>
                <i :title="tl('dialog.tlm_utils.load_pack.model.delete')" @click.stop="deleteModel" class="fas fa-trash-alt delete" v-if="index===parent.selectedId"></i>
                <i :title="tl('dialog.tlm_utils.load_pack.list.sort.move')" class="fas fa-arrows-alt handle" v-if="index!==parent.selectedId"></i>
            </li>
        </ul>
    </div>
</template>

<script>
    import {isEmpty} from "../utils/string";
    import {getTranslationResult} from "../utils/language";
    import {join as pathJoin} from "path";
    import {presentModel} from "../model/preset";

    export default {
        props: {
            parent: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                newModel: false,
                newModelId: "",
                newModelIdTip: "",
                hasProject: false,
                useProject: false,
                presentTypes: presentModel,
                selected: "default",
                selectedPresentGroups: []
            };
        },
        methods: {
            tl: tl,
            reset: function () {
                this.newModelId = "";
                this.newModelIdTip = "";
                this.selectedPresentGroups.length = 0;
                this.useProject = false;
                let selectedModel = this.presentTypes[this.selected];
                for (let key of Object.keys(selectedModel.form)) {
                    if (selectedModel.form[key].value) {
                        this.selectedPresentGroups.push(key);
                    }
                }
            },
            checkProject: function () {
                if (Project && Project.selected && Project.format) {
                    let format = Project.format;
                    if (format.id !== "bedrock_old" && format.id !== "bedrock") {
                        return false;
                    }
                    return !(Project.groups.length === 0 && Project.elements.length === 0);

                }
                return false;
            },
            saveProject: function () {
                let codec = Project.format.codec;
                Project.save_path = this.getModelPath();
                codec.write(codec.compile(), Project.save_path);

                let textures = Project.textures;
                if (textures.length > 0) {
                    this.saveTexture(textures[0]);
                }
            },
            saveTexture: function (texture) {
                texture.path = this.getTexturePath();
                let image;
                if (texture.mode === "link") {
                    image = electron.nativeImage.createFromPath(texture.source.replace(/\?\d+$/, "")).toPNG();
                } else {
                    image = electron.nativeImage.createFromDataURL(texture.source).toPNG();
                }
                fs.writeFile(texture.path, image, () => {
                    texture.fromPath(texture.path);
                });
            },
            checkNewModelId: function () {
                this.newModelId = this.newModelId.toLowerCase().replace(/\s|-/g, "_");
                if (!this.newModelId) {
                    this.newModelIdTip = tl("dialog.tlm_utils.load_pack.new_model.warn.empty");
                    return false;
                }
                if (!(/^[\w.]+$/.test(this.newModelId))) {
                    this.newModelIdTip = tl("dialog.tlm_utils.create_new_pack.pack_id.warn.invalid.desc");
                    return false;
                }
                if (this.getAllModelIds.includes(this.newModelId)) {
                    this.newModelIdTip = tl("dialog.tlm_utils.load_pack.new_model.warn.duplicate");
                    return false;
                }
                this.newModelIdTip = "";
                return true;
            },
            copyPresentModel: function () {
                let copyModel = JSON.parse(JSON.stringify(this.selectedPresent.model));
                if (copyModel["geometry.model"] && copyModel["geometry.model"]["bones"]) {
                    let unselected = [];
                    let bones = copyModel["geometry.model"]["bones"];
                    for (let key of Object.keys(this.selectedPresent.form)) {
                        if (!this.selectedPresentGroups.includes(key)) {
                            unselected.push(key);
                        }
                    }
                    let bonesOut = [];
                    bones.forEach(bone => {
                        if (!unselected.includes(bone["name"])) {
                            bonesOut.push(bone);
                        }
                    });
                    copyModel["geometry.model"]["bones"] = bonesOut;
                }
                let modelPath = this.getModelPath();
                if (modelPath) {
                    fs.writeFileSync(modelPath, autoStringify(copyModel), "utf8");
                }
            },
            getModelPath: function () {
                if (this.parent.showInfo && !isEmpty(this.newModelId)) {
                    let info = this.parent.showInfo;
                    return pathJoin(info.modelsPath, this.newModelId + ".json");
                }
            },
            getTexturePath: function () {
                if (this.parent.showInfo && !isEmpty(this.newModelId)) {
                    let info = this.parent.showInfo;
                    return pathJoin(info.texturesPath, this.newModelId + ".png");
                }
            },
            confirmNewModel: function () {
                if (this.checkNewModelId()) {
                    let info = this.parent.showInfo;
                    let modelList = info.data["model_list"];
                    modelList.push({
                        "model_id": `${info.namespace}:${this.newModelId}`
                    });
                    let modelListFile = (info.type === "maid") ? `${info.namespacePath}/maid_model.json` : `${info.namespacePath}/maid_chair.json`;
                    fs.writeFileSync(modelListFile, autoStringify(info.data));
                    if (this.hasProject && this.useProject) {
                        this.saveProject();
                    } else {
                        this.copyPresentModel();
                    }
                    this.parent.selectedModel(this.parent.showInfo.data["model_list"].length - 1);
                    this.closeNewModel();
                }
            },
            closeNewModel: function () {
                this.newModel = false;
                $("#tlm-draggable").draggable("destroy");
            },
            addNewModel: function () {
                this.reset();
                this.newModel = true;
                this.hasProject = this.checkProject();
                let div = $("#tlm-draggable");
                div.draggable({
                    containment: [80, 30, 700, 550],
                    handle: ".tlm-draggable-handle",
                    stack: ".tlm-load-pack-main"
                });
                div.css("position", "absolute")
                    .css("left", "200px")
                    .css("top", "-20px");
            },
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
                let previousData = autoParseJSON(fs.readFileSync(modelListFile, "utf8"));
                if (previousData["model_list"]) {
                    let sortList = previousData["model_list"];
                    sortList.splice(event.newIndex, 0, sortList.splice(event.oldIndex, 1)[0]);
                }
                fs.writeFileSync(modelListFile, autoStringify(previousData));
            },
            getModelPathRes: function (modelInfo) {
                let modelId = modelInfo["model_id"];
                let model = modelInfo["model"];
                if (model) {
                    return model;
                } else {
                    let res = modelId.split(":", 2);
                    if (res.length > 1) {
                        return `${res[0]}:models/entity/${res[1]}.json`;
                    }
                }
            },
            getTexturePathRes: function (modelInfo) {
                let modelId = modelInfo["model_id"];
                let texture = modelInfo["texture"];
                if (texture) {
                    return texture;
                } else {
                    let res = modelId.split(":", 2);
                    if (res.length > 1) {
                        return `${res[0]}:textures/entity/${res[1]}.png`;
                    }
                }
            },
            resToPath: function (res) {
                let resSplit = res.split(":", 2);
                if (resSplit.length > 1) {
                    return pathJoin(this.parent.showInfo.namespacePath, resSplit[1]);
                }
            },
            deleteModel: function () {
                let index = electron.dialog.showMessageBoxSync(currentwindow, {
                    title: tl("dialog.tlm_utils.load_pack.model.delete"),
                    message: tl("dialog.tlm_utils.load_pack.model.delete.desc"),
                    type: "warning",
                    buttons: [tl("button.tlm_utils.confirm"), tl("button.tlm_utils.cancel")],
                    defaultId: 1,
                    cancelId: 1,
                    noLink: true
                });
                if (index === 0) {
                    let info = this.parent.showInfo;
                    let modelList = info.data["model_list"];
                    if (0 <= this.parent.selectedId && this.parent.selectedId < modelList.length) {
                        let delModelInfo = modelList[this.parent.selectedId];
                        let delModelRes = this.getModelPathRes(delModelInfo);
                        let delTextureRes = this.getTexturePathRes(delModelInfo);
                        let shouldDelModel = true;
                        let shouldDelTexture = true;

                        modelList.splice(this.parent.selectedId, 1);
                        let modelListFile = (info.type === "maid") ? `${info.namespacePath}/maid_model.json` : `${info.namespacePath}/maid_chair.json`;
                        fs.writeFileSync(modelListFile, autoStringify(info.data));

                        // Determine if other models are in use
                        for (let modelInfo of modelList) {
                            if (delModelRes === this.getModelPathRes(modelInfo)) {
                                shouldDelModel = false;
                            }
                            if (delTextureRes === this.getTexturePathRes(modelInfo)) {
                                shouldDelTexture = false;
                            }
                        }

                        let delModelPath = this.resToPath(delModelRes);
                        if (shouldDelModel && fs.existsSync(delModelPath)) {
                            electron.shell.trashItem(delModelPath);
                        }
                        let delTexturePath = this.resToPath(delTextureRes);
                        if (shouldDelTexture && fs.existsSync(delTexturePath)) {
                            electron.shell.trashItem(delTexturePath);
                        }

                        this.parent.reset();
                    }
                }
            },
            hasNormalEgg: function (modelInfo) {
                return modelInfo["easter_egg"] && modelInfo["easter_egg"]["tag"] && !isEmpty(modelInfo["easter_egg"]["tag"]) && !modelInfo["easter_egg"]["encrypt"];
            },
            hasEncryptEgg: function (modelInfo) {
                return modelInfo["easter_egg"] && modelInfo["easter_egg"]["tag"] && !isEmpty(modelInfo["easter_egg"]["tag"]) && modelInfo["easter_egg"]["encrypt"];
            }
        },
        computed: {
            getAllModelIds: function () {
                let modelList = this.parent.showInfo.data["model_list"];
                let output = [];
                for (let modelInfo of modelList) {
                    let modelIdSplit = modelInfo["model_id"].split(":", 2);
                    if (modelIdSplit.length > 1) {
                        output.push(modelIdSplit[1]);
                    }
                }
                return output;
            },
            selectedPresent: function () {
                return presentModel[this.selected];
            },
            isMaid: function () {
                return this.parent.showInfo.type === "maid";
            }
        }
    };
</script>

<style scoped>
    .flex-edit-item {
        display: flex;
        align-items: center;
        margin-top: 20px
    }

    .models-table-top {
        height: 32px;
        margin-bottom: 8px;
        margin-top: 0
    }

    .new-model-id-input {
        border-radius: 1px;
        margin-top: 5px;
        padding: 5px;
        width: 100%;
        height: 35px;
        font-size: 20px;
        background-color: #1c2026;
    }

    .new-model-present-select {
        border-radius: 1px;
        margin-top: 5px;
        padding-top: 0;
        padding-left: 5px;
        width: 100%;
        height: 30px;
        font-size: 20px;
    }

    .bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #21252b;
        opacity: 50%;
    }

    .present {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 2px;
        padding: 10px;
    }

    .hidden {
        visibility: hidden;
    }

    .show {
        visibility: visible;
        background-color: #17191d;
        box-shadow: 0 0 10px #181a1f;
        max-width: 800px;
    }

    .tlm-draggable-handle {
        height: 30px;
        background-color: #282c34;
        padding-left: 10px;
        padding-right: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    .tlm-draggable-handle > i:hover {
        color: indianred;
    }

    .model-item {
        display: flex;
        width: 98%;
        height: 30px;
        margin: 1px;
        background-color: #3a3f4b;
        align-items: center;
    }

    .model-item:hover {
        background-color: #3e90ff;
        cursor: pointer;
    }

    .model-item:hover .handle {
        display: block;
    }

    .selected, .selected:hover {
        background-color: #21252b;
        pointer-events: none;
        border-left-color: #23d400;
        border-left-style: solid;
        border-left-width: 5px;
    }

    .delete, .delete:hover {
        pointer-events: visible;
        color: #848891;
    }

    .selected > i {
        color: #3a3f4b;
    }

    .model-item > p {
        width: 83%;
        padding-left: 5%;
        margin-right: 2%;
        text-align: left;
        font-size: small;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .handle {
        width: 10%;
        margin-right: 5%;
        font-size: medium;
        display: none;
    }

    .handle:hover {
        color: #ffffff;
        cursor: grab;
    }

    .ghostClass, .sortable-drag, .sortable-chosen {
        background-color: darkred;
        cursor: grab;
    }

    .egg {
        font-style: italic;
        color: #92dcff;
    }
</style>