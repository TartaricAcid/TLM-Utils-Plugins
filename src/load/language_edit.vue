<script>
import {join as pathJoin} from "path";
import {readLanguageFile, writeLanguageFile} from "../utils/language";

export default {
    props: {
        assetsPath: {
            type: String,
            required: true
        },
        languageMaps: {
            type: Object,
            required: true
        },
        packEditDialog: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            language: "en_us",
            clickKey: "",
            clickBlurIndex: 0,
            currentLanguageMaps: this.languageMaps,
            colorList: {
                "black": {
                    "code": "§0",
                    "rgb": "#000000"
                },
                "dark_blue": {
                    "code": "§1",
                    "rgb": "#0000AA"
                },
                "dark_green": {
                    "code": "§2",
                    "rgb": "#00AA00"
                },
                "dark_aqua": {
                    "code": "§3",
                    "rgb": "#00AAAA"
                },
                "dark_red": {
                    "code": "§4",
                    "rgb": "#AA0000"
                },
                "dark_purple": {
                    "code": "§5",
                    "rgb": "#AA00AA"
                },
                "gold": {
                    "code": "§6",
                    "rgb": "#FFAA00"
                },
                "gray": {
                    "code": "§7",
                    "rgb": "#AAAAAA"
                },
                "dark_gray": {
                    "code": "§8",
                    "rgb": "#555555"
                },
                "blue": {
                    "code": "§9",
                    "rgb": "#5555FF"
                },
                "green": {
                    "code": "§a",
                    "rgb": "#55FF55"
                },
                "aqua": {
                    "code": "§b",
                    "rgb": "#55FFFF"
                },
                "red": {
                    "code": "§c",
                    "rgb": "#FF5555"
                },
                "light_purple": {
                    "code": "§d",
                    "rgb": "#FF55FF"
                },
                "yellow": {
                    "code": "§e",
                    "rgb": "#FFFF55"
                },
                "white": {
                    "code": "§f",
                    "rgb": "#FFFFFF"
                }
            }
        };
    },
    methods: {
        tl: tl,
        saveLanguageButton: function () {
            let langPath = pathJoin(this.assetsPath, `${this.packEditDialog.sidebar.page}/lang/`);
            writeLanguageFile(this.language, langPath, this.currentLanguageMaps);
        },
        clickLanguageButton: function (language) {
            if (this.language !== language) {
                let oldLangPath = pathJoin(this.assetsPath, `${this.packEditDialog.sidebar.page}/lang/`);
                writeLanguageFile(this.language, oldLangPath, this.currentLanguageMaps);
            }
            this.language = language;
            if (language !== "en_us") {
                this.getCurrentLanguageMaps(language);
            } else {
                this.currentLanguageMaps = this.languageMaps;
            }
        },
        getCurrentLanguageMaps: function () {
            let currentLangPath = pathJoin(this.assetsPath, `${this.packEditDialog.sidebar.page}/lang/${this.language}.lang`);
            let languageMaps = {};
            readLanguageFile(currentLangPath, languageMaps);
            this.currentLanguageMaps = languageMaps;
        },
        addColorCode: function (code, key) {
            this.addStyleCode(code, key);
        },
        addStyleCode: function (code, key) {
            let rawText = this.currentLanguageMaps[key] || "";
            this.currentLanguageMaps[key] = rawText.slice(0, this.clickBlurIndex) + code + rawText.slice(this.clickBlurIndex)
            this.$forceUpdate();
        },
        getColorCodeName: function (name) {
            return tl(`color.tlm_utils.${name}.name`);
        },
        getClickBlurIndex: function (e) {
            this.clickBlurIndex = e.srcElement.selectionStart;
        }
    },
    computed: {}
}
</script>

<template>
    <div @click="clickKey=''">
        <div style="margin-bottom: 20px; text-align: center">
            <button style="width: 200px; margin-left: 5px" @click="clickLanguageButton('en_us')"
                    :disabled="language==='en_us'">{{ tl("dialog.tlm_utils.language_edit.language.en_us") }}
            </button>
            <button style="width: 200px; margin-left: 5px" @click="clickLanguageButton('zh_cn')"
                    :disabled="language==='zh_cn'">{{ tl("dialog.tlm_utils.language_edit.language.zh_cn") }}
            </button>
            <button style="width: 200px; margin-left: 5px" @click="clickLanguageButton('ru_ru')"
                    :disabled="language==='ru_ru'">{{ tl("dialog.tlm_utils.language_edit.language.ru_ru") }}
            </button>
            <button style="width: 200px; margin-left: 5px" @click="clickLanguageButton('ja_jp')"
                    :disabled="language==='ja_jp'">{{ tl("dialog.tlm_utils.language_edit.language.ja_jp") }}
            </button>
        </div>

        <div style="height: 800px; overflow-y: auto;">
            <div class="language-edit-element" v-for="(value,key) in this.languageMaps">
                <p class="language-edit-element-key">{{ key }}</p>
                <p class="language-edit-element-value">
                    <input type="text" style="width: 100%" v-model="languageMaps[key]" readonly>
                </p>
                <div class="language-edit-element-input" @click.stop="clickKey=key">
                    <div v-show="clickKey===key">
                        <i :style="{'color': color.rgb}" :title="getColorCodeName(name)"
                           @click="addColorCode(color.code, key)"
                           class="fas fa-square-full add-color" v-for="(color, name) in colorList"></i>
                        <i :title="tl('style.tlm_utils.bold.name')"
                           @click="addStyleCode('§l', key)"
                           class="fas fa-bold add-style"></i>
                        <i :title="tl('style.tlm_utils.strikethrough.name')"
                           @click="addStyleCode('§m', key)" class="fas fa-strikethrough add-style"></i>
                        <i :title="tl('style.tlm_utils.underline.name')"
                           @click="addStyleCode('§n', key)"
                           class="fas fa-underline add-style"></i>
                        <i :title="tl('style.tlm_utils.italic.name')"
                           @click="addStyleCode('§o', key)"
                           class="fas fa-italic add-style"></i>
                        <i :title="tl('style.tlm_utils.reset.name')"
                           @click="addStyleCode('§r', key)"
                           class="fas fa-eraser add-style"></i>
                    </div>
                    <input type="text" style="width: 100%" v-model="currentLanguageMaps[key]" @blur="getClickBlurIndex">
                </div>
            </div>
        </div>

        <div style="margin-top: 20px">
            <button style="width: 98%; height: 40px; font-size: 20px" @click="saveLanguageButton">
                {{ tl("dialog.save")}}
            </button>
        </div>
    </div>
</template>

<style>
.language-edit-element {
    background-color: #17191d;
    box-shadow: 0 0 10px #181a1f;
    width: 98%;
    margin-top: 10px;
    padding: 10px;
    border-radius: 5px;
}

.language-edit-element-key {
    color: #6a6a6d;
    font-size: small;
}

.language-edit-element-value {
    color: #aaaaad;
    font-size: x-large;
}

.language-edit-element-input {
    font-size: x-large;
    color: #f4f3ff;
    border-color: #2b2b2b;
    border-top-style: dotted;
    border-top-width: 2px;
    border-bottom-style: dotted;
    border-bottom-width: 2px;
}

.add-color {
    border-color: rgb(128, 128, 128);
    border-width: 1px;
    border-style: solid;
    margin: 2px;
}

.add-color:hover {
    border-color: red;
    border-width: 1px;
    border-style: solid;
}

.add-style:hover {
    color: red;
}
</style>