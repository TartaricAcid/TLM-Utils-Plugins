import { mkdirs } from "../utils/filesystem";
import { TLM_PROJECT_INFO } from "../projectinfo";
import { isEmpty } from "../utils/string";
import { createMaidPackDialog } from "./createmaidpack";
import { createChairPackDialog } from "./createchairpack";
import { saveNewMaidModelDialog, saveNewChairModelDialog } from "../model/savemodel";
import { reloadAndReadLanguage } from "../utils/lang";

export var exportPack = new Action('export_pack', {
    name: '导出模型',
    description: '将当前模型导出到资源包中',
    icon: 'archive',
    click: function () {
        // 先检查当前是否处于正确的导出状态
        // 工作区正确，而且模型材质不为空
        if (Format) {
            if (Format.id != "bedrock_old") {
                Blockbench.showMessageBox({
                    title: "当前模型格式不正确！",
                    message: '模型格式只支持 <font color="red">旧版基岩版</font> 模型！<br>你可以通过 <font color="orange">文件/转换工程</font> 菜单进行格式转换！',
                    icon: "warning"
                }, function (result) { })
            } else {
                // 模型为空
                if (Outliner.root.length == 0) {
                    Blockbench.showMessageBox({
                        title: "当前模型为空！",
                        message: '请先创建模型，然后再进行导出！',
                        icon: "warning"
                    }, function (result) { })
                } else {
                    // 材质为空，提醒
                    if (textures.length == 0) {
                        Blockbench.notification("你当前没有创建材质！", "你仍旧可以导出模型，但游戏内的该模型将没有材质！");
                    }
                    // 延迟打开，因为和前面的通知会存在冲突
                    setTimeout(() => {
                        // 选择放置资源包文件夹的窗口
                        ElecDialogs.showOpenDialog(currentwindow, {
                            title: "选择资源包文件夹",
                            properties: ['openDirectory']
                        }, function (path) {
                            if (path != undefined && path != null) {
                                checkIsPackFolder(path);
                            }
                        });
                    }, 25);
                }
            }
        } else {
            Blockbench.showMessageBox({
                title: "当前没有模型",
                message: '请先创建模型，然后再进行模型导出！',
                icon: "warning"
            }, function (result) { })
        }
    }
});

function checkIsPackFolder(path) {
    let namespace;
    let namespacePath;

    // 检查文件夹结构
    // 检查是否存在 pack.mcmeta 文件
    let mcmetaPath = `${path}/pack.mcmeta`;
    if (fs.existsSync(mcmetaPath)) {
        if (!fs.statSync(mcmetaPath).isFile()) {
            Blockbench.showMessageBox({
                title: "提示：",
                message: "选择的文件夹不是资源包，pack.mcmeta 应该是文件！",
                icon: "warning"
            }, function (result) { });
            return;
        };
    } else {
        Blockbench.showMessageBox({
            title: "提示：",
            message: "选择的文件夹不是资源包，缺少 pack.mcmeta 文件！",
            icon: "warning"
        }, function (result) { });
        return;
    }

    // 检查 assets 文件夹
    let assetsPath = `${path}/assets`;
    if (fs.existsSync(assetsPath)) {
        if (!fs.statSync(assetsPath).isDirectory()) {
            Blockbench.showMessageBox({
                title: "提示：",
                message: "选择的文件夹不是资源包，assets 应该是文件夹！",
                icon: "warning"
            }, function (result) { });
            return;
        };
    } else {
        Blockbench.showMessageBox({
            title: "提示：",
            message: "选择的文件夹不是资源包，缺少 assets 文件！",
            icon: "warning"
        }, function (result) { });
        return;
    }

    // 检查命名空间    
    let namespaceList = []
    let namespaceFiles = fs.readdirSync(assetsPath);
    for (let file of namespaceFiles) {
        let stats = fs.statSync(`${assetsPath}/${file}`);
        if (stats.isDirectory()) {
            namespaceList.push(file);
        }
    }
    // 如果不存在命名空间
    if (namespaceList.length == 0) {
        Blockbench.showMessageBox({
            title: "提示：",
            message: "选择的文件夹不是资源包，缺少命名空间文件夹！",
            icon: "warning"
        }, function (result) { });
        return;
    }
    // 如果存在多个命名空间，弹出选择框
    if (namespaceList.length > 1) {
        let obj = {};
        for (let e of namespaceList) {
            obj[e] = e;
        }
        let select = new Dialog({
            title: "发现多个命名空间文件夹，请选择一个！",
            form: {
                folder: {
                    type: "select",
                    label: "命名空间",
                    default: namespaceList[0],
                    options: obj
                }
            },
            onConfirm: function (formData) {
                select.hide();
                namespace = formData.folder;
                namespacePath = `${assetsPath}/${formData.folder}`

                // 检查通过，检查文件夹并进行创建
                mkdirs(`${namespacePath}/models/entity`);
                mkdirs(`${namespacePath}/textures/entity`);
                mkdirs(`${namespacePath}/lang`);
                mkdirs(`${namespacePath}/animation`);

                TLM_PROJECT_INFO.namespace = namespace;
                TLM_PROJECT_INFO.namespace_path = namespacePath;
                TLM_PROJECT_INFO.animation_path = `${namespacePath}/animation`;
                TLM_PROJECT_INFO.lang_path = `${namespacePath}/lang`;
                TLM_PROJECT_INFO.models_path = `${namespacePath}/models/entity`;
                TLM_PROJECT_INFO.textures_path = `${namespacePath}/textures/entity`;

                // 重读语言文件
                reloadAndReadLanguage();

                // 让使用者选择类型
                exportTypeDialog.show();
            }
        });
        select.show();
        return;
    }

    // 如果是单个文件夹，直接选择
    if (namespaceList.length == 1) {
        namespace = namespaceList[0];
        namespacePath = `${assetsPath}/${namespaceList[0]}`

        // 检查通过，检查文件夹并进行创建
        mkdirs(`${namespacePath}/models/entity`);
        mkdirs(`${namespacePath}/textures/entity`);
        mkdirs(`${namespacePath}/lang`);
        mkdirs(`${namespacePath}/animation`);

        TLM_PROJECT_INFO.namespace = namespace;
        TLM_PROJECT_INFO.namespace_path = namespacePath;
        TLM_PROJECT_INFO.animation_path = `${namespacePath}/animation`;
        TLM_PROJECT_INFO.lang_path = `${namespacePath}/lang`;
        TLM_PROJECT_INFO.models_path = `${namespacePath}/models/entity`;
        TLM_PROJECT_INFO.textures_path = `${namespacePath}/textures/entity`;

        // 重读语言文件
        reloadAndReadLanguage();

        // 让使用者选择类型
        exportTypeDialog.show();
    }
}

