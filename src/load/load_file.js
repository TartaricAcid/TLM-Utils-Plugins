import {mkdirs} from "../utils/filesystem";
import {splitStringVersion, TlmPackInfo} from "../info/pack_info";
import {isEmpty} from "../utils/string";
import {dirname as _dirname} from "path";
import {getPackLanguage, getTranslationKey, getTranslationResult, writeLanguageFile} from "../utils/langreader";

const MAID = "maid";
const CHAIR = "chair"

export var loadPackAction = new Action("tlm_utils.load_pack", {
    name: "menu.tlm_utils.load_pack",
    icon: "unarchive",
    cachePath: "",
    click: function () {
        let filePaths = electron.dialog.showOpenDialogSync(currentwindow, {
            title: tl("dialog.tlm_utils.load_pack.title"),
            properties: ["openDirectory"]
        });
        if (filePaths) {
            let path = filePaths[0];
            if (path !== undefined && path !== null && path.length > 0) {
                checkIsPackFolder(path);
            }
        }
    }
});

function checkIsPackFolder(path) {
    if (!checkPackMcmeta(path) || !checkAssets(path)) {
        return;
    }

    let assetsPath = `${path}/assets`;
    let assetsFolder = fs.readdirSync(assetsPath);
    let namespaceMap = {};

    for (let subFolder of assetsFolder) {
        let stats = fs.statSync(`${assetsPath}/${subFolder}`);
        if (stats.isDirectory()) {
            namespaceMap[subFolder] = subFolder;
        }
    }

    if (namespaceMap.length === 0) {
        Blockbench.showMessageBox({
            title: "message.tlm_utils.prompt",
            message: "dialog.tlm_utils.load_pack.warn.namespace_not_exist",
            icon: "warning"
        }, function (result) {
        });
        return;
    }

    let select = new Dialog({
        title: "dialog.tlm_utils.load_pack.detail",
        width: 1280,
        singleButton: true,
        sidebar: {
            pages: namespaceMap,
            page: Object.keys(namespaceMap)[0],
            onPageSwitch(page) {
                select.content_vue.open_category = page;
                select.content_vue.is_edit_pack_info = false;
            }
        },
        component: {
            data: {
                open_category: Object.keys(namespaceMap)[0],
                selected: "maid",
                edit_pack_info: {},
                selected_icon_path: "",
                is_edit_pack_info: false,
                refresh_computed: false
            },
            methods: {
                readInfo: function (type) {
                    let namespacePath = `${assetsPath}/${this.open_category}`;
                    let modelFile = (type === MAID) ? `${namespacePath}/maid_model.json` : `${namespacePath}/maid_chair.json`;
                    if (fs.existsSync(modelFile)) {
                        let info = new TlmPackInfo();
                        info.data = JSON.parse(fs.readFileSync(modelFile, "utf8").replace(/^\uFEFF/, ""));

                        let version = info.data.version;
                        if (isEmpty(version)) {
                            info.version = [1, 0, 0];
                            info.data.version = "1.0.0";
                        } else {
                            info.version = splitStringVersion(version);
                        }

                        info.namespace = this.open_category;
                        info.namespace_path = namespacePath;
                        info.animation_path = `${namespacePath}/animation`;
                        info.lang_path = `${namespacePath}/lang`;
                        info.models_path = `${namespacePath}/models/entity`;
                        info.textures_path = `${namespacePath}/textures/entity`;
                        info.lang = getPackLanguage(info.lang_path)

                        return info
                    }
                },
                getStringVersion: function (version) {
                    if (version && version.length >= 3) {
                        return `${version[0]}.${version[1]}.${version[2]}`
                    } else {
                        return "1.0.0"
                    }
                },
                getModelName: function (modelInfo, langMap) {
                    let name = modelInfo["name"];
                    let modelId = modelInfo["model_id"]
                    if (isEmpty(name)) {
                        let key = `model.${modelId.replace(":", ".")}.name`;
                        if (isEmpty(langMap[key])) {
                            return key;
                        } else {
                            return langMap[key];
                        }
                    } else {
                        return getTranslationResult(name, langMap)
                    }
                },
                getPackName: function (packInfo) {
                    if (packInfo && packInfo.data && packInfo.data["pack_name"]) {
                        let name = packInfo.data["pack_name"];
                        return getTranslationResult(name, packInfo.lang)
                    }
                },
                getPackNameKey: function () {
                    if (this.edit_pack_info && this.edit_pack_info.data && this.edit_pack_info.data["pack_name"]) {
                        return getTranslationKey(this.edit_pack_info.data["pack_name"])
                    }
                },
                isShowList: function (packInfo) {
                    return packInfo && packInfo.data && packInfo.data["model_list"]
                },
                getDescription: function (packInfo) {
                    if (packInfo && packInfo.data && packInfo.data["description"]) {
                        let output = []
                        for (let keyRaw of packInfo.data["description"]) {
                            if (typeof keyRaw === "string") {
                                output.push(getTranslationResult(keyRaw, packInfo.lang));
                            }
                        }
                        if (output.length === 1) {
                            return output[0]
                        }
                        if (output.length >= 1) {
                            return output[0] + "..."
                        }
                    }
                },
                getDescriptionKeys: function () {
                    if (this.edit_pack_info && this.edit_pack_info.data) {
                        let output = []
                        if (this.edit_pack_info.data["description"]) {
                            for (let keyRaw of this.edit_pack_info.data["description"]) {
                                if (typeof keyRaw === "string") {
                                    output.push(getTranslationKey(keyRaw));
                                }
                            }
                        }
                        if (!output || output.length < 1) {
                            let key = `${this.selected}_pack.${this.open_category}.desc`;
                            let keyRaw = `{${key}}`;
                            this.edit_pack_info.lang[key] = ""
                            if (!this.edit_pack_info.data["description"]) {
                                this.edit_pack_info.data["description"] = []
                            }
                            this.edit_pack_info.data["description"].push(keyRaw)
                            output.push(key)
                        }
                        return output
                    }
                },
                getIconPath: function (packInfo) {
                    if (this.selected_icon_path) {
                        return this.selected_icon_path;
                    }
                    if (packInfo && packInfo.data && packInfo.data["icon"]) {
                        let icon = packInfo.data["icon"].replace(":", "/")
                        let iconPath = `${assetsPath}/${icon}`;
                        if (fs.existsSync(iconPath)) {
                            return iconPath
                        }
                    }
                },
                selectMaid: function () {
                    this.selected = "maid"
                    this.is_edit_pack_info = false
                    this.selected_icon_path = ""
                },
                selectChair: function () {
                    this.selected = "chair"
                    this.is_edit_pack_info = false
                    this.selected_icon_path = ""
                },
                clickEditPack: function () {
                    this.is_edit_pack_info = true;
                    if (this.selected === "maid") {
                        this.edit_pack_info = JSON.parse(JSON.stringify(this.maidInfo));
                    }
                    if (this.selected === "chair") {
                        this.edit_pack_info = JSON.parse(JSON.stringify(this.chairInfo));
                    }
                    if (!this.edit_pack_info.data["author"]) {
                        this.edit_pack_info.data["author"] = []
                    }
                    if (!this.edit_pack_info.data["description"]) {
                        this.edit_pack_info.data["description"] = []
                    }
                },
                openIconPath: function () {
                    let filePaths = electron.dialog.showOpenDialogSync(currentwindow, {
                        properties: ["openFile"],
                        title: tl("dialog.tlm_utils.create_new_pack.pack_icon.desc"),
                        filters: [{name: "PNG", extensions: ["png"]}]
                    });
                    if (filePaths) {
                        this.selected_icon_path = filePaths[0]
                    }
                },
                deleteAuthor: function (index) {
                    if (this.edit_pack_info && this.edit_pack_info.data && this.edit_pack_info.data["author"]) {
                        this.edit_pack_info.data["author"].splice(index, 1)
                    }
                },
                addAuthor: function () {
                    if (this.edit_pack_info && this.edit_pack_info.data) {
                        if (this.edit_pack_info.data["author"] && this.edit_pack_info.data["author"].length > 0) {
                            this.edit_pack_info.data["author"].push("")
                        } else {
                            this.edit_pack_info.data["author"] = [""]
                        }
                    }
                },
                clickConfirm: function () {
                    let namespacePath = `${assetsPath}/${this.open_category}`;
                    let modelFile = (this.selected === MAID) ? `${namespacePath}/maid_model.json` : `${namespacePath}/maid_chair.json`;
                    if (this.selected_icon_path) {
                        fs.writeFileSync(`${namespacePath}/textures/${this.selected}_icon.png`, fs.readFileSync(this.selected_icon_path))
                    }
                    this.edit_pack_info.data["icon"] = `${this.open_category}:textures/${this.selected}_icon.png`
                    this.edit_pack_info.data["version"] = `${this.edit_pack_info.version[0]}.${this.edit_pack_info.version[1]}.${this.edit_pack_info.version[2]}`
                    if (this.edit_pack_info.data["author"]) {
                        for (let author of this.edit_pack_info.data["author"]) {
                            if (isEmpty(author)) {
                                this.edit_pack_info.data["author"].splice(this.edit_pack_info.data["author"].indexOf(author))
                            }
                        }
                        if (this.edit_pack_info.data["author"].length < 1) {
                            delete this.edit_pack_info.data["author"]
                        }
                    }
                    if (this.edit_pack_info.data["description"]) {
                        for (let desc of this.edit_pack_info.data["description"]) {
                            let key = getTranslationKey(desc);
                            if (isEmpty(this.edit_pack_info.lang[key])) {
                                delete this.edit_pack_info.lang[key]
                                this.edit_pack_info.data["description"].splice(this.edit_pack_info.data["description"].indexOf(desc))
                            }
                        }
                        if (this.edit_pack_info.data["description"].length < 1) {
                            delete this.edit_pack_info.data["description"]
                        }
                    }
                    fs.writeFileSync(modelFile, autoStringify(this.edit_pack_info.data))
                    writeLanguageFile("en_us", this.edit_pack_info.lang_path, this.edit_pack_info.lang)
                    this.is_edit_pack_info = false
                    this.selected_icon_path = ""

                },
                clickCancel: function () {
                    this.is_edit_pack_info = false
                    this.selected_icon_path = ""
                }
            },
            computed: {
                maidInfo: function () {
                    return this.readInfo(MAID)
                },
                chairInfo: function () {
                    return this.readInfo(CHAIR)
                }
            },
            template: `
                <div style="display:flex">
                    <div style="width: 70%">
                        <div style="display: flex;">
                            <div v-if="maidInfo && maidInfo.data" style="width: 50%; height: 30px">
                                <button @click="selectMaid" style="width: 98%">
                                    {{tl("dialog.tlm_utils.create_new_model.choose_type.maid")}}
                                </button>
                            </div>
                            <div v-if="chairInfo && chairInfo.data" style="width: 50%; height: 30px">
                                <button @click="selectChair" style="width: 98%; margin-left: 2%">
                                    {{tl("dialog.tlm_utils.create_new_model.choose_type.chair")}}
                                </button>
                            </div>
                        </div>
                        <div v-if="selected==='maid' && isShowList(maidInfo)">
                            <div style="background-color: #21252b; padding: 10px; margin-top: 10px">
                                <div style="display: flex;">
                                    <div style="width: 100px; height: 100px; border-style: solid; border-width: 1px; border-color: #17191d">
                                        <div v-if="getIconPath(maidInfo)"
                                             style="width: 100%; height: 100%; padding: 5px">
                                            <img :src="getIconPath(maidInfo)" alt="" width="100%" height="100%">
                                        </div>
                                        <div v-else
                                             style="width: 100%; height: 100%; padding: 5px; display: flex; justify-content: center; align-items: center">
                                            <i class="far fa-4x fa-images"></i>
                                        </div>
                                    </div>
                                    <div style="padding-left: 10px; width: 77%">
                                        <p style="font-size: larger">{{getPackName(maidInfo)}}
                                            <span style="font-size: small; color: #848891; margin-left: 5px; background-color: #17191d; border-radius: 2px; padding: 0 5px">
                                                <i class="fas fa-tag"
                                                   style="font-size: smaller;"></i> {{getStringVersion(maidInfo.version)}}
                                            </span>
                                        </p>
                                        <p v-if="maidInfo.data['description']"
                                           style="color: #848891; font-size: small; margin: 0;">
                                            <i class="fas fa-comment-alt fa-fw"></i>
                                            {{getDescription(maidInfo)}}
                                        </p>
                                        <p style="color: #848891; font-size: small; margin: 0;">
                                            <i class="fas fa-user fa-fw"></i>
                                            <span v-for="author in maidInfo.data['author']">
                                                {{author}}
                                            </span>
                                        </p>
                                        <p style="color: #848891; font-size: small; margin: 0;">
                                            <i class="far fa-calendar-alt fa-fw"></i>
                                            {{maidInfo.data['date']}}
                                        </p>
                                    </div>
                                </div>
                                <div style="margin-top: 10px">
                                    <button style="width: 100%" @click="clickEditPack">
                                        <i class="fas fa-edit"></i>
                                        {{tl("dialog.tlm_utils.load_pack.detail.edit_pack_info")}}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div v-if="selected==='chair' && isShowList(chairInfo)">
                            <div style="background-color: #21252b; padding: 10px; margin-top: 10px">
                                <div style="display: flex;">
                                    <div style="width: 100px; height: 100px; border-style: solid; border-width: 1px; border-color: #17191d">
                                        <div v-if="getIconPath(chairInfo)"
                                             style="width: 100%; height: 100%; padding: 5px">
                                            <img :src="getIconPath(chairInfo)" alt="" width="100%" height="100%">
                                        </div>
                                        <div v-else
                                             style="width: 100%; height: 100%; padding: 5px; display: flex; justify-content: center; align-items: center">
                                            <i class="far fa-4x fa-images"></i>
                                        </div>
                                    </div>
                                    <div style="padding-left: 10px; width: 77%">
                                        <p style="font-size: larger">{{getPackName(chairInfo)}}
                                            <span style="font-size: small; color: #848891; margin-left: 5px; background-color: #17191d; border-radius: 2px; padding: 0 5px">
                                                <i class="fas fa-tag"
                                                   style="font-size: smaller;"></i> {{getStringVersion(chairInfo.version)}}
                                            </span>
                                        </p>
                                        <p v-if="chairInfo.data['description']"
                                           style="color: #848891; font-size: small; margin: 0;">
                                            <i class="fas fa-comment-alt fa-fw"></i>
                                            {{getDescription(chairInfo)}}
                                        </p>
                                        <p style="color: #848891; font-size: small; margin: 0;">
                                            <i class="fas fa-user fa-fw"></i>
                                            <span v-for="author in chairInfo.data['author']">
                                                {{author}}
                                            </span>
                                        </p>
                                        <p style="color: #848891; font-size: small; margin: 0;">
                                            <i class="far fa-calendar-alt fa-fw"></i>
                                            {{chairInfo.data['date']}}
                                        </p>
                                    </div>
                                </div>
                                <div style="margin-top: 10px">
                                    <button style="width: 100%" @click="clickEditPack">
                                        <i class="fas fa-edit"></i>
                                        {{tl("dialog.tlm_utils.load_pack.detail.edit_pack_info")}}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div style="width: 100%; margin-top: 10px">
                            <div v-if="is_edit_pack_info" style="height: 100%">
                                <div style="background-color: #21252b; width: 100%; height: 330px; overflow-y: auto; padding: 10px 20px">
                                    <div>
                                        <p style="margin: 0; padding: 0; font-size: large">{{tl("dialog.tlm_utils.load_pack.edit.pack_name")}}</p>
                                        <p style="margin: 0; padding: 0; color: #6a6a6d">{{tl("dialog.tlm_utils.load_pack.edit.pack_name.desc")}}</p>
                                        <input style="border-radius: 1px; margin-top:5px; padding: 5px; width: 100%; height:30px; font-size: 20px; background-color: #1c2026; border-style: solid; border-width: 1px; border-color: #181a1f;"
                                               v-model="edit_pack_info.lang[getPackNameKey(edit_pack_info)]"
                                               type="text">
                                    </div>
                                    <div style="display: flex; align-items: center; margin-top: 20px">
                                        <button style="min-width: 50px; width: 125px; height: 125px; border-radius: 1px; margin: 0; padding: 0"
                                                @click="openIconPath">
                                            <div v-if="getIconPath(edit_pack_info)" style="padding: 5px">
                                                <img :src="getIconPath(edit_pack_info)" alt="" width="115x"
                                                     height="115x">
                                            </div>
                                            <div v-else>
                                                <i class="far fa-4x fa-images"></i>
                                            </div>
                                        </button>
                                        <div style="margin-left: 20px">
                                            <h5 style="margin: 0; padding: 0">{{tl("dialog.tlm_utils.load_pack.edit.icon")}}</h5>
                                            <p style="color: #6a6a6d">{{tl("dialog.tlm_utils.load_pack.edit.icon.desc")}}</p>
                                        </div>
                                    </div>
                                    <div style="display: flex; align-items: center; margin-top: 10px">
                                        <input style="border-radius: 1px; margin-top:5px; padding: 2px; width: 35px; height:30px; font-size: 20px; background-color: #1c2026; border: #17191d 1px solid"
                                               v-model="edit_pack_info.version[0]" placeholder="1" type="number"
                                               value="1"
                                               step="1" min="0">
                                        <p style="font-weight: bold; font-size: 20px; margin: 15px 2px 2px;">
                                            .</p>
                                        <input style="border-radius: 1px; margin-top:5px; padding: 2px; width: 35px; height:30px; font-size: 20px; background-color: #1c2026; border: #17191d 1px solid"
                                               v-model="edit_pack_info.version[1]" placeholder="0" type="number"
                                               value="0"
                                               step="1" min="0">
                                        <p style="font-weight: bold; font-size: 20px; margin: 15px 2px 2px;">
                                            .</p>
                                        <input style="border-radius: 1px; margin-top:5px; padding: 2px; width: 35px; height:30px; font-size: 20px; background-color: #1c2026; border: #17191d 1px solid"
                                               v-model="edit_pack_info.version[2]" placeholder="0" type="number"
                                               value="0"
                                               step="1" min="0">
                                        <div style="margin-left: 20px">
                                            <p style="margin: 0; padding: 0; font-size: large">{{tl("dialog.tlm_utils.load_pack.edit.version")}}</p>
                                            <p style="margin: 0; padding: 0; color: #6a6a6d">{{tl("dialog.tlm_utils.load_pack.edit.version.desc")}}</p>
                                        </div>
                                    </div>
                                    <div style="display: flex; align-items: center; margin-top: 10px">
                                        <input type="date"
                                               style="border-radius: 1px; margin-top:5px; padding: 2px; width: 125px; height:30px; font-size: 13px; background-color: #1c2026; border-style: solid; border-width: 1px; border-color: #181a1f;"
                                               v-model="edit_pack_info.data['date']">
                                        <div style="margin-left: 20px">
                                            <p style="margin: 0; padding: 0; font-size: large">{{tl("dialog.tlm_utils.load_pack.edit.date")}}</p>
                                            <p style="margin: 0; padding: 0; color: #6a6a6d">{{tl("dialog.tlm_utils.load_pack.edit.date.desc")}}</p>
                                        </div>
                                    </div>
                                    <div style="display: flex; align-items: center; margin-top: 10px">
                                        <div>
                                            <div v-for="(author, index) in edit_pack_info.data['author']">
                                                <div style="display: flex">
                                                    <input type="text"
                                                           style="border-radius: 1px; margin-top:5px; padding: 2px; width: 90px; height:30px; font-size: 13px; background-color: #1c2026; border-style: solid; border-width: 1px; border-color: #181a1f;"
                                                           v-model="edit_pack_info.data['author'][index]">
                                                    <button style="width: 25px; min-width: 25px; height: 30px; min-height: 25px; margin: 5px; display: flex; justify-content: center; align-items: center"
                                                            @click="deleteAuthor(index)">
                                                        <i class="fas fa-trash-alt fa-align-center"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <button style="width: 125px; margin-top: 5px" @click="addAuthor">
                                                <i class="fas fa-user-plus fa-fw"></i>
                                            </button>
                                        </div>
                                        <div style="margin-left: 20px">
                                            <p style="margin: 0; padding: 0; font-size: large">{{tl("dialog.tlm_utils.load_pack.edit.author")}}</p>
                                            <p style="margin: 0; padding: 0; color: #6a6a6d">{{tl("dialog.tlm_utils.load_pack.edit.author.desc")}}</p>
                                        </div>
                                    </div>
                                    <div style="margin-top: 10px">
                                        <p style="margin: 0; padding: 0; font-size: large">{{tl("dialog.tlm_utils.load_pack.edit.description")}}</p>
                                        <p style="margin: 0; padding: 0; color: #6a6a6d">{{tl("dialog.tlm_utils.load_pack.edit.description.desc")}}</p>
                                        <div v-for="descKey in getDescriptionKeys()">
                                            <input style="border-radius: 1px; margin-top:5px; padding: 5px; width: 100%; height:30px; font-size: 20px; background-color: #1c2026; border-style: solid; border-width: 1px; border-color: #181a1f;"
                                                   v-model="edit_pack_info.lang[descKey]" type="text">
                                        </div>
                                    </div>
                                </div>
                                <div style="display: flex; margin: 10px">
                                    <div style="width: 50%">
                                        <button style="width: 98%"
                                                @click="clickConfirm">{{tl("button.tlm_utils.confirm")}}</button>
                                    </div>
                                    <div style="width: 50%">
                                        <button style="width: 98%; margin-left: 2%"
                                                @click="clickCancel">{{tl("button.tlm_utils.cancel")}}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="width: 30%; padding-left: 10px;">
                        <p style="height: 32px; color: #848891; justify-content: center; background-color: #21252b; display: flex; align-items: center; border-radius: 1px; margin-bottom: 8px; margin-top: 0">
                            <i class="fas fa-clipboard-list fa-fw"></i>
                            {{tl("dialog.tlm_utils.load_pack.detail.model_list")}}
                        </p>
                        <div v-if="selected==='maid' && isShowList(maidInfo)">
                            <ul style="max-height: 550px; overflow-y: auto; text-align: center;">
                                <li v-for="modelInfo in maidInfo.data['model_list']">
                                    <button style="width: 98%; height: 30px; margin: 1px; font-size: small">{{getModelName(modelInfo, maidInfo.lang)}}</button>
                                </li>
                            </ul>
                        </div>
                        <div v-if="selected==='chair' && isShowList(chairInfo)">
                            <ul style="max-height: 550px; overflow-y: auto; text-align: center;">
                                <li v-for="modelInfo in chairInfo.data['model_list']">
                                    <button style="width: 98%; height: 30px; margin: 1px; font-size: small">{{getModelName(modelInfo, chairInfo.lang)}}</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            `
        }
    });

    select.show();
}

