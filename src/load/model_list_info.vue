<template>
    <div>
        <!-- Model List Info -->
        <div class="model-list-info">
            <!-- Info -->
            <div style="display: flex;">
                <!-- Icon -->
                <div class="model-list-info-icon">
                    <div class="model-list-info-icon-img" v-if="getIconPath(parent.showInfo)">
                        <img :src="getIconPath(parent.showInfo)" alt="" height="100%" width="100%">
                    </div>
                    <div class="model-list-info-icon-no-img" v-else>
                        <i class="far fa-4x fa-images"></i>
                    </div>
                </div>

                <!-- Text Info -->
                <div class="model-list-text">
                    <p style="font-size: larger">
                        {{getPackName()}}
                        <span class="model-list-info-version">
                            <i class="fas fa-tag fa-fw" style="font-size: smaller;"></i>
                            {{getStringVersion()}}
                        </span>
                    </p>
                    <p class="model-list-info-other" v-if="parent.showInfo.data['description']">
                        <i class="fas fa-comment-alt fa-fw"></i>
                        {{getDescription()}}
                    </p>
                    <p class="model-list-info-other">
                        <i class="fas fa-user fa-fw"></i>
                        <span :key="index" v-for="(author,index) in parent.showInfo.data['author']">
                            {{author}}
                        </span>
                    </p>
                    <p class="model-list-info-other">
                        <i class="far fa-calendar-alt fa-fw"></i>
                        {{parent.showInfo.data["date"]}}
                    </p>
                </div>
            </div>

            <!-- Edit Info Button -->
            <div style="margin-top: 10px; display: flex">
                <button :class="{'inactive-edit-list-button':isEditListInfoButtonActive}" @click="clickEditInfo" style="width: 100%">
                    <i class="fas fa-edit"></i>
                    {{tl("dialog.tlm_utils.load_pack.detail.edit_list_info")}}
                </button>
                <button :title="tl('dialog.tlm_utils.load_pack.list.delete')" @click="deleteModelList" class="model-list-edit-delete">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>

        <!-- Model List Info Edit -->
        <div class="model-list-edit" v-if="isEditModelListInfo">
            <div class="model-list-edit-main">
                <!-- Model List Name -->
                <div>
                    <p class="model-list-edit-item-title">{{tl("dialog.tlm_utils.load_pack.edit.pack_name")}}</p>
                    <p class="model-list-edit-item-desc">{{tl("dialog.tlm_utils.load_pack.edit.pack_name.desc")}}</p>
                    <input class="model-list-edit-name-input" type="text" v-model="modelListInfo.lang[packNameKey]">
                </div>

                <!-- Model Icon -->
                <div class="flex-edit-item">
                    <button @click="openIconPath" class="model-list-edit-icon">
                        <img :src="getIconPath(modelListInfo)" alt="" height="115x" style="padding: 5px" v-if="getIconPath(modelListInfo)" width="115x">
                        <div v-else><i class="far fa-4x fa-images"></i></div>
                    </button>

                    <div style="margin-left: 20px">
                        <h5 style="margin: 0; padding: 0">{{tl("dialog.tlm_utils.load_pack.edit.icon")}}</h5>
                        <p style="color: #6a6a6d">{{tl("dialog.tlm_utils.load_pack.edit.icon.desc")}}</p>
                    </div>
                </div>

                <!-- Model Version -->
                <div class="flex-edit-item">
                    <div class="version-input">
                        <input min="0" placeholder="1" step="1" type="number" v-model="modelListInfo.version[0]" value="1">
                        <p>.</p>
                        <input min="0" placeholder="0" step="1" type="number" v-model="modelListInfo.version[1]" value="0">
                        <p>.</p>
                        <input min="0" placeholder="0" step="1" type="number" v-model="modelListInfo.version[2]" value="0">
                    </div>

                    <div style="margin-left: 20px">
                        <p class="model-list-edit-item-title">{{tl("dialog.tlm_utils.load_pack.edit.version")}}</p>
                        <p class="model-list-edit-item-desc">{{tl("dialog.tlm_utils.load_pack.edit.version.desc")}}</p>
                    </div>
                </div>

                <!-- Model Date -->
                <div class="flex-edit-item">
                    <input class="model-list-edit-date-input" type="date" v-model="modelListInfo.data['date']">
                    <div style="margin-left: 20px">
                        <p class="model-list-edit-item-title">{{tl("dialog.tlm_utils.load_pack.edit.date")}}</p>
                        <p class="model-list-edit-item-desc">{{tl("dialog.tlm_utils.load_pack.edit.date.desc")}}</p>
                    </div>
                </div>

                <!-- Model Author -->
                <div class="flex-edit-item">
                    <div>
                        <div :key="index" style="display: flex" v-for="(author, index) in modelListInfo.data['author']">
                            <input class="model-list-edit-author-input" type="text" v-model="modelListInfo.data['author'][index]">
                            <button @click="deleteAuthor(index)" class="model-list-edit-author-delete">
                                <i class="fas fa-trash-alt fa-align-center"></i>
                            </button>
                        </div>
                        <button @click="addAuthor" style="width: 127px; margin-top: 5px">
                            <i class="fas fa-user-plus fa-fw"></i>
                        </button>
                    </div>

                    <div style="margin-left: 20px">
                        <p class="model-list-edit-item-title">{{tl("dialog.tlm_utils.load_pack.edit.author")}}</p>
                        <p class="model-list-edit-item-desc">{{tl("dialog.tlm_utils.load_pack.edit.author.desc")}}</p>
                    </div>
                </div>

                <!-- Model Description -->
                <div style="margin-top: 20px">
                    <p class="model-list-edit-item-title">{{tl("dialog.tlm_utils.load_pack.edit.description")}}</p>
                    <p class="model-list-edit-item-desc">{{tl("dialog.tlm_utils.load_pack.edit.description.desc")}}</p>
                    <div :key="index" v-for="(key, index) in packDescKeys">
                        <input class="model-list-edit-desc-input" type="text" v-model="modelListInfo.lang[key]">
                    </div>
                </div>
            </div>

            <!-- Info Edit Confirm Button -->
            <div style="display: flex; margin-top: 10px;">
                <button @click="clickConfirm" style="width: 48%">{{tl("button.tlm_utils.confirm")}}</button>
                <button @click="clickCancel" style="width: 48%; margin-left: 2%">{{tl("button.tlm_utils.cancel")}}</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {getTranslationKey, getTranslationResult, writeLanguageFile} from "../utils/language";
    import {isEmpty} from "../utils/string";
    import {join as pathJoin} from "path";
    import {mkdirs} from "../utils/filesystem";

    export default {
        props: {
            parent: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                modelListInfo: {},
                selectedIconPath: "",
                randomIconSuffix: 0,    // used to clean img cache
                isEditModelListInfo: false
            };
        },
        methods: {
            tl: tl,
            reset: function () {
                this.modelListInfo = {};
                this.selectedIconPath = "";
                this.isEditModelListInfo = false;
            },
            getIconPath: function (packInfo) {
                if (this.selectedIconPath) {
                    return this.selectedIconPath;
                }
                if (packInfo && packInfo.data && packInfo.data["icon"]) {
                    let icon = packInfo.data["icon"].replace(":", "/");
                    let iconPath = `${this.parent.assetsPath}/${icon}`;
                    if (fs.existsSync(iconPath)) {
                        return `${iconPath}?${this.randomIconSuffix}`;
                    }
                }
            },
            getPackName: function () {
                let showInfo = this.parent.showInfo;
                if (showInfo && showInfo.data && showInfo.data["pack_name"]) {
                    let name = showInfo.data["pack_name"];
                    return getTranslationResult(name, showInfo.lang);
                }
            },
            getStringVersion: function () {
                let showInfo = this.parent.showInfo;
                if (showInfo && showInfo.version && showInfo.version.length >= 3) {
                    let version = showInfo.version;
                    return `${version[0]}.${version[1]}.${version[2]}`;
                } else {
                    return "1.0.0";
                }
            },
            getDescription: function () {
                let showInfo = this.parent.showInfo;
                if (showInfo && showInfo.data && showInfo.data["description"]) {
                    let output = [];
                    for (let keyRaw of showInfo.data["description"]) {
                        if (typeof keyRaw === "string") {
                            output.push(getTranslationResult(keyRaw, showInfo.lang));
                        }
                    }
                    if (output.length === 1) {
                        return output[0];
                    }
                    if (output.length >= 1) {
                        return output[0] + "...";
                    }
                }
            },
            clickEditInfo: function () {
                if (!this.isEditModelListInfo) {
                    this.isEditModelListInfo = true;
                    this.modelListInfo = this.parent.showInfo;
                    if (!this.modelListInfo.data["author"]) {
                        this.modelListInfo.data["author"] = [];
                    }
                    if (!this.modelListInfo.data["description"]) {
                        this.modelListInfo.data["description"] = [];
                    }
                }
            },
            openIconPath: function () {
                let filePaths = electron.dialog.showOpenDialogSync(currentwindow, {
                    properties: ["openFile"],
                    title: tl("dialog.tlm_utils.create_new_pack.pack_icon.desc"),
                    filters: [{name: "PNG", extensions: ["png"]}]
                });
                if (filePaths) {
                    this.selectedIconPath = filePaths[0];
                }
            },
            deleteAuthor: function (index) {
                if (this.modelListInfo && this.modelListInfo.data && this.modelListInfo.data["author"]) {
                    this.modelListInfo.data["author"].splice(index, 1);
                    this.$forceUpdate();
                }
            },
            addAuthor: function () {
                if (this.modelListInfo && this.modelListInfo.data) {
                    if (this.modelListInfo.data["author"] && this.modelListInfo.data["author"].length > 0) {
                        this.modelListInfo.data["author"].push("");
                    } else {
                        this.modelListInfo.data["author"] = [""];
                        this.$forceUpdate();
                    }
                }
            },
            clickConfirm: function () {
                let namespacePath = `${this.parent.assetsPath}/${this.parent.openCategory}`;
                let modelListFile = (this.parent.selected === "maid") ? `${namespacePath}/maid_model.json` : `${namespacePath}/maid_chair.json`;
                if (this.selectedIconPath) {
                    fs.writeFileSync(`${namespacePath}/textures/${this.parent.selected}_icon.png`, fs.readFileSync(this.selectedIconPath));
                }
                this.modelListInfo.data["icon"] = `${this.parent.openCategory}:textures/${this.parent.selected}_icon.png`;
                this.modelListInfo.data["version"] = `${this.modelListInfo.version[0]}.${this.modelListInfo.version[1]}.${this.modelListInfo.version[2]}`;
                if (this.modelListInfo.data["author"]) {
                    for (let author of this.modelListInfo.data["author"]) {
                        if (isEmpty(author)) {
                            this.modelListInfo.data["author"].splice(this.modelListInfo.data["author"].indexOf(author));
                        }
                    }
                    if (this.modelListInfo.data["author"].length < 1) {
                        delete this.modelListInfo.data["author"];
                    }
                }
                if (this.modelListInfo.data["description"]) {
                    for (let desc of this.modelListInfo.data["description"]) {
                        let key = getTranslationKey(desc);
                        if (isEmpty(this.modelListInfo.lang[key])) {
                            delete this.modelListInfo.lang[key];
                            this.modelListInfo.data["description"].splice(this.modelListInfo.data["description"].indexOf(desc));
                        }
                    }
                    if (this.modelListInfo.data["description"].length < 1) {
                        delete this.modelListInfo.data["description"];
                    }
                }
                fs.writeFileSync(modelListFile, autoStringify(this.modelListInfo.data));
                writeLanguageFile("en_us", this.modelListInfo.langPath, this.modelListInfo.lang);
                this.isEditModelListInfo = false;
                this.selectedIconPath = "";
                this.randomIconSuffix = Math.random();
            },
            clickCancel: function () {
                this.isEditModelListInfo = false;
                this.selectedIconPath = "";
                this.parent.selected = this.parent.selected + " ";
                this.parent.selected = this.parent.selected.trim();
            },
            deleteModelList: function () {
                let index = electron.dialog.showMessageBoxSync(currentwindow, {
                    title: tl("dialog.tlm_utils.load_pack.list.delete"),
                    message: tl("dialog.tlm_utils.load_pack.list.delete.desc"),
                    type: "warning",
                    buttons: [tl("button.tlm_utils.confirm"), tl("button.tlm_utils.cancel")],
                    defaultId: 1,
                    cancelId: 1,
                    noLink: true
                });
                if (index === 0) {
                    let namespacePath = pathJoin(this.parent.assetsPath, this.parent.openCategory);
                    let selected = this.parent.selected;
                    let maidFile = pathJoin(namespacePath, "maid_model.json");
                    let chairFile = pathJoin(namespacePath, "maid_chair.json");
                    let hasMaidFile = fs.existsSync(maidFile);
                    let hasChairFile = fs.existsSync(chairFile);
                    if (hasMaidFile && hasChairFile) {
                        let file = selected === "maid" ? maidFile : chairFile;
                        let text = fs.readFileSync(file, "utf8");
                        if (text.charCodeAt(0) === 0xFEFF) {
                            text = text.substr(1);
                        }
                        let data = JSON.parse(text);

                        let pathDelete = [];

                        // delete icon
                        if (data["icon"]) {
                            let iconPath = pathJoin(this.parent.assetsPath, data["icon"].replace(":", "/"));
                            if (fs.existsSync(iconPath)) {
                                pathDelete.push(iconPath);
                            }
                        }

                        // check all model
                        let modelList = data["model_list"];
                        if (modelList) {
                            for (let model of modelList) {
                                // check model id
                                if (!model["model_id"]) {
                                    continue;
                                }
                                // delete all model
                                if (model["model"]) {
                                    let modelPath = pathJoin(this.parent.assetsPath, model["model"].replace(":", "/"));
                                    if (fs.existsSync(modelPath)) {
                                        pathDelete.push(modelPath);
                                    }
                                } else {
                                    let split = model["model_id"].split(":", 2);
                                    let modelPath = pathJoin(this.parent.assetsPath, split[0], "models", "entity", split[1] + ".json");
                                    if (fs.existsSync(modelPath)) {
                                        pathDelete.push(modelPath);
                                    }
                                }
                                // delete all texture
                                if (model["texture"]) {
                                    let texturePath = pathJoin(this.parent.assetsPath, model["texture"].replace(":", "/"));
                                    if (fs.existsSync(texturePath)) {
                                        pathDelete.push(texturePath);
                                    }
                                } else {
                                    let split = model["model_id"].split(":", 2);
                                    let texturePath = pathJoin(this.parent.assetsPath, split[0], "textures", "entity", split[1] + ".png");
                                    if (fs.existsSync(texturePath)) {
                                        pathDelete.push(texturePath);
                                    }
                                }
                            }
                        }

                        for (let deleteFile of pathDelete) {
                            electron.shell.trashItem(deleteFile).then(() => {
                            });
                        }
                        electron.shell.trashItem(file).then(() => {
                            this.parent.selected = selected === "maid" ? "chair" : "maid";
                            this.parent.$children.forEach(value => value.$forceUpdate());
                        });
                    } else {
                        electron.shell.trashItem(namespacePath).then(() => {
                            mkdirs(namespacePath);
                            mkdirs(`${namespacePath}/animation`);
                            mkdirs(`${namespacePath}/lang`);
                            mkdirs(`${namespacePath}/models/entity`);
                            mkdirs(`${namespacePath}/textures/entity`);
                            this.parent.selected += " ";
                            this.parent.selected = this.parent.selected.trim();
                            this.parent.$children.forEach(value => value.$forceUpdate());
                        });
                    }
                }
            }
        },
        computed: {
            isEditListInfoButtonActive: function () {
                return this.isEditModelListInfo;
            },
            packNameKey: function () {
                if (this.modelListInfo && this.modelListInfo.data && this.modelListInfo.data["pack_name"]) {
                    return getTranslationKey(this.modelListInfo.data["pack_name"]);
                }
            },
            packDescKeys: function () {
                if (this.modelListInfo && this.modelListInfo.data) {
                    let output = [];
                    if (this.modelListInfo.data["description"]) {
                        for (let keyRaw of this.modelListInfo.data["description"]) {
                            if (typeof keyRaw === "string") {
                                output.push(getTranslationKey(keyRaw));
                            }
                        }
                    }
                    if (!output || output.length < 1) {
                        let key = `${this.parent.selected}_pack.${this.parent.openCategory}.desc`;
                        let keyRaw = `{${key}}`;
                        this.modelListInfo.lang[key] = "";
                        if (!this.modelListInfo.data["description"]) {
                            this.modelListInfo.data["description"] = [];
                        }
                        this.modelListInfo.data["description"].push(keyRaw);
                        output.push(key);
                    }
                    return output;
                }
            }
        }
    };
