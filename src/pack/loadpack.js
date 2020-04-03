import { mkdirs } from "../utils/filesystem";
import { TLM_PROJECT_INFO } from "../projectinfo";
import { isEmpty } from "../utils/string";
import { reloadAndReadLanguage } from "../utils/lang";

export var loadPack = new Action('load_pack', {
    name: '导入资源包模型',
    description: '从已有资源包中导入模型',
    icon: 'inbox',
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

                // 运用选择模型逻辑
                chooseMaidOrChair(namespacePath);
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

        // 运用选择模型逻辑
        chooseMaidOrChair(namespacePath);
    }
}

function chooseMaidOrChair(namespacePath) {
    // 两个模型描述文件
    let maidModelFile = `${namespacePath}/maid_model.json`;
    let chairModelFile = `${namespacePath}/maid_chair.json`;

    // 都不存在，弹出提示
    if (!fs.existsSync(maidModelFile) && !fs.existsSync(chairModelFile)) {
        Blockbench.showMessageBox({
            title: "提示：",
            message: "该资源包不包含模型描述文件，请确认选择了正确的资源包！",
            icon: "warning"
        }, function (result) { });
        return;
    }

    // 都存在，让使用者选择
    if (fs.existsSync(maidModelFile) && fs.existsSync(chairModelFile)) {
        bindTypeDialog.show();
        return;
    }

    // 存在其中一个，直接弹出选择界面
    if (fs.existsSync(maidModelFile)) {
        // 存储数据
        TLM_PROJECT_INFO["type"] = "maid";
        readPackInfo(maidModelFile);
        return;
    }
    if (fs.existsSync(chairModelFile)) {
        // 存储数据
        TLM_PROJECT_INFO["type"] = "chair";
        readPackInfo(chairModelFile);
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
            readPackInfo(`${TLM_PROJECT_INFO.namespace_path}/maid_chair.json`);
        }
        if (formData.bindType == "maid") {
            // 存储数据
            TLM_PROJECT_INFO["type"] = "maid";
            readPackInfo(`${TLM_PROJECT_INFO.namespace_path}/maid_model.json`);
        }
        // 状态栏显示        
        Blockbench.notification('已绑定资源包：', `${TLM_PROJECT_INFO.namespace}`);
    }
});

function readPackInfo(filePath) {
    let text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, "");
    TLM_PROJECT_INFO.pack_data = JSON.parse(text);
    let version = TLM_PROJECT_INFO.pack_data.version;
    if (isEmpty(version)) {
        TLM_PROJECT_INFO.pack_data.version = "1.0.0";
        TLM_PROJECT_INFO.version = "1.0.0";
    } else {
        TLM_PROJECT_INFO.version = version;
    }

    let modelList = TLM_PROJECT_INFO.pack_data.model_list;
    if (modelList == undefined || modelList == null || modelList.length < 1) {
        Blockbench.showMessageBox({
            title: "提示：",
            message: "检测到该包不包含模型，请确认你选择了正确的资源包！",
            icon: "warning"
        }, function (result) { });
        return;
    }
    // 获取一个包含 模型名称 -> 模型 ID 的对象
    let id2Name = {};
    let lang = getChineseLanguage();

    // 获取选择列表的显示
    modelList.forEach(function (model) {
        let modelId = model.model_id.split(":", 2)[1];
        let name = model.name;

        // 模型没有名称字段
        if (isEmpty(name)) {
            // 依据默认规则获取语言文件的 key
            let key = `model.${model.model_id.replace(":", ".")}.name`;
            // 如果语言文件不包含该 key，直接以模型 id 作为名称
            if (isEmpty(lang[key])) {
                id2Name[modelId] = modelId;
            }
            // 如果语言文件包含 key，获取指定的本地化名称
            else {
                id2Name[modelId] = lang[key];
            }
        }
        // 模型有名称字段
        else {
            // 模型使用的是本地化方式
            if (name.indexOf("{") == 0 && name.indexOf("}") == (name.length - 1)) {
                // 获取对应的 key
                let key = name.replace(/^{/, "").replace(/}$/, "");
                // 如果语言文件不包含该 key，直接以模型 id 作为名称
                if (isEmpty(lang[key])) {
                    id2Name[modelId] = modelId;
                }
                // 如果语言文件包含 key，获取指定的本地化名称
                else {
                    id2Name[modelId] = lang[key];
                }
            }
            // 否则直接获取名称字段
            else {
                id2Name[modelId] = name;
            }
        }
    });

    var selectModelDialog = new Dialog({
        id: "select_model_dialog",
        title: "请选择模型",
        form: {
            bindType: {
                type: "select",
                label: "选择模型",
                options: id2Name
            }
        },
        onConfirm: function (formData) {
            // TODO 已经获取到了指定的模型 ID，后续进行模型数据的导入和定位
            cl(formData.bindType);
            selectModelDialog.hide();
        }
    });
    selectModelDialog.show();
}

function getChineseLanguage() {
    let englishFile = `${TLM_PROJECT_INFO["lang_path"]}/en_us.lang`;
    let chineseFile = `${TLM_PROJECT_INFO["lang_path"]}/zh_cn.lang`;
    let output = {};
    if (fs.existsSync(englishFile) && fs.statSync(englishFile).isFile()) {
        let allText = fs.readFileSync(englishFile, 'utf8');
        allText.split(/\r?\n/).forEach(function (line) {
            // 排除 # 开头的注释
            if (line.indexOf("#") != 0) {
                let text = line.split("=", 2);
                if (!isEmpty(text[0]) && !isEmpty(text[1])) {
                    output[text[0]] = text[1];
                }
            }
        });
    }
    if (fs.existsSync(chineseFile) && fs.statSync(chineseFile).isFile()) {
        let allText = fs.readFileSync(chineseFile, 'utf8');
        allText.split(/\r?\n/).forEach(function (line) {
            // 排除 # 开头的注释
            if (line.indexOf("#") != 0) {
                let text = line.split("=", 2);
                if (!isEmpty(text[0]) && !isEmpty(text[1])) {
                    output[text[0]] = text[1];
                }
            }
        });
    }
    return output;
}