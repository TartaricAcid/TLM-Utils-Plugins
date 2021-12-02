import {isEmpty} from "../utils/string";
import {join as pathJoin} from "path";
import loadFileMainVue from "./load_file_main.vue";

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
        if (!path || path.length < 1) {
            return;
        }
        let data = getPackFolderData(path);
        if (!data) {
            return;
        }
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
                                    if (pages && Object.keys(pages).length > 0) {
                                        packEditDialog.sidebar.setPage(Object.keys(pages)[0]);
                                    } else {
                                        packEditDialog.sidebar.setPage("");
                                    }
                                    packEditDialog.sidebar.build();
                                });
                            }
                        }
                    }),
                ],
                onPageSwitch(page) {
                    let child = packEditDialog.content_vue.$children[0];
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
            },
            component: {
                data() {
                    return {
                        assetsPath: assetsPath,
                        namespaceMap: namespaceMap,
                        packEditDialog: packEditDialog
                    };
                },
                components: {loadFileMainVue},
                template: "<loadFileMainVue :assetsPath='assetsPath' :namespaceMap='namespaceMap' :packEditDialog='packEditDialog'/>"
            }
        });
        packEditDialog.show();
    }
});

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