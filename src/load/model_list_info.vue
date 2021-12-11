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
        <div class="model-list-edit" v-if="isEditModelListInfo && !isEditModelInfo">
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

        <!-- Model Info Edit -->
        <div class="model-edit" v-if="!isEditModelListInfo && isEditModelInfo">
            <div class="model-edit-main">
                <details open>
                    <summary class="summary-bar">
                        <i class="fas fa-chevron-down fa-fw"></i>
                        {{tl("dialog.tlm_utils.load_pack.edit.model.main")}}
                    </summary>
                    <div class="model-edit-main-sub" style="margin-top: 5px">
                        <!-- Model Name -->
                        <div>
                            <p class="model-list-edit-item-title">{{tl("dialog.tlm_utils.load_pack.edit.model.name")}}</p>
                            <p class="model-list-edit-item-desc">{{tl("dialog.tlm_utils.load_pack.edit.pack_name.desc")}}</p>
                            <input class="model-edit-name-input" type="text" v-model="modelListInfo.lang[modelNameKey]">
                        </div>

                        <!-- Model Description -->
                        <div style="margin-top: 20px">
                            <p class="model-list-edit-item-title">{{tl("dialog.tlm_utils.load_pack.edit.model.description")}}</p>
                            <p class="model-list-edit-item-desc">{{tl("dialog.tlm_utils.load_pack.edit.description.desc")}}</p>
                            <div v-if="modelInfo['description']">
                                <div :key="index" v-for="(key, index) in modelDescKeys">
                                    <input class="model-edit-desc-input" type="text" v-model="modelListInfo.lang[key]">
                                </div>
                            </div>
                            <div v-else>
                                <button @click="addModelDesc" style="width: 95%; height: 30px; margin-top: 5px">
                                    {{tl("dialog.tlm_utils.load_pack.edit.model.add_description")}}
                                </button>
                            </div>
                        </div>

                        <!-- Model Path -->
                        <div style="margin-top: 20px">
                            <p class="model-list-edit-item-title">{{tl("dialog.tlm_utils.load_pack.edit.model_path.name")}}</p>
                            <p class="model-list-edit-item-desc">{{tl("dialog.tlm_utils.load_pack.edit.model_path.desc")}}</p>
                            <input class="model-edit-name-input" disabled style="font-size: small" type="text" v-model="modelPathRes">
                        </div>

                        <!-- Model Texture -->
                        <div style="margin-top: 20px; margin-bottom: 10px">
                            <p class="model-list-edit-item-title">{{tl("dialog.tlm_utils.load_pack.edit.texture_path.name")}}</p>
                            <p class="model-list-edit-item-desc">{{tl("dialog.tlm_utils.load_pack.edit.texture_path.desc")}}</p>
                            <input class="model-edit-name-input" disabled style="font-size: small" type="text" v-model="texturePathRes">
                        </div>
                    </div>
                </details>

                <details style="margin-top: 5px">
                    <summary class="summary-bar">
                        <i class="fas fa-chevron-down fa-fw"></i>
                        {{tl("dialog.tlm_utils.load_pack.edit.model.animation")}}
                    </summary>
                    <div class="model-edit-main-sub" style="margin-top: 5px">
                        <div style="margin-bottom: 5px">
                            <p class="model-list-edit-item-title">{{tl("dialog.tlm_utils.load_pack.edit.model.preset_animation")}}</p>
                            <p class="model-list-edit-item-desc" style="margin-bottom: 10px">{{tl("dialog.tlm_utils.load_pack.edit.model.preset_animation.desc")}}</p>
                            <div :key="index" style="display: flex" v-for="(animation, index) in modelInfo['animation']" v-if="presetAnimations.has(animation)">
                                <input class="model-edit-animation-input" readonly type="text" v-model="modelInfo['animation'][index]">
                                <div :title="tl('dialog.tlm_utils.load_pack.edit.model.animation.delete')" @click="deleteAnimation(index)"
                                     class="model-edit-animation-item-button">
                                    <i class="fas fa-trash-alt"></i></div>
                                <div :title="getPresentAnimationInfo(animation)" class="model-edit-animation-item-button">
                                    <i class="fas fa-info-circle"></i>
                                </div>
                            </div>
                            <button @click="analyzePresentAnimation" style="height: 25px; width: 92.75%; font-size: small; margin-top: 5px">
                                {{tl("dialog.tlm_utils.load_pack.edit.model.preset_animation.analyze")}}
                            </button>
                        </div>

                        <div style="margin-top: 20px; margin-bottom: 10px">
                            <p class="model-list-edit-item-title">{{tl("dialog.tlm_utils.load_pack.edit.model.custom_animation")}}</p>
                            <p class="model-list-edit-item-desc" style="margin-bottom: 5px">{{tl("dialog.tlm_utils.load_pack.edit.model.custom_animation.desc")}}</p>
                            <div :key="index" style="display: flex" v-for="(animation, index) in modelInfo['animation']" v-if="!presetAnimations.has(animation)">
                                <input class="model-edit-animation-input" readonly type="text" v-model="modelInfo['animation'][index]">
                                <div :title="tl('dialog.tlm_utils.load_pack.edit.model.animation.delete')" @click="deleteAnimation(index)"
                                     class="model-edit-animation-item-button">
                                    <i class="fas fa-trash-alt"></i>
                                </div>
                                <div :title="tl('dialog.tlm_utils.load_pack.edit.model.animation.replace')" @click="changeAnimation(index)"
                                     class="model-edit-animation-item-button">
                                    <i class="fas fa-file-import"></i>
                                </div>
                            </div>
                            <button @click="addAnimation" style="height: 25px; width: 92.75%; font-size: small; margin-top: 5px">
                                {{tl("dialog.tlm_utils.load_pack.edit.model.custom_animation.add")}}
                            </button>
                        </div>
                    </div>
                </details>

                <details style="margin-top: 5px">
                    <summary class="summary-bar">
                        <i class="fas fa-chevron-down fa-fw"></i>
                        {{tl("dialog.tlm_utils.load_pack.edit.model.scale")}}
                    </summary>
                    <div class="model-edit-main-sub" style="margin-top: 5px">
                        <div style="display: flex; align-items: center">
                            <div>
                                <p class="model-edit-range-tip">{{modelInfo["render_item_scale"]}}</p>
                                <input class="model-edit-range" max="2" min="0.05" step="0.05" type="range" v-model="modelInfo['render_item_scale']">
                            </div>
                            <div style="margin-left: 20px">
                                <p class="model-list-edit-item-title">{{tl("dialog.tlm_utils.load_pack.edit.model.render_item_scale")}}</p>
                                <p class="model-list-edit-item-desc">{{tl("dialog.tlm_utils.load_pack.edit.model.render_item_scale.desc")}}</p>
                            </div>
                        </div>

                        <div class="flex-edit-item" style="margin-bottom: 10px">
                            <div>
                                <p class="model-edit-range-tip">{{modelInfo["render_entity_scale"]}}</p>
                                <input class="model-edit-range" max="1.3" min="0.7" step="0.025" type="range" v-model="modelInfo['render_entity_scale']">
                            </div>
                            <div style="margin-left: 20px">
                                <p class="model-list-edit-item-title">{{tl("dialog.tlm_utils.load_pack.edit.model.render_entity_scale")}}</p>
                                <p class="model-list-edit-item-desc">{{tl("dialog.tlm_utils.load_pack.edit.model.render_entity_scale.desc")}}</p>
                            </div>
                        </div>
                    </div>
                </details>

                <details style="margin-top: 5px" v-if="this.parent.selected==='chair'">
                    <summary class="summary-bar">
                        <i class="fas fa-chevron-down fa-fw"></i>
                        {{tl("dialog.tlm_utils.load_pack.edit.model.chair_extra")}}
                    </summary>
                    <div class="model-edit-main-sub" style="margin-top: 5px">
                        <div style="margin-bottom: 20px">
                            <p class="model-list-edit-item-title">{{tl("dialog.tlm_utils.load_pack.edit.model.mounted_height")}}</p>
                            <p class="model-list-edit-item-desc">{{tl("dialog.tlm_utils.load_pack.edit.model.mounted_height.desc")}}</p>
                            <div style="display: flex">
                                <p class="model-edit-mounted-height-tip">{{modelInfo["mounted_height"]}}</p>
                                <input class="model-edit-mounted-height" max="40" min="0" step="1" type="range" v-model="modelInfo['mounted_height']">
                            </div>
                        </div>

                        <div style="display: flex; align-items: center">
                            <input class="model-edit-checkbox" type="checkbox" v-model="modelInfo['tameable_can_ride']">
                            <div style="margin-left: 10px">
                                <p class="model-list-edit-item-title">{{tl("dialog.tlm_utils.load_pack.edit.model.tameable_can_ride")}}</p>
                                <p class="model-list-edit-item-desc">{{tl("dialog.tlm_utils.load_pack.edit.model.tameable_can_ride.desc")}}</p>
                            </div>
                        </div>

                        <div class="flex-edit-item" style="margin-bottom: 5px">
                            <input class="model-edit-checkbox" type="checkbox" v-model="modelInfo['no_gravity']">
                            <div style="margin-left: 10px">
                                <p class="model-list-edit-item-title">{{tl("dialog.tlm_utils.load_pack.edit.model.no_gravity")}}</p>
                                <p class="model-list-edit-item-desc">{{tl("dialog.tlm_utils.load_pack.edit.model.no_gravity.desc")}}</p>
                            </div>
                        </div>
                    </div>
                </details>

                <details style="margin-top: 5px" v-if="this.parent.selected==='maid'">
                    <summary class="summary-bar">
                        <i class="fas fa-chevron-down fa-fw"></i>
                        {{tl("dialog.tlm_utils.load_pack.edit.model.compatibility")}}
                    </summary>
                    <div class="model-edit-main-sub" style="margin-top: 5px">
                        <div style="display: flex; align-items: center">
                            <input class="model-edit-checkbox" type="checkbox" v-model="modelInfo['show_backpack']">
                            <div style="margin-left: 10px">
                                <p class="model-list-edit-item-title">{{tl("dialog.tlm_utils.load_pack.edit.model.show_backpack")}}</p>
                                <p class="model-list-edit-item-desc">{{tl("dialog.tlm_utils.load_pack.edit.model.show_backpack.desc")}}</p>
                            </div>
                        </div>

                        <div class="flex-edit-item">
                            <input class="model-edit-checkbox" type="checkbox" v-model="modelInfo['show_custom_head']">
                            <div style="margin-left: 10px">
                                <p class="model-list-edit-item-title">{{tl("dialog.tlm_utils.load_pack.edit.model.show_custom_head")}}</p>
                                <p class="model-list-edit-item-desc">{{tl("dialog.tlm_utils.load_pack.edit.model.show_custom_head.desc")}}</p>
                            </div>
                        </div>

                        <div class="flex-edit-item">
                            <input class="model-edit-checkbox" type="checkbox" v-model="modelInfo['can_hold_trolley']">
                            <div style="margin-left: 10px">
                                <p class="model-list-edit-item-title">
                                    {{tl("dialog.tlm_utils.load_pack.edit.model.can_hold_trolley")}}
                                    <span style="font-size: x-small; color: #6a6a6d; font-style: italic">
                                        <i class="fas fa-info-circle fa-fw"></i>
                                        {{tl("dialog.tlm_utils.load_pack.edit.model.deprecated")}}
                                    </span>
                                </p>
                                <p class="model-list-edit-item-desc">{{tl("dialog.tlm_utils.load_pack.edit.model.can_hold_trolley.desc")}}</p>
                            </div>
                        </div>

                        <div class="flex-edit-item">
                            <input class="model-edit-checkbox" type="checkbox" v-model="modelInfo['show_hata']">
                            <div style="margin-left: 10px">
                                <p class="model-list-edit-item-title">
                                    {{tl("dialog.tlm_utils.load_pack.edit.model.show_hata")}}
                                    <span style="font-size: x-small; color: #6a6a6d; font-style: italic">
                                        <i class="fas fa-info-circle fa-fw"></i>
                                        {{tl("dialog.tlm_utils.load_pack.edit.model.deprecated")}}
                                    </span>
                                </p>
                                <p class="model-list-edit-item-desc">{{tl("dialog.tlm_utils.load_pack.edit.model.show_hata.desc")}}</p>
                            </div>
                        </div>

                        <div class="flex-edit-item">
                            <input class="model-edit-checkbox" type="checkbox" v-model="modelInfo['can_hold_trolley']">
                            <div style="margin-left: 10px">
                                <p class="model-list-edit-item-title">
                                    {{tl("dialog.tlm_utils.load_pack.edit.model.can_hold_trolley")}}
                                    <span style="font-size: x-small; color: #6a6a6d; font-style: italic">
                                        <i class="fas fa-info-circle fa-fw"></i>
                                        {{tl("dialog.tlm_utils.load_pack.edit.model.deprecated")}}
                                    </span>
                                </p>
                                <p class="model-list-edit-item-desc">{{tl("dialog.tlm_utils.load_pack.edit.model.can_hold_trolley.desc")}}</p>
                            </div>
                        </div>

                        <div class="flex-edit-item" style="margin-bottom: 5px">
                            <input class="model-edit-checkbox" type="checkbox" v-model="modelInfo['can_riding_broom']">
                            <div style="margin-left: 10px">
                                <p class="model-list-edit-item-title">
                                    {{tl("dialog.tlm_utils.load_pack.edit.model.can_riding_broom")}}
                                    <span style="font-size: x-small; color: #6a6a6d; font-style: italic">
                                        <i class="fas fa-info-circle fa-fw"></i>
                                        {{tl("dialog.tlm_utils.load_pack.edit.model.deprecated")}}
                                    </span>
                                </p>
                                <p class="model-list-edit-item-desc">{{tl("dialog.tlm_utils.load_pack.edit.model.can_riding_broom.desc")}}</p>
                            </div>
                        </div>
                    </div>
                </details>

                <details style="margin-top: 5px" v-if="this.parent.selected==='maid'">
                    <summary class="summary-bar">
                        <i class="fas fa-chevron-down fa-fw"></i>
                        {{tl("dialog.tlm_utils.load_pack.edit.model.easter_eggs")}}
                    </summary>
                    <div class="model-edit-main-sub" style="margin-top: 5px">
                        <div v-if="modelInfo['easter_egg']['encrypt']">
                            <p class="model-list-edit-item-title">
                                {{tl("dialog.tlm_utils.load_pack.edit.model.easter_egg.tag")}}
                                <span style="font-size: x-small; color: #6a6a6d; font-style: italic; margin-left: 10px">
                                    <i class="fas fa-key"></i>
                                    SHA-1:
                                    {{sha1Egg}}
                                </span>
                            </p>
                            <p class="model-list-edit-item-desc">{{tl("dialog.tlm_utils.load_pack.edit.model.easter_egg.tag.desc")}}</p>
                            <input @blur="setEncryptEgg(true)" class="model-edit-egg-input" type="text" v-model="tmpEncryptName">
                        </div>
                        <div v-else>
                            <p class="model-list-edit-item-title">{{tl("dialog.tlm_utils.load_pack.edit.model.easter_egg.tag")}}</p>
                            <p class="model-list-edit-item-desc">{{tl("dialog.tlm_utils.load_pack.edit.model.easter_egg.tag.desc")}}</p>
                            <input @blur="setEncryptEgg(false)" class="model-edit-egg-input" type="text" v-model="tmpEncryptName">
                        </div>
                        <div style="display: flex; align-items: center; margin-top: 10px; margin-bottom: 5px">
                            <input @click="clickEncryptInput" class="model-edit-checkbox" type="checkbox" v-model="modelInfo['easter_egg']['encrypt']">
                            <div style="margin-left: 10px">
                                <p class="model-list-edit-item-title">{{tl("dialog.tlm_utils.load_pack.edit.model.easter_egg.encrypt")}}</p>
                                <p class="model-list-edit-item-desc">{{tl("dialog.tlm_utils.load_pack.edit.model.easter_egg.encrypt.desc")}}</p>
                            </div>
                        </div>
                    </div>
                </details>
            </div>

            <!-- Model Edit Confirm Button -->
            <div style="display: flex; margin-top: 10px; font-size: small">
                <button @click="clickModelSave" style="width: 32%">{{tl("button.tlm_utils.save")}}</button>
                <button @click="clickOpenModel" style="width: 32%; margin-left: 1%">{{tl("button.tlm_utils.save_open")}}</button>
                <button @click="clickModelCancel" style="width: 32%; margin-left: 1%">{{tl("button.tlm_utils.cancel")}}</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {getTranslationKey, getTranslationResult, writeLanguageFile} from "../utils/language";
    import {isEmpty} from "../utils/string";
    import {join as pathJoin} from "path";
    import {mkdirs} from "../utils/filesystem";
    import sha1 from "sha1";
    import {CHAIR_ANIMATION_BONES, CHAIR_ANIMATION_REFERENCES, MAID_ANIMATION_BONES, MAID_ANIMATION_REFERENCES, REFERENCES_ORDER} from "../animation/manger";

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
                modelInfo: {},
                selectedIconPath: "",
                randomIconSuffix: 0,    // used to clean img cache
                isEditModelListInfo: false,
                tmpEncryptName: ""
            };
        },
        methods: {
            tl: tl,
            reset: function () {
                this.modelListInfo = {};
                this.modelInfo = {};
                this.selectedIconPath = "";
                this.isEditModelListInfo = false;
                this.tmpEncryptName = "";
            },
            clickModelSave: function () {
                let namespacePath = `${this.parent.assetsPath}/${this.parent.openCategory}`;
                let modelListFile = (this.parent.selected === "maid") ? `${namespacePath}/maid_model.json` : `${namespacePath}/maid_chair.json`;
                // Remove some data
                if (typeof this.modelInfo["render_item_scale"] === "string") {
                    this.modelInfo["render_item_scale"] = Number.parseFloat(this.modelInfo["render_item_scale"]);
                }
                if (typeof this.modelInfo["render_entity_scale"] === "string") {
                    this.modelInfo["render_entity_scale"] = Number.parseFloat(this.modelInfo["render_entity_scale"]);
                }
                if (typeof this.modelInfo["mounted_height"] === "string") {
                    this.modelInfo["mounted_height"] = Number.parseFloat(this.modelInfo["mounted_height"]);
                }
                if (this.modelInfo["render_item_scale"] === 1) {
                    delete this.modelInfo["render_item_scale"];
                }
                if (this.modelInfo["render_entity_scale"] === 1) {
                    delete this.modelInfo["render_entity_scale"];
                }
                if (this.modelInfo["mounted_height"] === 3) {
                    delete this.modelInfo["mounted_height"];
                }
                if (this.modelInfo["show_backpack"]) {
                    delete this.modelInfo["show_backpack"];
                }
                if (this.modelInfo["show_custom_head"]) {
                    delete this.modelInfo["show_custom_head"];
                }
                if (this.modelInfo["can_hold_trolley"]) {
                    delete this.modelInfo["can_hold_trolley"];
                }
                if (this.modelInfo["show_hata"]) {
                    delete this.modelInfo["show_hata"];
                }
                if (this.modelInfo["can_hold_vehicle"]) {
                    delete this.modelInfo["can_hold_vehicle"];
                }
                if (this.modelInfo["can_riding_broom"]) {
                    delete this.modelInfo["can_riding_broom"];
                }
                if (this.modelInfo["tameable_can_ride"]) {
                    delete this.modelInfo["tameable_can_ride"];
                }
                if (!this.modelInfo["no_gravity"]) {
                    delete this.modelInfo["no_gravity"];
                }
                if (this.modelInfo["easter_egg"] && isEmpty(this.modelInfo["easter_egg"]["tag"])) {
                    delete this.modelInfo["easter_egg"];
                }
                fs.writeFileSync(modelListFile, autoStringify(this.modelListInfo.data), "utf8");
                writeLanguageFile("en_us", this.modelListInfo.langPath, this.modelListInfo.lang);
                this.clickModelCancel();
            },
            clickModelCancel: function () {
                this.parent.selectedId = -1;
                this.parent.selected = this.parent.selected + " ";
                this.parent.selected = this.parent.selected.trim();
            },
            clickOpenModel: function () {
                this.clickModelSave();
                let model = this.getModelPath();
                if (model) {
                    Blockbench.read(model, {readtype: "text"}, (files) => {
                        loadModelFile(files[0]);
                        let texture = this.getTexturePath();
                        if (Project && Project.selected && texture) {
                            Blockbench.read(texture, {readtype: "image"}, (files) => {
                                new Texture().fromFile(files[0]).add();
                                Project["tlm_list_info"] = this.modelListInfo;
                                Project["tlm_model_info"] = this.modelInfo;
                            });
                        }
                    });
                }
            },
            getModelPath: function () {
                if (this.modelInfo && this.modelListInfo) {
                    let modelId = this.modelInfo["model_id"];
                    let model = this.modelInfo["model"];
                    if (model) {
                        let res = model.split(":", 2);
                        if (res.length > 1) {
                            return pathJoin(this.modelListInfo.namespacePath, res[1]);
                        }
                    } else {
                        let res = modelId.split(":", 2);
                        if (res.length > 1) {
                            return pathJoin(this.modelListInfo.modelsPath, res[1] + ".json");
                        }
                    }
                }
            },
            getTexturePath: function () {
                if (this.modelInfo && this.modelListInfo) {
                    let modelId = this.modelInfo["model_id"];
                    let texture = this.modelInfo["texture"];
                    if (texture) {
                        let res = texture.split(":", 2);
                        if (res.length > 1) {
                            return pathJoin(this.modelListInfo.namespacePath, res[1]);
                        }
                    } else {
                        let res = modelId.split(":", 2);
                        if (res.length > 1) {
                            return pathJoin(this.modelListInfo.texturesPath, res[1] + ".png");
                        }
                    }
                }
            },
            getPresentAnimationInfo: function (animation) {
                let info = this.presetAnimations.get(animation);
                if (info && info.name && info.desc) {
                    return `${info.name}\n${info.desc}`;
                }
            },
            analyzePresentAnimation: function () {
                let path = this.getModelPath();
                if (!path || !fs.existsSync(path)) {
                    electron.dialog.showErrorBox("Error", "No File");
                    return;
                }
                let data = autoParseJSON(fs.readFileSync(path, "utf-8"), false);
                let version = data["format_version"];
                let refs = new Set();
                if (version === "1.10.0") {
                    let geo = data["geometry.model"];
                    if (!geo) {
                        electron.dialog.showErrorBox("Error", "No Geo");
                    }
                    let bones = geo["bones"];
                    if (bones && Array.isArray(bones)) {
                        bones.forEach(bone => {
                            let name = bone["name"];
                            if (!isEmpty(name) && this.presetBones.has(name)) {
                                this.presetBones.get(name)["ref"].forEach(v => refs.add(v));
                            }
                        });
                    }
                } else if (version === "1.12.0") {
                    let geoArr = data["minecraft:geometry"];
                    if (!geoArr || !Array.isArray(geoArr) || geoArr.length < 1) {
                        electron.dialog.showErrorBox("Error", "No Geo");
                    }
                    let bones = geoArr[0]["bones"];
                    if (bones && Array.isArray(bones)) {
                        bones.forEach(bone => {
                            let name = bone["name"];
                            if (!isEmpty(name) && this.presetBones.has(name)) {
                                this.presetBones.get(name)["ref"].forEach(v => refs.add(v));
                            }
                        });
                    }
                } else {
                    electron.dialog.showErrorBox("Error", "Version Error");
                    return;
                }
                if (this.modelInfo) {
                    let animation = this.modelInfo["animation"];
                    if (!animation) {
                        animation = [];
                    }
                    animation.forEach(v => {
                        if (!this.presetAnimations.has(v)) {
                            refs.add(v);
                        }
                    });
                    let result = Array.from(refs);
                    result.slice().forEach(current => {
                        if (REFERENCES_ORDER[current]) {
                            let afters = REFERENCES_ORDER[current]["after"];
                            afters.forEach(after => {
                                let currentIndex = result.indexOf(current);
                                let afterIndex = result.indexOf(after);
                                if (afterIndex > currentIndex) {
                                    this.swap(afterIndex, currentIndex, result);
                                }
                            });
                        }
                    });
                    this.modelInfo["animation"] = result;
                    this.$forceUpdate();
                }
            },
            swap: function (indexA, indexB, array) {
                let tmp = array[indexB];
                array[indexB] = array[indexA];
                array[indexA] = tmp;
            },
            deleteAnimation: function (index) {
                if (this.modelInfo && this.modelInfo["animation"]) {
                    this.modelInfo["animation"].splice(index, 1);
                }
            },
            addAnimation: function () {
                let filePaths = electron.dialog.showOpenDialogSync(currentwindow, {
                    properties: ["openFile"],
                    title: tl("dialog.tlm_utils.load_pack.edit.model.custom_animation.add.title"),
                    filters: [{name: "JavaScript", extensions: ["js"]}]
                });
                if (filePaths) {
                    let file = filePaths[0];
                    let animationPath = this.modelListInfo["animationPath"];
                    let newName = pathToName(file).toLowerCase().replace(/\s|-/g, "_");
                    if (!(/^[\w.]+$/.test(newName))) {
                        newName = sha1(newName).substr(0, 20);
                    }
                    newName += ".js";
                    fs.writeFileSync(pathJoin(animationPath, newName), fs.readFileSync(file));
                    let animationRef = `${this.modelListInfo["namespace"]}:animation/${newName}`;
                    this.modelInfo["animation"].push(animationRef);
                }
            },
            changeAnimation: function (index) {
                let filePaths = electron.dialog.showOpenDialogSync(currentwindow, {
                    properties: ["openFile"],
                    title: tl("dialog.tlm_utils.load_pack.edit.model.custom_animation.add.title"),
                    filters: [{name: "JavaScript", extensions: ["js"]}]
                });
                if (filePaths) {
                    let file = filePaths[0];
                    let res = this.modelInfo["animation"][index].split(":", 2);
                    if (res.length > 1) {
                        let path = pathJoin(this.modelListInfo.namespacePath, res[1]);
                        fs.writeFileSync(path, fs.readFileSync(file));
                    }
                }
            },
            selectedModel: function (index) {
                this.modelInfo = this.parent.showInfo.data["model_list"][index];
                this.modelListInfo = this.parent.showInfo;
                if (this.parent.selected === "maid") {
                    if (this.modelInfo["easter_egg"]["encrypt"]) {
                        this.tmpEncryptName = "";
                    } else {
                        this.tmpEncryptName = this.modelInfo["easter_egg"]["tag"];
                    }
                }
            },
            setEncryptEgg: function (encrypt) {
                if (encrypt) {
                    this.modelInfo["easter_egg"]["tag"] = this.sha1Egg;
                } else {
                    this.modelInfo["easter_egg"]["tag"] = this.tmpEncryptName;
                }
            },
            clickEncryptInput: function () {
                // FIXME: Because of the problem of data update and event triggering, the logic is just inverted...
                if (!this.modelInfo["easter_egg"]["encrypt"]) {
                    this.modelInfo["easter_egg"]["tag"] = this.sha1Egg;
                } else {
                    this.modelInfo["easter_egg"]["tag"] = this.tmpEncryptName;
                }
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
                    this.parent.reset();
                    this.parent.selected = this.parent.selected + " ";
                    this.parent.selected = this.parent.selected.trim();
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
                this.reset();
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
            },
            addModelDesc() {
                if (this.modelListInfo && this.modelListInfo.data && this.modelInfo) {
                    let modelId = this.modelInfo["model_id"];
                    let key = `model.${modelId.replace(":", ".")}.desc`;
                    let keyRaw = `{${key}}`;
                    this.modelListInfo.lang[key] = "";
                    if (!this.modelInfo["description"]) {
                        this.modelInfo["description"] = [];
                    }
                    this.modelInfo["description"].push(keyRaw);
                    this.$forceUpdate();
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
            modelNameKey: function () {
                if (this.modelInfo && this.modelInfo["model_id"]) {
                    let modelId = this.modelInfo["model_id"];
                    let name = this.modelInfo["name"];
                    if (isEmpty(name)) {
                        return `model.${modelId.replace(":", ".")}.name`;
                    } else {
                        return getTranslationKey(name);
                    }
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
            },
            modelDescKeys: function () {
                if (this.modelListInfo && this.modelListInfo.data && this.modelInfo && this.modelInfo["description"]) {
                    let output = [];
                    for (let keyRaw of this.modelInfo["description"]) {
                        if (typeof keyRaw === "string") {
                            output.push(getTranslationKey(keyRaw));
                        }
                    }
                    return output;
                }
            },
            isEditModelInfo: function () {
                return this.parent.selectedId >= 0;
            },
            sha1Egg: function () {
                return sha1(this.tmpEncryptName);
            },
            presetAnimations: function () {
                if (this.parent.selected === "maid") {
                    return MAID_ANIMATION_REFERENCES;
                } else {
                    return CHAIR_ANIMATION_REFERENCES;
                }
            },
            presetBones: function () {
                if (this.parent.selected === "maid") {
                    return MAID_ANIMATION_BONES;
                } else {
                    return CHAIR_ANIMATION_BONES;
                }
            },
            modelPathRes: function () {
                if (this.modelInfo && this.modelListInfo) {
                    let modelId = this.modelInfo["model_id"];
                    let model = this.modelInfo["model"];
                    if (model) {
                        return model;
                    } else {
                        let res = modelId.split(":", 2);
                        if (res.length > 1) {
                            return `${res[0]}:models/entity/${res[1]}.json`;
                        }
                    }
                }
            },
            texturePathRes: function () {
                if (this.modelInfo && this.modelListInfo) {
                    let modelId = this.modelInfo["model_id"];
                    let texture = this.modelInfo["texture"];
                    if (texture) {
                        return texture;
                    } else {
                        let res = modelId.split(":", 2);
                        if (res.length > 1) {
                            return `${res[0]}:textures/entity/${res[1]}.png`;
                        }
                    }
                }
            }
        }
    };
</script>

<style scoped>
    .model-edit-mounted-height-tip {
        margin-right: 2%;
        width: 8%;
        text-align: center;
        background-color: #1c2026;
        font-size: larger;
        color: #6a6a6d;
        border-radius: 1px;
        margin-top: 5px;
        height: 30px;
        border-style: solid;
        border-width: 1px;
        border-color: #181a1f;
    }

    .model-edit-mounted-height {
        width: 85%;
        background-color: #1c2026;
        border-radius: 1px;
        margin-top: 15px;
        margin-left: 3%;
        height: 10px;
        border-style: solid;
        border-width: 1px;
        border-color: #181a1f;
    }

    .model-edit-range-tip {
        margin-left: 50px;
        margin-right: 50px;
        margin-bottom: 2px;
        width: 50px;
        text-align: center;
        background-color: #1c2026;
        font-size: larger;
        color: #6a6a6d;
        border-radius: 1px;
        border-style: solid;
        border-width: 1px;
        border-color: #181a1f;
    }

    .model-edit-range {
        width: 150px;
        background-color: #1c2026;
        border-radius: 1px;
        margin-top: 15px;
        height: 10px;
        border-style: solid;
        border-width: 1px;
        border-color: #181a1f;
    }

    .model-edit-checkbox {
        width: 40px;
        padding-left: 10px;
    }

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

    .model-list-edit, .model-edit {
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

    .model-edit-main {
        width: 100%;
        height: 330px;
        overflow-y: auto;
    }

    .model-edit-main-sub {
        background-color: #21252b;
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

    .model-edit-name-input, .model-edit-desc-input, .model-edit-egg-input {
        border-radius: 1px;
        margin-top: 5px;
        padding: 5px;
        width: 100%;
        height: 20px;
        font-size: 20px;
        background-color: #1c2026;
        border-style: solid;
        border-width: 1px;
        border-color: #181a1f;
    }

    .model-edit-animation-item-button {
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

    .model-edit-animation-item-button:hover {
        background-color: #3e90ff;
        color: #1c2026;
    }

    .model-edit-animation-input {
        border-radius: 1px;
        margin-top: 3px;
        margin-right: 3px;
        padding: 2px;
        width: 100%;
        height: 16px;
        font-size: 12px;
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

    .summary-bar {
        background-color: #3a3f4b;
        height: 28px;
        width: 98%;
        padding: 4px 0 0 10px;
        font-size: medium;
        cursor: pointer;
    }

    .summary-bar:hover {
        color: #ffffff;
    }
</style>