import { mkdirs } from "../utils/filesystem";
import { TLM_PROJECT_INFO } from "../projectinfo";
import { isEmpty } from "../utils/string";
import { createMaidPackDialog } from "./createmaidpack";
import { createChairPackDialog } from "./createchairpack";
import { reloadAndReadLanguage } from "../utils/lang";

export var bindPack = new Action('bind_pack', {
    name: '绑定资源包',
    description: '绑定一个已经存在的资源包文件夹',
    icon: 'link',
    click: function () {
        // 选择放置资源包文件夹的窗口
        ElecDialogs.showOpenDialog(currentwindow, {
            properties: ['openDirectory']
        }, function (path) {
            checkIsPackFolder(path);
        });
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

                bindTypeDialog.show();
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

        bindTypeDialog.show();
    }
}

var bindTypeDialog = new Dialog({
    id: "bind_type_dialog",
    title: "选择绑定类型",
    form: {
        bindType: {
            type: "select",
            label: "绑定类型",
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
                let text = fs.readFileSync(chairModelFile, 'utf8').replace(/^\uFEFF/, "");
                TLM_PROJECT_INFO.pack_data = JSON.parse(text);
                let version = TLM_PROJECT_INFO.pack_data.version;
                if (isEmpty(version)) {
                    TLM_PROJECT_INFO.pack_data.version = "1.0.0";
                    TLM_PROJECT_INFO.version = "1.0.0";
                } else {
                    TLM_PROJECT_INFO.version = version;
                }
                bindTypeDialog.hide();
                // 状态栏显示        
                Blockbench.notification('已绑定资源包：', `${TLM_PROJECT_INFO.namespace}`);
            } else {
                TLM_PROJECT_INFO.version = "1.0.0";
                TLM_PROJECT_INFO.pack_data = {};
                createChairPackDialog.show();
            }
        }
        if (formData.bindType == "maid") {
            // 存储数据
            TLM_PROJECT_INFO["type"] = "maid";
            // 依据绑定类型检查对应文件是否存在
            let maidModelFile = `${TLM_PROJECT_INFO.namespace_path}/maid_model.json`
            if (fs.existsSync(maidModelFile) && fs.statSync(maidModelFile).isFile()) {
                let text = fs.readFileSync(maidModelFile, 'utf8').replace(/^\uFEFF/, "");
                TLM_PROJECT_INFO.pack_data = JSON.parse(text);
                let version = TLM_PROJECT_INFO.pack_data.version;
                if (isEmpty(version)) {
                    TLM_PROJECT_INFO.pack_data.version = "1.0.0";
                    TLM_PROJECT_INFO.version = "1.0.0";
                } else {
                    TLM_PROJECT_INFO.version = version;
                }
                bindTypeDialog.hide();
                // 状态栏显示        
                Blockbench.notification('已绑定资源包：', `${TLM_PROJECT_INFO.namespace}`);
            } else {
                TLM_PROJECT_INFO.version = "1.0.0";
                TLM_PROJECT_INFO.pack_data = {};
                createMaidPackDialog.show();
            }
        }
    }
});