</script>

<style scoped>
    .model-list-info {
        background-color: #21252b;
        padding: 10px;
        margin-top: 10px
    }

    .model-list-text {
        padding-left: 10px;
        width: 77%
    }

    .model-list-info-icon {
        width: 100px;
        height: 100px;
        border-style: solid;
        border-width: 1px;
        border-color: #17191d
    }

    .model-list-info-icon-img {
        width: 100%;
        height: 100%;
        padding: 5px
    }

    .model-list-info-icon-no-img {
        width: 100%;
        height: 100%;
        padding: 5px;
        display: flex;
        justify-content: center;
        align-items: center
    }

    .model-list-info-version {
        font-size: small;
        color: #848891;
        margin-left: 5px;
        background-color: #17191d;
        border-radius: 2px;
        padding: 0 5px
    }

    .model-list-info-other {
        color: #848891;
        font-size: small;
        margin: 0;
    }

    .model-list-edit {
        height: 100%;
        width: 100%;
        margin-top: 10px
    }

    .model-list-edit-main {
        background-color: #21252b;
        width: 100%;
        height: 330px;
        overflow-y: auto;
        padding: 10px 20px
    }

    .model-list-edit-item-title {
        margin: 0;
        padding: 0;
        font-size: large
    }

    .model-list-edit-item-desc {
        margin: 0;
        padding: 0;
        color: #6a6a6d
    }

    .model-list-edit-icon {
        min-width: 50px;
        width: 125px;
        height: 125px;
        border-radius: 1px;
        margin: 0;
        padding: 0
    }

    .model-list-edit-name-input, .model-list-edit-desc-input {
        border-radius: 1px;
        margin-top: 5px;
        padding: 5px;
        width: 100%;
        height: 30px;
        font-size: 20px;
        background-color: #1c2026;
        border-style: solid;
        border-width: 1px;
        border-color: #181a1f;
    }

    .model-list-edit-date-input {
        border-radius: 1px;
        margin-top: 5px;
        padding: 2px;
        width: 125px;
        height: 30px;
        font-size: 13px;
        background-color: #1c2026;
        border-style: solid;
        border-width: 1px;
        border-color: #181a1f;
    }

    .model-list-edit-author-input {
        border-radius: 1px;
        margin-top: 5px;
        padding: 2px;
        width: 90px;
        height: 30px;
        font-size: 13px;
        background-color: #1c2026;
        border-style: solid;
        border-width: 1px;
        border-color: #181a1f;
    }

    .model-list-edit-author-delete {
        width: 30px;
        min-width: 30px;
        height: 30px;
        min-height: 30px;
        margin: 5px 0 0 5px;
        display: flex;
        justify-content: center;
        align-items: center
    }

    .model-list-edit-delete {
        min-width: 30px;
        width: 30px;
        margin-left: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .inactive-edit-list-button {
        background-color: #1c2026;
        pointer-events: none;
    }

    .flex-edit-item {
        display: flex;
        align-items: center;
        margin-top: 20px
    }

    .version-input {
        display: flex;
    }

    .version-input > input {
        border-radius: 1px;
        margin-top: 5px;
        padding: 2px;
        width: 35px;
        height: 30px;
        font-size: 20px;
        background-color: #1c2026;
        border: #17191d 1px solid
    }

    .version-input > p {
        font-weight: bold;
        font-size: 20px;
        margin: 10px 2px 2px;
    }
</style>