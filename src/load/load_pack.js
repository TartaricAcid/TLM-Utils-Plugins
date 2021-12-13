import {isEmpty} from "../utils/string";
import {join as pathJoin} from "path";
import loadPackMainVue from "./load_pack_main.vue";

var CACHE_TLM_PACK = [];
export var CACHE_TLM_PACK_ACTION = {
    name: "menu.tlm_utils.load_cache_pack",
    id: "tlm_utils.load_cache_pack",
    icon: "fa-history",
    children: function () {
        let arr = [...CACHE_TLM_PACK].reverse();
        if (arr.length) {
            arr.push("_", {
                name: "menu.tlm_utils.clear_cache_pack",
                icon: "clear",
                click: function () {
                    localStorage.removeItem("cacheTlmPacks");
                    CACHE_TLM_PACK.length = 0;
                }
            });
        }
        return arr;
    }
};

export var loadPackAction = new Action("tlm_utils.load_pack", {
    name: "menu.tlm_utils.load_pack",
    icon: "unarchive",
    click: function () {
        let filePaths = electron.dialog.showOpenDialogSync(currentwindow, {
            title: tl("dialog.tlm_utils.load_pack.title"),
            properties: ["openDirectory"]
        });
        if (!filePaths) {
            return;
        }
        let path = filePaths[0];
        cacheAndOpenLoadPackDialog(path);
    }
});

export function cacheAndOpenLoadPackDialog(path) {
    if (isEmpty(path)) {
        return;
    }
    let data = getPackFolderData(path);
    if (!data) {
        return;
    }
    addToCache(path);
    openLoadPackDialog(data);
}

function addToCache(path) {
    let cacheTlmPacks = localStorage.getItem("cacheTlmPacks");
    if (isEmpty(cacheTlmPacks)) {
        cacheTlmPacks = {};
    } else {
        cacheTlmPacks = JSON.parse(cacheTlmPacks);
    }
    let name = pathToName(path, true);
    cacheTlmPacks[name] = path;
    localStorage.setItem("cacheTlmPacks", JSON.stringify(cacheTlmPacks));
    addCacheTlmPackAction(name, path);
}

function openLoadPackDialog(data) {
    let namespaceMap = data.namespaceMap;
    let assetsPath = data.assetsPath;
    let packEditDialog = new Dialog({
        title: "dialog.tlm_utils.load_pack.detail",
        width: 1280,
        singleButton: true,
        sidebar: {
            pages: namespaceMap,
            page: Object.keys(namespaceMap)[0],
            actions: [
                new Action("tlm_utils.load_pack.open_folder", {
                    name: "menu.tlm_utils.load_pack.open_folder",
                    icon: "fa-folder-open",
                    click: function () {
                        if (isEmpty(packEditDialog.sidebar.page)) {
                            return;
                        }
                        let openPath = pathJoin(assetsPath, packEditDialog.sidebar.page);
                        electron.shell.openPath(openPath).then(result => {
                        });
                    }
                }),
                new Action("tlm_utils.load_pack.new", {
                    name: "menu.tlm_utils.load_pack.new",
                    icon: "fa-folder-plus",
                    click: function () {
                        packEditDialog.sidebar.setPage("");
                        let child = packEditDialog.content_vue.$children[0];
                        child.newSubModelPack = true;
                    }
                }),
                new Action("tlm_utils.load_pack.delete", {
                    name: "menu.tlm_utils.load_pack.delete",
                    icon: "fa-trash-alt",
                    click: function () {
                        if (isEmpty(packEditDialog.sidebar.page)) {
                            return;
                        }
                        let index = electron.dialog.showMessageBoxSync(currentwindow, {
                            title: tl("menu.tlm_utils.load_pack.delete"),
                            message: tl("dialog.tlm_utils.load_pack.delete.desc"),
                            detail: tl("dialog.tlm_utils.load_pack.delete.tip"),
                            type: "warning",
                            buttons: [tl("button.tlm_utils.confirm"), tl("button.tlm_utils.cancel")],
                            defaultId: 1,
                            cancelId: 1,
                            noLink: true
                        });
                        let page = packEditDialog.sidebar.page;
                        let pages = packEditDialog.sidebar.pages;
                        if (index === 0 && page in pages) {
                            let delPath = pathJoin(assetsPath, page);
                            electron.shell.trashItem(delPath).then(() => {
                                delete pages[page];
                                let pageKeys = Object.keys(pages);
                                if (pages && pageKeys.length > 0) {
                                    packEditDialog.sidebar.setPage(pageKeys[0]);
                                } else {
                                    packEditDialog.sidebar.setPage("");
                                }
                                packEditDialog.sidebar.build();
                            });
                        }
                    }
                })
            ],
            onPageSwitch(page) {
                let child = packEditDialog.content_vue.$children[0];
                if (child.openCategory !== page) {
                    child.openCategory = page;
                    child.newSubModelPack = false;
                    child.reset();
                    if (child.hasModelListFile("maid")) {
                        child.selected = "maid";
                        return;
                    }
                    if (child.hasModelListFile("chair")) {
                        child.selected = "chair";
                    }
                }
            }
        },
        component: {
            data() {
                return {
                    assetsPath: assetsPath,
                    namespaceMap: namespaceMap,
                    packEditDialog: packEditDialog
                };
            },
            components: {loadPackMainVue},
            template: "<loadPackMainVue class='tlm-load-pack-main' :assetsPath='assetsPath' :namespaceMap='namespaceMap' :packEditDialog='packEditDialog'/>"
        }
    });
    packEditDialog.show();
}

function getPackFolderData(path) {
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

    return {
        "assetsPath": assetsPath,
        "namespaceMap": namespaceMap
    };
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

export function initCacheTlmPackAction() {
    let cacheTlmPacks = localStorage.getItem("cacheTlmPacks");
    if (isEmpty(cacheTlmPacks)) {
        return;
    }
    cacheTlmPacks = JSON.parse(cacheTlmPacks);
    if (cacheTlmPacks) {
        for (let name of Object.keys(cacheTlmPacks)) {
            let path = cacheTlmPacks[name];
            if (fs.existsSync(path)) {
                addCacheTlmPackAction(name, path);
            } else {
                delete cacheTlmPacks[name];
            }
        }
    }
    localStorage.setItem("cacheTlmPacks", JSON.stringify(cacheTlmPacks));
}

function addCacheTlmPackAction(name, desc) {
    CACHE_TLM_PACK.push({
        id: name,
        name: name,
        description: desc,
        icon: "fa-folder",
        click: function () {
            let cacheTlmPacks = localStorage.getItem("cacheTlmPacks");
            if (isEmpty(cacheTlmPacks)) {
                return;
            }
            cacheTlmPacks = JSON.parse(cacheTlmPacks);
            if (cacheTlmPacks[this.id]) {
                let path = cacheTlmPacks[this.id];
                let data = getPackFolderData(path);
                if (!data) {
                    return;
                }
                openLoadPackDialog(data);
            }
        }
    });
}