var exportTypeDialog = new Dialog({
    id: "export_type_dialog",
    title: "选择导出类型",
    form: {
        bindType: {
            type: "select",
            label: "导出类型",
            default: 'maid',
            options: {
                maid: "女仆模型",
                chair: "坐垫模型",
            }
        }
    },
    onConfirm: function (formData) {
        if (formData.bindType == "chair") {
            // 存储数据
            TLM_PROJECT_INFO["type"] = "chair";
            // 依据绑定类型检查对应文件是否存在
            let chairModelFile = `${TLM_PROJECT_INFO.namespace_path}/maid_chair.json`
            if (fs.existsSync(chairModelFile) && fs.statSync(chairModelFile).isFile()) {
                // 剔除 JSON 开头的 BOM 标记
                let text = fs.readFileSync(chairModelFile, 'utf8').replace(/^\uFEFF/, "");
                TLM_PROJECT_INFO.pack_data = JSON.parse(text);
                // version 的书写
                let version = TLM_PROJECT_INFO.pack_data.version;
                if (isEmpty(version)) {
                    TLM_PROJECT_INFO.pack_data.version = "1.0.0";
                    TLM_PROJECT_INFO.version = "1.0.0";
                } else {
                    TLM_PROJECT_INFO.version = version;
                }
                exportTypeDialog.hide();
                // 打开模型信息填写页面
                saveNewChairModelDialog.show();
            } else {
                TLM_PROJECT_INFO.version = "1.0.0";
                TLM_PROJECT_INFO.pack_data = {};
                Blockbench.notification("该资源包没有坐垫模型包", "请填写对话框，完善坐垫模型包相关数据");
                createChairPackDialog.show();
            }
        }
        if (formData.bindType == "maid") {
            // 存储数据
            TLM_PROJECT_INFO["type"] = "maid";
            // 依据绑定类型检查对应文件是否存在
            let maidModelFile = `${TLM_PROJECT_INFO.namespace_path}/maid_model.json`
            if (fs.existsSync(maidModelFile) && fs.statSync(maidModelFile).isFile()) {
                // 剔除 JSON 开头的 BOM 标记
                let text = fs.readFileSync(maidModelFile, 'utf8').replace(/^\uFEFF/, "");
                TLM_PROJECT_INFO.pack_data = JSON.parse(text);
                // version 的书写
                let version = TLM_PROJECT_INFO.pack_data.version;
                if (isEmpty(version)) {
                    TLM_PROJECT_INFO.pack_data.version = "1.0.0";
                    TLM_PROJECT_INFO.version = "1.0.0";
                } else {
                    TLM_PROJECT_INFO.version = version;
                }
                exportTypeDialog.hide();
                // 打开模型信息填写页面
                saveNewMaidModelDialog.show();
            } else {
                TLM_PROJECT_INFO.version = "1.0.0";
                TLM_PROJECT_INFO.pack_data = {};
                Blockbench.notification("该资源包没有女仆模型包", "请填写对话框，完善女仆模型包相关数据");
                createMaidPackDialog.show();
            }
        }
    }
});