function checkPackMcmeta(path) {
    let mcmetaPath = `${path}/pack.mcmeta`;
    if (fs.existsSync(mcmetaPath)) {
        if (!fs.statSync(mcmetaPath).isFile()) {
            Blockbench.showMessageBox({
                title: "message.tlm_utils.prompt",
                message: "dialog.tlm_utils.load_pack.warn.pack_mcmeta_not_file",
                icon: "warning"
            }, function (result) {
            });
            return false;
        }
    } else {
        Blockbench.showMessageBox({
            title: "message.tlm_utils.prompt",
            message: "dialog.tlm_utils.load_pack.warn.pack_mcmeta_not_file",
            icon: "warning"
        }, function (result) {
        });
        return false;
    }
    return true;
}

function checkAssets(path) {
    let assetsPath = `${path}/assets`;
    if (fs.existsSync(assetsPath)) {
        if (!fs.statSync(assetsPath).isDirectory()) {
            Blockbench.showMessageBox({
                title: "message.tlm_utils.prompt",
                message: "dialog.tlm_utils.load_pack.warn.assets_not_folder",
                icon: "warning"
            }, function (result) {
            });
            return false;
        }
    } else {
        Blockbench.showMessageBox({
            title: "message.tlm_utils.prompt",
            message: "dialog.tlm_utils.load_pack.warn.assets_not_exist",
            icon: "warning"
        }, function (result) {
        });
        return false;
    }
    return true;
}