<script>
import {getTranslationKey, getTranslationResult, writeLanguageFile} from "../utils/language";
import {join as pathJoin} from "path";
import {isEmpty} from "../utils/string";
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
            selectedIconPath: "",
            isEditSoundPackInfo: false,
            isEditSound: false,
            soundPackInfo: {},
            soundFilePaths: [],
            soundType: [
                ["idle", "mode"],
                ["attack", "mode"],
                ["range_attack", "mode"],
                ["danmaku_attack", "mode"],
                ["farm", "mode"],
                ["feed", "mode"],
                ["shears", "mode"],
                ["milk", "mode"],
                ["torch", "mode"],
                ["feed_animal", "mode"],
                ["extinguishing", "mode"],
                ["snow", "mode"],
                ["break", "mode"],
                ["furnace", "mode"],
                ["brewing", "mode"],
                ["find_target", "ai"],
                ["hurt", "ai"],
                ["hurt_fire", "ai"],
                ["hurt_player", "ai"],
                ["tamed", "ai"],
                ["item_get", "ai"],
                ["death", "ai"],
                ["cold", "environment"],
                ["hot", "environment"],
                ["rain", "environment"],
                ["snow", "environment"],
                ["morning", "environment"],
                ["night", "environment"],
                ["credit", "other"]
            ],
            tmpTestAudio: new Audio(),
            randomIconSuffix: 0,    // used to clean img cache
        }
    },
    methods: {
        tl: tl,
        reset: function () {
            this.selectedIconPath = "";
            this.isEditSoundPackInfo = false;
            this.isEditSound = false;
            this.soundPackInfo = {};
            this.soundFilePaths = [];
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
                return getTranslationResult(showInfo.data["description"], showInfo.lang);
            }
        },
        clickEditInfo: function () {
            if (!this.isEditSoundPackInfo) {
                this.parent.reset();
                this.parent.selected = this.parent.selected + " ";
                this.parent.selected = this.parent.selected.trim();
                this.isEditSoundPackInfo = true;
                this.soundPackInfo = this.parent.showInfo;
            }
        },
        deleteSoundPack: function () {
            let index = electron.dialog.showMessageBoxSync(currentwindow, {
                title: tl("dialog.tlm_utils.load_pack.sound_pack.delete"),
                message: tl("dialog.tlm_utils.load_pack.sound_pack.delete.desc"),
                type: "warning",
                buttons: [tl("button.tlm_utils.confirm"), tl("button.tlm_utils.cancel")],
                defaultId: 1,
                cancelId: 1,
                noLink: true
            });
            if (index === 0) {
                let namespacePath = pathJoin(this.parent.assetsPath, this.parent.openCategory);
                let selected = this.parent.selected;
                let soundFile = pathJoin(namespacePath, "maid_sound.json");
                if (fs.existsSync(soundFile)) {
                    let text = fs.readFileSync(soundFile, "utf8");
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
                    let soundSourcePath = pathJoin(namespacePath, "sounds/maid");
                    pathDelete.push(soundSourcePath);

                    for (let deleteFile of pathDelete) {
                        electron.shell.trashItem(deleteFile).then(() => {
                        });
                    }
                    electron.shell.trashItem(soundFile).then(() => {
                        this.parent.selected = selected === "maid";
                        this.parent.$children.forEach(value => value.$forceUpdate());
                    });
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
            if (this.soundPackInfo && this.soundPackInfo.data && this.soundPackInfo.data["author"]) {
                this.soundPackInfo.data["author"].splice(index, 1);
                this.$forceUpdate();
            }
        },
        addAuthor: function () {
            if (this.soundPackInfo && this.soundPackInfo.data) {
                if (this.soundPackInfo.data["author"] && this.soundPackInfo.data["author"].length > 0) {
                    this.soundPackInfo.data["author"].push("");
                    this.$forceUpdate();
                } else {
                    this.soundPackInfo.data["author"] = [""];
                    this.$forceUpdate();
                }
            }
        },
        clickConfirm: function () {
            let namespacePath = `${this.parent.assetsPath}/${this.parent.openCategory}`;
            let soundInfoFile = `${namespacePath}/maid_sound.json`;
            if (this.selectedIconPath) {
                fs.writeFileSync(`${namespacePath}/textures/${this.parent.selected}_icon.png`, fs.readFileSync(this.selectedIconPath));
            }
            this.soundPackInfo.data["icon"] = `${this.parent.openCategory}:textures/${this.parent.selected}_icon.png`;
            this.soundPackInfo.data["version"] = `${this.soundPackInfo.version[0]}.${this.soundPackInfo.version[1]}.${this.soundPackInfo.version[2]}`;
            if (this.soundPackInfo.data["author"]) {
                for (let author of this.soundPackInfo.data["author"]) {
                    if (isEmpty(author)) {
                        this.soundPackInfo.data["author"].splice(this.soundPackInfo.data["author"].indexOf(author));
                    }
                }
                if (this.soundPackInfo.data["author"].length < 1) {
                    delete this.soundPackInfo.data["author"];
                }
            }
            if (this.soundPackInfo.data["description"]) {
                let key = getTranslationKey(this.soundPackInfo.data["description"]);
                if (isEmpty(this.soundPackInfo.lang[key])) {
                    delete this.soundPackInfo.lang[key];
                    delete this.soundPackInfo.data["description"];
                }
            }
            if (isEmpty(this.soundPackInfo.data["url"])) {
                delete this.soundPackInfo.data["url"];
            }
            fs.writeFileSync(soundInfoFile, autoStringify(this.soundPackInfo.data));
            writeLanguageFile("en_us", this.soundPackInfo.langPath, this.soundPackInfo.lang);
            this.isEditSoundPackInfo = false;
            this.selectedIconPath = "";
            this.randomIconSuffix = Math.random();
        },
        clickCancel: function () {
            this.reset();
            this.parent.selected = this.parent.selected + " ";
            this.parent.selected = this.parent.selected.trim();
        },
        selectedSound: function (index) {
            let searchPath = `${this.parent.showInfo.soundsPath}/${this.soundType[index][1]}`
            if (!fs.existsSync(searchPath)) {
                mkdirs(searchPath)
            }
            let paths = fs.readdirSync(searchPath);
            let fileNameCheck = this.soundType[index][0];
            this.soundFilePaths = []
            for (let name of paths) {
                if (name.startsWith(fileNameCheck)) {
                    let path = `${this.soundType[index][1]}/${name}`
                    this.soundFilePaths.push(path)
                }
            }
            this.isEditSoundPackInfo = false;
            this.isEditSound = true;
        },
        playSound: function (index) {
            let path = `${this.parent.showInfo.soundsPath}/${this.soundFilePaths[index]}`;
            if (fs.existsSync(path)) {
                this.tmpTestAudio.src = path;
                this.tmpTestAudio.play();
            }
        }
    },
    computed: {
        isEditSoundPackInfoButtonActive: function () {
            return this.isEditSoundPackInfo;
        },
        packNameKey: function () {
            if (this.soundPackInfo && this.soundPackInfo.data && this.soundPackInfo.data["pack_name"]) {
                return getTranslationKey(this.soundPackInfo.data["pack_name"]);
            }
        },
        packDescKeys: function () {
            if (this.soundPackInfo && this.soundPackInfo.data) {
                if (this.soundPackInfo.data["description"]) {
                    return getTranslationKey(this.soundPackInfo.data["description"]);
                } else {
                    let key = `${this.parent.selected}_pack.${this.parent.openCategory}.desc`;
                    this.soundPackInfo.lang[key] = "";
                    this.soundPackInfo.data["description"] = `{${key}}`;
                    return key;
                }
            }
        },
    }
}
</script>

