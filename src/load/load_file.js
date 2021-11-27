import { splitStringVersion, TlmPackInfo } from "../info/pack_info";
import { isEmpty } from "../utils/string";
import {
    getPackLanguage,
    getTranslationKey,
    getTranslationResult,
    writeLanguageFile,
} from "../utils/language";

var MAID = "maid";
var CHAIR = "chair";

export var loadPackAction = new Action("tlm_utils.load_pack", {
    name: "menu.tlm_utils.load_pack",
    icon: "unarchive",
    cachePath: "",
    click: function () {
        let filePaths = electron.dialog.showOpenDialogSync(currentwindow, {
            title: tl("dialog.tlm_utils.load_pack.title"),
            properties: ["openDirectory"],
        });
        if (filePaths) {
            let path = filePaths[0];
            if (path !== undefined && path !== null && path.length > 0) {
                checkIsPackFolder(path);
            }
        }
    },
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
        Blockbench.showMessageBox(
            {
                title: "message.tlm_utils.prompt",
                message: "dialog.tlm_utils.load_pack.warn.namespace_not_exist",
                icon: "warning",
            },
            function (result) {}
        );
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
                select.content_vue.openCategory = page;
                select.content_vue.isEditPackInfo = false;
                select.content_vue.selectedModelIndex = -1;
                select.content_vue.selectedIconPath = "";
                if (
                    select.content_vue.maidInfo &&
                    select.content_vue.maidInfo.data
                ) {
                    select.content_vue.selected = "maid";
                    return;
                }
                if (
                    select.content_vue.chairInfo &&
                    select.content_vue.chairInfo.data
                ) {
                    select.content_vue.selected = "chair";
                }
            },
        },
        component: {
            data: {
                openCategory: Object.keys(namespaceMap)[0],
                selected: "maid",
                editPackInfo: {},
                selectedIconPath: "",
                randomIconSuffix: 0, // used to clean img cache
                isEditPackInfo: false,
                selectedModelIndex: -1,
            },
            methods: {
                readInfo: function (type) {
                    let namespacePath = `${assetsPath}/${this.openCategory}`;
                    let modelFile =
                        type === MAID
                            ? `${namespacePath}/maid_model.json`
                            : `${namespacePath}/maid_chair.json`;
                    if (fs.existsSync(modelFile)) {
                        let info = new TlmPackInfo();
                        let text = fs.readFileSync(modelFile, "utf8");
                        if (text.charCodeAt(0) === 0xfeff) {
                            text = text.substr(1);
                        }
                        info.data = JSON.parse(text);

                        let version = info.data.version;
                        if (isEmpty(version)) {
                            info.version = [1, 0, 0];
                            info.data.version = "1.0.0";
                        } else {
                            info.version = splitStringVersion(version);
                        }

                        info.namespace = this.openCategory;
                        info.namespacePath = namespacePath;
                        info.animationPath = `${namespacePath}/animation`;
                        info.langPath = `${namespacePath}/lang`;
                        info.modelsPath = `${namespacePath}/models/entity`;
                        info.texturesPath = `${namespacePath}/textures/entity`;
                        info.lang = getPackLanguage(info.langPath, "en_us");
                        info.local = getPackLanguage(info.langPath);

                        return info;
                    }
                },
                getStringVersion: function () {
                    if (
                        this.showInfo &&
                        this.showInfo.version &&
                        this.showInfo.version.length >= 3
                    ) {
                        let version = this.showInfo.version;
                        return `${version[0]}.${version[1]}.${version[2]}`;
                    } else {
                        return "1.0.0";
                    }
                },
                getLocalModelName: function (modelInfo) {
                    let name = modelInfo["name"];
                    let local = this.showInfo.local;
                    if (isEmpty(name)) {
                        let modelId = modelInfo["model_id"];
                        let key = `model.${modelId.replace(":", ".")}.name`;
                        if (!local || isEmpty(local[key])) {
                            return key;
                        }
                        return local[key];
                    } else {
                        return getTranslationResult(name, local);
                    }
                },
                getPackName: function () {
                    if (
                        this.showInfo &&
                        this.showInfo.data &&
                        this.showInfo.data["pack_name"]
                    ) {
                        let name = this.showInfo.data["pack_name"];
                        return getTranslationResult(name, this.showInfo.lang);
                    }
                },
                getDescription: function () {
                    if (
                        this.showInfo &&
                        this.showInfo.data &&
                        this.showInfo.data["description"]
                    ) {
                        let output = [];
                        for (let keyRaw of this.showInfo.data["description"]) {
                            if (typeof keyRaw === "string") {
                                output.push(
                                    getTranslationResult(
                                        keyRaw,
                                        this.showInfo.lang
                                    )
                                );
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
                getIconPath: function (packInfo) {
                    if (this.selectedIconPath) {
                        return this.selectedIconPath;
                    }
                    if (packInfo && packInfo.data && packInfo.data["icon"]) {
                        let icon = packInfo.data["icon"].replace(":", "/");
                        let iconPath = `${assetsPath}/${icon}`;
                        if (fs.existsSync(iconPath)) {
                            return `${iconPath}?${this.randomIconSuffix}`;
                        }
                    }
                },
                selectMaid: function () {
                    if (this.selected !== MAID) {
                        this.selected = "maid";
                        this.isEditPackInfo = false;
                        this.selectedIconPath = "";
                        this.selectedModelIndex = -1;
                    }
                },
                selectChair: function () {
                    if (this.selected !== CHAIR) {
                        this.selected = "chair";
                        this.isEditPackInfo = false;
                        this.selectedIconPath = "";
                        this.selectedModelIndex = -1;
                    }
                },
                clickEditPack: function () {
                    if (!this.isEditPackInfo) {
                        this.isEditPackInfo = true;
                        this.selectedModelIndex = -1;
                        this.editPackInfo = this.showInfo;
                        if (!this.editPackInfo.data["author"]) {
                            this.editPackInfo.data["author"] = [];
                        }
                        if (!this.editPackInfo.data["description"]) {
                            this.editPackInfo.data["description"] = [];
                        }
                    }
                },
                openIconPath: function () {
                    let filePaths = electron.dialog.showOpenDialogSync(
                        currentwindow,
                        {
                            properties: ["openFile"],
                            title: tl(
                                "dialog.tlm_utils.create_new_pack.pack_icon.desc"
                            ),
                            filters: [{ name: "PNG", extensions: ["png"] }],
                        }
                    );
                    if (filePaths) {
                        this.selectedIconPath = filePaths[0];
                    }
                },
                deleteAuthor: function (index) {
                    if (
                        this.editPackInfo &&
                        this.editPackInfo.data &&
                        this.editPackInfo.data["author"]
                    ) {
                        this.editPackInfo.data["author"].splice(index, 1);
                        this.$forceUpdate();
                    }
                },
                addAuthor: function () {
                    if (this.editPackInfo && this.editPackInfo.data) {
                        if (
                            this.editPackInfo.data["author"] &&
                            this.editPackInfo.data["author"].length > 0
                        ) {
                            this.editPackInfo.data["author"].push("");
                        } else {
                            this.editPackInfo.data["author"] = [""];
                            this.$forceUpdate();
                        }
                    }
                },
                clickConfirm: function () {
                    let namespacePath = `${assetsPath}/${this.openCategory}`;
                    let modelFile =
                        this.selected === MAID
                            ? `${namespacePath}/maid_model.json`
                            : `${namespacePath}/maid_chair.json`;
                    if (this.selectedIconPath) {
                        fs.writeFileSync(
                            `${namespacePath}/textures/${this.selected}_icon.png`,
                            fs.readFileSync(this.selectedIconPath)
                        );
                    }
                    this.editPackInfo.data[
                        "icon"
                    ] = `${this.openCategory}:textures/${this.selected}_icon.png`;
                    this.editPackInfo.data[
                        "version"
                    ] = `${this.editPackInfo.version[0]}.${this.editPackInfo.version[1]}.${this.editPackInfo.version[2]}`;
                    if (this.editPackInfo.data["author"]) {
                        for (let author of this.editPackInfo.data["author"]) {
                            if (isEmpty(author)) {
                                this.editPackInfo.data["author"].splice(
                                    this.editPackInfo.data["author"].indexOf(
                                        author
                                    )
                                );
                            }
                        }
                        if (this.editPackInfo.data["author"].length < 1) {
                            delete this.editPackInfo.data["author"];
                        }
                    }
                    if (this.editPackInfo.data["description"]) {
                        for (let desc of this.editPackInfo.data[
                            "description"
                        ]) {
                            let key = getTranslationKey(desc);
                            if (isEmpty(this.editPackInfo.lang[key])) {
                                delete this.editPackInfo.lang[key];
                                this.editPackInfo.data["description"].splice(
                                    this.editPackInfo.data[
                                        "description"
                                    ].indexOf(desc)
                                );
                            }
                        }
                        if (this.editPackInfo.data["description"].length < 1) {
                            delete this.editPackInfo.data["description"];
                        }
                    }
                    fs.writeFileSync(
                        modelFile,
                        autoStringify(this.editPackInfo.data)
                    );
                    writeLanguageFile(
                        "en_us",
                        this.editPackInfo.langPath,
                        this.editPackInfo.lang
                    );
                    this.isEditPackInfo = false;
                    this.selectedIconPath = "";
                    this.randomIconSuffix = Math.random();
                },
                clickCancel: function () {
                    this.isEditPackInfo = false;
                    this.selectedIconPath = "";
                    this.selected = this.selected + " ";
                    this.selected = this.selected.trim();
                },
            },
            computed: {
                maidInfo: function () {
                    return this.readInfo(MAID);
                },
                chairInfo: function () {
                    return this.readInfo(CHAIR);
                },
                showInfo: function () {
                    return this.readInfo(this.selected);
                },
                isShowList: function () {
                    return (
                        this.showInfo &&
                        this.showInfo.data &&
                        this.showInfo.data["model_list"]
                    );
                },
                packNameKey: function () {
                    if (
                        this.editPackInfo &&
                        this.editPackInfo.data &&
                        this.editPackInfo.data["pack_name"]
                    ) {
                        return getTranslationKey(
                            this.editPackInfo.data["pack_name"]
                        );
                    }
                },
                packDescKeys: function () {
                    if (this.editPackInfo && this.editPackInfo.data) {
                        let output = [];
                        if (this.editPackInfo.data["description"]) {
                            for (let keyRaw of this.editPackInfo.data[
                                "description"
                            ]) {
                                if (typeof keyRaw === "string") {
                                    output.push(getTranslationKey(keyRaw));
                                }
                            }
                        }
                        if (!output || output.length < 1) {
                            let key = `${this.selected}_pack.${this.openCategory}.desc`;
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
                isMaidButtonActive: function () {
                    return this.selected === MAID;
                },
                isChairButtonActive: function () {
                    return this.selected === CHAIR;
                },
                isEditPackButtonActive: function () {
                    return this.isEditPackInfo;
                }
            },
            template: `
                <div style="display:flex">
                    <div style="width: 70%">
                        <div style="display: flex;">
                            <div v-if="maidInfo && maidInfo.data" style="width: 50%; height: 30px">
                                <button @click="selectMaid" style="width: 98%"
                                        v-bind:class="{'inactive-tlm-selected-type-button':isMaidButtonActive}">
                                    {{tl("dialog.tlm_utils.create_new_model.choose_type.maid")}}
                                </button>
                            </div>
                            <div v-if="chairInfo && chairInfo.data" style="width: 50%; height: 30px">
                                <button @click="selectChair" style="width: 98%; margin-left: 2%"
                                        v-bind:class="{'inactive-tlm-selected-type-button':isChairButtonActive}">
                                    {{tl("dialog.tlm_utils.create_new_model.choose_type.chair")}}
                                </button>
                            </div>
                        </div>
                        <div v-if="isShowList">
                            <div style="background-color: #21252b; padding: 10px; margin-top: 10px">
                                <div style="display: flex;">
                                    <div style="width: 100px; height: 100px; border-style: solid; border-width: 1px; border-color: #17191d">
                                        <div v-if="getIconPath(showInfo)"
                                             style="width: 100%; height: 100%; padding: 5px">
                                            <img :src="getIconPath(showInfo)" alt="" width="100%" height="100%">
                                        </div>
                                        <div v-else
                                             style="width: 100%; height: 100%; padding: 5px; display: flex; justify-content: center; align-items: center">
                                            <i class="far fa-4x fa-images"></i>
                                        </div>
                                    </div>
                                    <div style="padding-left: 10px; width: 77%">
                                        <p style="font-size: larger">{{getPackName()}}
                                            <span style="font-size: small; color: #848891; margin-left: 5px; background-color: #17191d; border-radius: 2px; padding: 0 5px">
                                                <i class="fas fa-tag"
                                                   style="font-size: smaller;"></i> {{getStringVersion()}}
                                            </span>
                                        </p>
                                        <p v-if="showInfo.data['description']"
                                           style="color: #848891; font-size: small; margin: 0;">
                                            <i class="fas fa-comment-alt fa-fw"></i>
                                            {{getDescription()}}
                                        </p>
                                        <p style="color: #848891; font-size: small; margin: 0;">
                                            <i class="fas fa-user fa-fw"></i>
                                            <span v-for="(author,index) in showInfo.data['author']" :key="index">
                                                {{author}}
                                            </span>
                                        </p>
                                        <p style="color: #848891; font-size: small; margin: 0;">
                                            <i class="far fa-calendar-alt fa-fw"></i>
                                            {{showInfo.data['date']}}
                                        </p>
                                    </div>
                                </div>
                                <div style="margin-top: 10px">
                                    <button style="width: 100%" @click="clickEditPack"
                                            v-bind:class="{'inactive-tlm-edit-pack-button':isEditPackButtonActive}">
                                        <i class="fas fa-edit"></i>
                                        {{tl("dialog.tlm_utils.load_pack.detail.edit_pack_info")}}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div style="width: 100%; margin-top: 10px">
                            <div v-if="isEditPackInfo" style="height: 100%">
                                <div style="background-color: #21252b; width: 100%; height: 330px; overflow-y: auto; padding: 10px 20px">
                                    <div>
                                        <p style="margin: 0; padding: 0; font-size: large">{{tl("dialog.tlm_utils.load_pack.edit.pack_name")}}</p>
                                        <p style="margin: 0; padding: 0; color: #6a6a6d">{{tl("dialog.tlm_utils.load_pack.edit.pack_name.desc")}}</p>
                                        <input style="border-radius: 1px; margin-top:5px; padding: 5px; width: 100%; height:30px; font-size: 20px; background-color: #1c2026; border-style: solid; border-width: 1px; border-color: #181a1f;"
                                               v-model="editPackInfo.lang[packNameKey]"
                                               type="text">
                                    </div>
                                    <div style="display: flex; align-items: center; margin-top: 20px">
                                        <button style="min-width: 50px; width: 125px; height: 125px; border-radius: 1px; margin: 0; padding: 0"
                                                @click="openIconPath">
                                            <div v-if="getIconPath(editPackInfo)" style="padding: 5px">
                                                <img :src="getIconPath(editPackInfo)" alt="" width="115x"
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
                                    <div style="display: flex; align-items: center; margin-top: 20px">
                                        <input style="border-radius: 1px; margin-top:5px; padding: 2px; width: 35px; height:30px; font-size: 20px; background-color: #1c2026; border: #17191d 1px solid"
                                               v-model="editPackInfo.version[0]" placeholder="1" type="number"
                                               value="1"
                                               step="1" min="0">
                                        <p style="font-weight: bold; font-size: 20px; margin: 15px 2px 2px;">
                                            .</p>
                                        <input style="border-radius: 1px; margin-top:5px; padding: 2px; width: 35px; height:30px; font-size: 20px; background-color: #1c2026; border: #17191d 1px solid"
                                               v-model="editPackInfo.version[1]" placeholder="0" type="number"
                                               value="0"
                                               step="1" min="0">
                                        <p style="font-weight: bold; font-size: 20px; margin: 15px 2px 2px;">
                                            .</p>
                                        <input style="border-radius: 1px; margin-top:5px; padding: 2px; width: 35px; height:30px; font-size: 20px; background-color: #1c2026; border: #17191d 1px solid"
                                               v-model="editPackInfo.version[2]" placeholder="0" type="number"
                                               value="0"
                                               step="1" min="0">
                                        <div style="margin-left: 20px">
                                            <p style="margin: 0; padding: 0; font-size: large">{{tl("dialog.tlm_utils.load_pack.edit.version")}}</p>
                                            <p style="margin: 0; padding: 0; color: #6a6a6d">{{tl("dialog.tlm_utils.load_pack.edit.version.desc")}}</p>
                                        </div>
                                    </div>
                                    <div style="display: flex; align-items: center; margin-top: 20px">
                                        <input type="date"
                                               style="border-radius: 1px; margin-top:5px; padding: 2px; width: 125px; height:30px; font-size: 13px; background-color: #1c2026; border-style: solid; border-width: 1px; border-color: #181a1f;"
                                               v-model="editPackInfo.data['date']">
                                        <div style="margin-left: 20px">
                                            <p style="margin: 0; padding: 0; font-size: large">{{tl("dialog.tlm_utils.load_pack.edit.date")}}</p>
                                            <p style="margin: 0; padding: 0; color: #6a6a6d">{{tl("dialog.tlm_utils.load_pack.edit.date.desc")}}</p>
                                        </div>
                                    </div>
                                    <div style="display: flex; align-items: center; margin-top: 20px">
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
                                            <p style="margin: 0; padding: 0; font-size: large">{{tl("dialog.tlm_utils.load_pack.edit.author")}}</p>
                                            <p style="margin: 0; padding: 0; color: #6a6a6d">{{tl("dialog.tlm_utils.load_pack.edit.author.desc")}}</p>
                                        </div>
                                    </div>
                                    <div style="margin-top: 20px">
                                        <p style="margin: 0; padding: 0; font-size: large">{{tl("dialog.tlm_utils.load_pack.edit.description")}}</p>
                                        <p style="margin: 0; padding: 0; color: #6a6a6d">{{tl("dialog.tlm_utils.load_pack.edit.description.desc")}}</p>
                                        <div v-for="(key, index) in packDescKeys" :key="index">
                                            <input style="border-radius: 1px; margin-top:5px; padding: 5px; width: 100%; height:30px; font-size: 20px; background-color: #1c2026; border-style: solid; border-width: 1px; border-color: #181a1f;"
                                                   v-model="editPackInfo.lang[key]" type="text">
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
                        <div v-if="isShowList">
                            <ul style="max-height: 550px; overflow-y: auto; text-align: center;">
                                <li v-for="modelInfo in showInfo.data['model_list']" :key="modelInfo['model_id']">
                                    <button style="width: 98%; height: 30px; margin: 1px; font-size: small">{{getLocalModelName(modelInfo)}}</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            `,
        },
    });

    select.show();
}

function checkPackMcmeta(path) {
    let mcmetaPath = `${path}/pack.mcmeta`;
    if (fs.existsSync(mcmetaPath)) {
        if (!fs.statSync(mcmetaPath).isFile()) {
            Blockbench.showMessageBox(
                {
                    title: "message.tlm_utils.prompt",
                    message:
                        "dialog.tlm_utils.load_pack.warn.pack_mcmeta_not_file",
                    icon: "warning",
                },
                function (result) {}
            );
            return false;
        }
    } else {
        Blockbench.showMessageBox(
            {
                title: "message.tlm_utils.prompt",
                message: "dialog.tlm_utils.load_pack.warn.pack_mcmeta_not_file",
                icon: "warning",
            },
            function (result) {}
        );
        return false;
    }
    return true;
}

function checkAssets(path) {
    let assetsPath = `${path}/assets`;
    if (fs.existsSync(assetsPath)) {
        if (!fs.statSync(assetsPath).isDirectory()) {
            Blockbench.showMessageBox(
                {
                    title: "message.tlm_utils.prompt",
                    message:
                        "dialog.tlm_utils.load_pack.warn.assets_not_folder",
                    icon: "warning",
                },
                function (result) {}
            );
            return false;
        }
    } else {
        Blockbench.showMessageBox(
            {
                title: "message.tlm_utils.prompt",
                message: "dialog.tlm_utils.load_pack.warn.assets_not_exist",
                icon: "warning",
            },
            function (result) {}
        );
        return false;
    }
    return true;
}
