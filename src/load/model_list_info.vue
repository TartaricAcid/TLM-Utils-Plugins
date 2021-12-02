<template>
    <div>
        <!-- Model List Info -->
        <div style="background-color: #21252b; padding: 10px; margin-top: 10px">
            <!-- Info -->
            <div style="display: flex;">
                <!-- Icon -->
                <div style="width: 100px; height: 100px; border-style: solid; border-width: 1px; border-color: #17191d">
                    <div v-if="getIconPath(parent.showInfo)"
                         style="width: 100%; height: 100%; padding: 5px">
                        <img :src="getIconPath(parent.showInfo)" alt="" width="100%" height="100%">
                    </div>
                    <div v-else
                         style="width: 100%; height: 100%; padding: 5px; display: flex; justify-content: center; align-items: center">
                        <i class="far fa-4x fa-images"></i>
                    </div>
                </div>

                <!-- Text Info -->
                <div style="padding-left: 10px; width: 77%">
                    <p style="font-size: larger">
                        {{getPackName()}}
                        <span style="font-size: small; color: #848891; margin-left: 5px; background-color: #17191d; border-radius: 2px; padding: 0 5px">
                            <i class="fas fa-tag fa-fw" style="font-size: smaller;"></i>
                            {{getStringVersion()}}
                        </span>
                    </p>
                    <p v-if="parent.showInfo.data['description']"
                       style="color: #848891; font-size: small; margin: 0;">
                        <i class="fas fa-comment-alt fa-fw"></i>
                        {{getDescription()}}
                    </p>
                    <p style="color: #848891; font-size: small; margin: 0;">
                        <i class="fas fa-user fa-fw"></i>
                        <span v-for="(author,index) in parent.showInfo.data['author']" :key="index">
                            {{author}}
                        </span>
                    </p>
                    <p style="color: #848891; font-size: small; margin: 0;">
                        <i class="far fa-calendar-alt fa-fw"></i>
                        {{parent.showInfo.data["date"]}}
                    </p>
                </div>
            </div>

            <!-- Edit Info Button -->
            <div style="margin-top: 10px">
                <button style="width: 100%" @click="clickEditPack"
                        :class="{'inactive-tlm-edit-pack-button':isEditPackButtonActive}">
                    <i class="fas fa-edit"></i>
                    {{tl("dialog.tlm_utils.load_pack.detail.edit_pack_info")}}
                </button>
            </div>
        </div>

        <!-- Model List Info Edit -->
        <div v-if="isEditPackInfo" style="height: 100%; width: 100%; margin-top: 10px">
            <div style="background-color: #21252b; width: 100%; height: 330px; overflow-y: auto; padding: 10px 20px">
                <!-- Model List Name -->
                <div>
                    <p style="margin: 0; padding: 0; font-size: large">
                        {{tl("dialog.tlm_utils.load_pack.edit.pack_name")}}</p>
                    <p style="margin: 0; padding: 0; color: #6a6a6d">
                        {{tl("dialog.tlm_utils.load_pack.edit.pack_name.desc")}}</p>
                    <input style="border-radius: 1px; margin-top:5px; padding: 5px; width: 100%; height:30px; font-size: 20px; background-color: #1c2026; border-style: solid; border-width: 1px; border-color: #181a1f;"
                           v-model="editPackInfo.lang[packNameKey]" type="text">
                </div>

                <!-- Model Icon -->
                <div class="flex-edit-item">
                    <button style="min-width: 50px; width: 125px; height: 125px; border-radius: 1px; margin: 0; padding: 0"
                            @click="openIconPath">
                        <div v-if="getIconPath(editPackInfo)" style="padding: 5px">
                            <img :src="getIconPath(editPackInfo)" alt="" width="115x" height="115x">
                        </div>
                        <div v-else><i class="far fa-4x fa-images"></i></div>
                    </button>
                    <div style="margin-left: 20px">
                        <h5 style="margin: 0; padding: 0"> {{tl("dialog.tlm_utils.load_pack.edit.icon")}}</h5>
                        <p style="color: #6a6a6d">{{tl("dialog.tlm_utils.load_pack.edit.icon.desc")}}</p>
                    </div>
                </div>

                <!-- Model Version -->
                <div class="flex-edit-item">
                    <div class="version-input">
                        <input v-model="editPackInfo.version[0]" placeholder="1" type="number"
                               value="1" step="1" min="0">
                        <p>.</p>
                        <input v-model="editPackInfo.version[1]" placeholder="0" type="number"
                               value="0" step="1" min="0">
                        <p>.</p>
                        <input v-model="editPackInfo.version[2]" placeholder="0" type="number"
                               value="0" step="1" min="0">
                    </div>
                    <div style="margin-left: 20px">
                        <p style="margin: 0; padding: 0; font-size: large">
                            {{tl("dialog.tlm_utils.load_pack.edit.version")}}
                        </p>
                        <p style="margin: 0; padding: 0; color: #6a6a6d">
                            {{tl("dialog.tlm_utils.load_pack.edit.version.desc")}}
                        </p>
                    </div>
                </div>

                <!-- Model Date -->
                <div class="flex-edit-item">
                    <input type="date"
                           style="border-radius: 1px; margin-top:5px; padding: 2px; width: 125px; height:30px; font-size: 13px; background-color: #1c2026; border-style: solid; border-width: 1px; border-color: #181a1f;"
                           v-model="editPackInfo.data['date']">
                    <div style="margin-left: 20px">
                        <p style="margin: 0; padding: 0; font-size: large">
                            {{tl("dialog.tlm_utils.load_pack.edit.date")}}</p>
                        <p style="margin: 0; padding: 0; color: #6a6a6d">
                            {{tl("dialog.tlm_utils.load_pack.edit.date.desc")}}</p>
                    </div>
                </div>

                <!-- Model Author -->
                <div class="flex-edit-item">
                    <div>
                        <div v-for="(author, index) in editPackInfo.data['author']"
                             :key="index">
                            <div style="display: flex">
                                <input type="text"
                                       style="border-radius: 1px; margin-top:5px; padding: 2px; width: 90px; height:30px; font-size: 13px; background-color: #1c2026; border-style: solid; border-width: 1px; border-color: #181a1f;"
                                       v-model="editPackInfo.data['author'][index]">
                                <button style="width: 30px; min-width: 30px; height: 30px; min-height: 30px; margin: 5px 0 0 5px; display: flex; justify-content: center; align-items: center"
                                        @click="deleteAuthor(index)">
                                    <i class="fas fa-trash-alt fa-align-center"></i>
                                </button>
                            </div>
                        </div>
                        <button style="width: 127px; margin-top: 5px" @click="addAuthor">
                            <i class="fas fa-user-plus fa-fw"></i>
                        </button>
                    </div>
                    <div style="margin-left: 20px">
                        <p style="margin: 0; padding: 0; font-size: large">
                            {{tl("dialog.tlm_utils.load_pack.edit.author")}}
                        </p>
                        <p style="margin: 0; padding: 0; color: #6a6a6d">
                            {{tl("dialog.tlm_utils.load_pack.edit.author.desc")}}
                        </p>
                    </div>
                </div>

                <!-- Model Description -->
                <div style="margin-top: 20px">
                    <p style="margin: 0; padding: 0; font-size: large">
                        {{tl("dialog.tlm_utils.load_pack.edit.description")}}
                    </p>
                    <p style="margin: 0; padding: 0; color: #6a6a6d">
                        {{tl("dialog.tlm_utils.load_pack.edit.description.desc")}}
                    </p>
                    <div v-for="(key, index) in packDescKeys" :key="index">
                        <input style="border-radius: 1px; margin-top:5px; padding: 5px; width: 100%; height:30px; font-size: 20px; background-color: #1c2026; border-style: solid; border-width: 1px; border-color: #181a1f;"
                               v-model="editPackInfo.lang[key]" type="text">
                    </div>
                </div>
            </div>

            <!-- Info Edit Confirm Button -->
            <div style="display: flex; margin: 10px">
                <div style="width: 50%">
                    <button style="width: 98%" @click="clickConfirm">
                        {{tl("button.tlm_utils.confirm")}}
                    </button>
                </div>
                <div style="width: 50%">
                    <button style="width: 98%; margin-left: 2%" @click="clickCancel">
                        {{tl("button.tlm_utils.cancel")}}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getTranslationKey, getTranslationResult, writeLanguageFile} from "../utils/language";
    import {isEmpty} from "../utils/string";

    export default {
        props: {
            parent: {
                type: Object,
                required: true
            },
        },
        data() {
            return {
                editPackInfo: {},
                selectedIconPath: "",
                randomIconSuffix: 0,    // used to clean img cache
                isEditPackInfo: false,
            };
        },
        methods: {
            tl: tl,
            reset: function () {
                this.editPackInfo = {};
                this.selectedIconPath = "";
                this.isEditPackInfo = false;
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
            clickEditPack: function () {
                if (!this.isEditPackInfo) {
                    this.isEditPackInfo = true;
                    this.editPackInfo = this.parent.showInfo;
                    if (!this.editPackInfo.data["author"]) {
                        this.editPackInfo.data["author"] = [];
                    }
                    if (!this.editPackInfo.data["description"]) {
                        this.editPackInfo.data["description"] = [];
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
                if (this.editPackInfo && this.editPackInfo.data && this.editPackInfo.data["author"]) {
                    this.editPackInfo.data["author"].splice(index, 1);
                    this.$forceUpdate();
                }
            },
            addAuthor: function () {
                if (this.editPackInfo && this.editPackInfo.data) {
                    if (this.editPackInfo.data["author"] && this.editPackInfo.data["author"].length > 0) {
                        this.editPackInfo.data["author"].push("");
                    } else {
                        this.editPackInfo.data["author"] = [""];
                        this.$forceUpdate();
                    }
                }
            },
            clickConfirm: function () {
                let namespacePath = `${this.parent.assetsPath}/${this.parent.openCategory}`;
                let modelFile = (this.parent.selected === "maid") ? `${namespacePath}/maid_model.json` : `${namespacePath}/maid_chair.json`;
                if (this.selectedIconPath) {
                    fs.writeFileSync(`${namespacePath}/textures/${this.parent.selected}_icon.png`, fs.readFileSync(this.selectedIconPath));
                }
                this.editPackInfo.data["icon"] = `${this.parent.openCategory}:textures/${this.parent.selected}_icon.png`;
                this.editPackInfo.data["version"] = `${this.editPackInfo.version[0]}.${this.editPackInfo.version[1]}.${this.editPackInfo.version[2]}`;
                if (this.editPackInfo.data["author"]) {
                    for (let author of this.editPackInfo.data["author"]) {
                        if (isEmpty(author)) {
                            this.editPackInfo.data["author"].splice(this.editPackInfo.data["author"].indexOf(author));
                        }
                    }
                    if (this.editPackInfo.data["author"].length < 1) {
                        delete this.editPackInfo.data["author"];
                    }
                }
                if (this.editPackInfo.data["description"]) {
                    for (let desc of this.editPackInfo.data["description"]) {
                        let key = getTranslationKey(desc);
                        if (isEmpty(this.editPackInfo.lang[key])) {
                            delete this.editPackInfo.lang[key];
                            this.editPackInfo.data["description"].splice(this.editPackInfo.data["description"].indexOf(desc));
                        }
                    }
                    if (this.editPackInfo.data["description"].length < 1) {
                        delete this.editPackInfo.data["description"];
                    }
                }
                fs.writeFileSync(modelFile, autoStringify(this.editPackInfo.data));
                writeLanguageFile("en_us", this.editPackInfo.langPath, this.editPackInfo.lang);
                this.isEditPackInfo = false;
                this.selectedIconPath = "";
                this.randomIconSuffix = Math.random();
            },
            clickCancel: function () {
                this.isEditPackInfo = false;
                this.selectedIconPath = "";
                this.parent.selected = this.parent.selected + " ";
                this.parent.selected = this.parent.selected.trim();
            },
        },
        computed: {
            isEditPackButtonActive: function () {
                return this.isEditPackInfo;
            },
            packNameKey: function () {
                if (this.editPackInfo && this.editPackInfo.data && this.editPackInfo.data["pack_name"]) {
                    return getTranslationKey(this.editPackInfo.data["pack_name"]);
                }
            },
            packDescKeys: function () {
                if (this.editPackInfo && this.editPackInfo.data) {
                    let output = [];
                    if (this.editPackInfo.data["description"]) {
                        for (let keyRaw of this.editPackInfo.data["description"]) {
                            if (typeof keyRaw === "string") {
                                output.push(getTranslationKey(keyRaw));
                            }
                        }
                    }
                    if (!output || output.length < 1) {
                        let key = `${this.parent.selected}_pack.${this.parent.openCategory}.desc`;
                        let keyRaw = `{${key}}`;
                        this.editPackInfo.lang[key] = "";
                        if (!this.editPackInfo.data["description"]) {
                            this.editPackInfo.data["description"] = [];
                        }
                        this.editPackInfo.data["description"].push(keyRaw);
                        output.push(key);
                    }
                    return output;
                }
            },
        }
    };
</script>

<style scoped>
    .inactive-tlm-selected-type-button {
        background-color: #21252b;
        pointer-events: none;
    }

    .inactive-tlm-edit-pack-button {
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