<template>
    <div>
        <div class="sound-pack-info">
            <!-- Info -->
            <div style="display: flex;">
                <!-- Icon -->
                <div class="sound-pack-info-icon">
                    <div class="sound-pack-info-icon-img" v-if="getIconPath(parent.showInfo)">
                        <img :src="getIconPath(parent.showInfo)" alt="" height="100%" width="100%">
                    </div>
                    <div class="sound-pack-info-icon-no-img" v-else>
                        <i class="far fa-4x fa-images"></i>
                    </div>
                </div>

                <!-- Text Info -->
                <div class="sound-pack-text">
                    <p style="font-size: larger">
                        {{ getPackName() }}
                        <span class="sound-pack-info-version">
                            <i class="fas fa-tag fa-fw" style="font-size: smaller;"></i>
                            {{ getStringVersion() }}
                        </span>
                    </p>
                    <p class="sound-pack-info-other" v-if="parent.showInfo.data['description']">
                        <i class="fas fa-comment-alt fa-fw"></i>
                        {{ getDescription() }}
                    </p>
                    <p class="sound-pack-info-other" v-if="parent.showInfo.data['url']">
                        <i class="fas fa-link fa-fw"></i>
                        {{ parent.showInfo.data['url'] }}
                    </p>
                    <p class="sound-pack-info-other">
                        <i class="fas fa-user fa-fw"></i>
                        <span :key="index" v-for="(author,index) in parent.showInfo.data['author']">
                            {{ author }}
                        </span>
                    </p>
                    <p class="sound-pack-info-other">
                        <i class="far fa-calendar-alt fa-fw"></i>
                        {{ parent.showInfo.data["date"] }}
                    </p>
                </div>
            </div>

            <!-- Edit Info Button -->
            <div style="margin-top: 10px; display: flex">
                <button :class="{'inactive-edit-list-button':isEditSoundPackInfoButtonActive}" @click="clickEditInfo"
                        style="width: 100%">
                    <i class="fas fa-edit"></i>
                    {{ tl("dialog.tlm_utils.load_pack.detail.edit_sound_pack") }}
                </button>
                <button :title="tl('dialog.tlm_utils.load_pack.sound_pack.delete')" @click="deleteSoundPack"
                        class="sound-pack-edit-delete">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>

        <!-- Sound Pack Info Edit -->
        <div class="sound-pack-edit" v-if="isEditSoundPackInfo && !isEditSound">
            <div class="sound-pack-edit-main">
                <!-- Model List Name -->
                <div>
                    <p class="sound-pack-edit-item-title">{{ tl("dialog.tlm_utils.load_pack.edit.pack_name") }}</p>
                    <p class="sound-pack-edit-item-desc">{{ tl("dialog.tlm_utils.load_pack.edit.pack_name.desc") }}</p>
                    <input class="sound-pack-edit-name-input" type="text"
                           v-model.trim="soundPackInfo.lang[packNameKey]">
                </div>

                <!-- Model Icon -->
                <div class="flex-edit-item">
                    <button @click="openIconPath" class="sound-pack-edit-icon">
                        <img :src="getIconPath(soundPackInfo)" alt="" height="115x" style="padding: 5px"
                             v-if="getIconPath(soundPackInfo)" width="115x">
                        <div v-else><i class="far fa-4x fa-images"></i></div>
                    </button>

                    <div style="margin-left: 20px">
                        <h5 style="margin: 0; padding: 0">{{ tl("dialog.tlm_utils.load_pack.edit.icon") }}</h5>
                        <p style="color: #6a6a6d">{{ tl("dialog.tlm_utils.load_pack.edit.icon.desc") }}</p>
                    </div>
                </div>

                <!-- Model Version -->
                <div class="flex-edit-item">
                    <div class="version-input">
                        <input min="0" placeholder="1" step="1" type="number" v-model="soundPackInfo.version[0]"
                               value="1">
                        <p>.</p>
                        <input min="0" placeholder="0" step="1" type="number" v-model="soundPackInfo.version[1]"
                               value="0">
                        <p>.</p>
                        <input min="0" placeholder="0" step="1" type="number" v-model="soundPackInfo.version[2]"
                               value="0">
                    </div>

                    <div style="margin-left: 20px">
                        <p class="sound-pack-edit-item-title">{{ tl("dialog.tlm_utils.load_pack.edit.version") }}</p>
                        <p class="sound-pack-edit-item-desc">
                            {{ tl("dialog.tlm_utils.load_pack.edit.version.desc") }}</p>
                    </div>
                </div>

                <!-- Model Date -->
                <div class="flex-edit-item">
                    <input class="sound-pack-edit-date-input" type="date" v-model="soundPackInfo.data['date']">
                    <div style="margin-left: 20px">
                        <p class="sound-pack-edit-item-title">{{ tl("dialog.tlm_utils.load_pack.edit.date") }}</p>
                        <p class="sound-pack-edit-item-desc">{{ tl("dialog.tlm_utils.load_pack.edit.date.desc") }}</p>
                    </div>
                </div>

                <!-- Model Author -->
                <div class="flex-edit-item">
                    <div>
                        <div :key="index" style="display: flex" v-for="(author, index) in soundPackInfo.data['author']">
                            <input class="sound-pack-edit-author-input" type="text"
                                   v-model.trim="soundPackInfo.data['author'][index]">
                            <button @click="deleteAuthor(index)" class="sound-pack-edit-author-delete">
                                <i class="fas fa-trash-alt fa-align-center"></i>
                            </button>
                        </div>
                        <button @click="addAuthor" style="width: 127px; margin-top: 5px">
                            <i class="fas fa-user-plus fa-fw"></i>
                        </button>
                    </div>

                    <div style="margin-left: 20px">
                        <p class="sound-pack-edit-item-title">{{ tl("dialog.tlm_utils.load_pack.edit.author") }}</p>
                        <p class="sound-pack-edit-item-desc">{{ tl("dialog.tlm_utils.load_pack.edit.author.desc") }}</p>
                    </div>
                </div>

                <!-- Model Description -->
                <div style="margin-top: 20px">
                    <p class="sound-pack-edit-item-title">{{ tl("dialog.tlm_utils.load_pack.edit.description") }}</p>
                    <p class="sound-pack-edit-item-desc">
                        {{ tl("dialog.tlm_utils.load_pack.edit.description.desc") }}</p>
                    <input class="sound-pack-edit-desc-input" type="text" v-model="soundPackInfo.lang[packDescKeys]">
                </div>

                <!-- URL -->
                <div style="margin-top: 20px">
                    <p class="sound-pack-edit-item-title">{{ tl("dialog.tlm_utils.load_pack.edit.url") }}</p>
                    <p class="sound-pack-edit-item-desc">
                        {{ tl("dialog.tlm_utils.load_pack.edit.url.desc") }}</p>
                    <input class="sound-pack-edit-desc-input" type="text" v-model="soundPackInfo.data['url']">
                </div>
            </div>

            <!-- Info Edit Confirm Button -->
            <div style="display: flex; margin-top: 10px;">
                <button @click="clickConfirm" style="width: 48%">{{ tl("button.tlm_utils.confirm") }}</button>
                <button @click="clickCancel" style="width: 48%; margin-left: 2%">{{ tl("button.tlm_utils.cancel") }}
                </button>
            </div>
        </div>

        <!-- Sound Edit -->
        <div class="sound-pack-edit" v-if="!isEditSoundPackInfo && isEditSound">
            <div class="sound-pack-edit-main">
                <div style="margin-top: 10px; margin-bottom: 10px">
                    <p class="sound-pack-edit-item-title">
                        {{ tl("dialog.tlm_utils.load_pack.edit.sounds") }}</p>
                    <p class="sound-pack-edit-item-desc" style="margin-bottom: 5px">
                        {{ tl("dialog.tlm_utils.load_pack.edit.sounds.desc") }}</p>
                    <div :key="index" style="display: flex" v-for="(soundPath, index) in soundFilePaths">
                        <div :title="tl('dialog.tlm_utils.load_pack.edit.sounds.play')"
                             class="sound-edit-item-button" @click="playSound(index)">
                            <i class="fas fa-play"></i>
                        </div>
                        <input class="sound-edit-input" readonly type="text" v-model="soundFilePaths[index]">
                        <div :title="tl('dialog.tlm_utils.load_pack.edit.sounds.delete')"
                             class="sound-edit-item-button">
                            <i class="fas fa-trash-alt"></i>
                        </div>
                    </div>
                    <button style="height: 25px; width: 98%; font-size: small; margin-top: 5px">
                        {{ tl("dialog.tlm_utils.load_pack.edit.sounds.add") }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.sound-pack-info {
    background-color: #21252b;
    padding: 10px;
    margin-top: 10px
}

.sound-pack-text {
    padding-left: 10px;
    width: 77%
}

.sound-pack-info-icon {
    width: 100px;
    height: 100px;
    border-style: solid;
    border-width: 1px;
    border-color: #17191d
}

.sound-pack-info-icon-img {
    width: 100%;
    height: 100%;
    padding: 5px
}

.sound-pack-info-icon-no-img {
    width: 100%;
    height: 100%;
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center
}

.sound-pack-info-version {
    font-size: small;
    color: #848891;
    margin-left: 5px;
    background-color: #17191d;
    border-radius: 2px;
    padding: 0 5px
}

.sound-pack-info-other {
    color: #848891;
    font-size: small;
    margin: 0;
}

.sound-pack-edit {
    height: 100%;
    width: 100%;
    margin-top: 10px
}

.sound-pack-edit-main {
    background-color: #21252b;
    width: 100%;
    height: 400px;
    overflow-y: auto;
    padding: 10px 20px
}

.sound-pack-edit-item-title {
    margin: 0;
    padding: 0;
    font-size: large
}

.sound-pack-edit-item-desc {
    margin: 0;
    padding: 0;
    color: #6a6a6d
}

.sound-pack-edit-icon {
    min-width: 50px;
    width: 125px;
    height: 125px;
    border-radius: 1px;
    margin: 0;
    padding: 0
}

.sound-pack-edit-name-input, .sound-pack-edit-desc-input {
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

.sound-edit-item-button {
    margin: 3px 1px 1px;
    width: 21px;
    height: 21px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #3a3f4b;
    font-size: small;
    border-width: 1px;
}

.sound-edit-item-button:hover {
    background-color: #3e90ff;
    color: #1c2026;
}

.sound-edit-input {
    border-radius: 1px;
    margin-top: 3px;
    margin-right: 3px;
    margin-left: 3px;
    padding: 2px;
    width: 100%;
    height: 20px;
    font-size: 15px;
    background-color: #1c2026;
    border-style: solid;
    border-width: 1px;
    border-color: #181a1f;
}

.sound-pack-edit-date-input {
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

.sound-pack-edit-author-input {
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

.sound-pack-edit-author-delete {
    width: 30px;
    min-width: 30px;
    height: 30px;
    min-height: 30px;
    margin: 5px 0 0 5px;
    display: flex;
    justify-content: center;
    align-items: center
}

.sound-pack-edit-delete {
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