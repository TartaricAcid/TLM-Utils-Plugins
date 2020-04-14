import {mkdirs} from "../utils/filesystem";
import {TLM_PROJECT_INFO} from "../projectinfo";
import {isEmpty} from "../utils/string";
import {reloadAndReadLanguage} from "../utils/lang";
import {dirname as _dirname} from "path";

export var loadPack = new Action('load_pack', {
    name: '导入模型',
    description: '从已有资源包中导入模型',
    icon: 'unarchive',
    cachePath: "",
    click: function () {
        // 新建一个项目
        if (newProject(Formats['bedrock_old'], false)) {
            // 选择放置资源包文件夹的窗口
            ElecDialogs.showOpenDialog(currentwindow, {
                title: "选择导入的资源包文件夹",
                properties: ['openDirectory']
            }, function (path) {
                if (path !== undefined && path !== null && path.length > 0) {
                    checkIsPackFolder(path);
                }
            });
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
            }, function (result) {
            });
            return;
        }
    } else {
        Blockbench.showMessageBox({
            title: "提示：",
            message: "选择的文件夹不是资源包，缺少 pack.mcmeta 文件！",
            icon: "warning"
        }, function (result) {
        });
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
            }, function (result) {
            });
            return;
        }
    } else {
        Blockbench.showMessageBox({
            title: "提示：",
            message: "选择的文件夹不是资源包，缺少 assets 文件！",
            icon: "warning"
        }, function (result) {
        });
        return;
    }

    // 检查命名空间    
    let namespaceList = [];
    let namespaceFiles = fs.readdirSync(assetsPath);
    for (let file of namespaceFiles) {
        let stats = fs.statSync(`${assetsPath}/${file}`);
        if (stats.isDirectory()) {
            namespaceList.push(file);
        }
    }
    // 如果不存在命名空间
    if (namespaceList.length === 0) {
        Blockbench.showMessageBox({
            title: "提示：",
            message: "选择的文件夹不是资源包，缺少命名空间文件夹！",
            icon: "warning"
        }, function (result) {
        });
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
                namespacePath = `${assetsPath}/${formData.folder}`;

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
    if (namespaceList.length === 1) {
        namespace = namespaceList[0];
        namespacePath = `${assetsPath}/${namespaceList[0]}`;

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
        }, function (result) {
        });
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

let bindTypeDialog = new Dialog({
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
        if (formData.bindType === "chair") {
            // 存储数据
            TLM_PROJECT_INFO["type"] = "chair";
            readPackInfo(`${TLM_PROJECT_INFO.namespace_path}/maid_chair.json`);
        }
        if (formData.bindType === "maid") {
            // 存储数据
            TLM_PROJECT_INFO["type"] = "maid";
            readPackInfo(`${TLM_PROJECT_INFO.namespace_path}/maid_model.json`);
        }
    }
});

function readPackInfo(filePath) {
    // 剔除文件头部的 BOM 字符
    let text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, "");
    TLM_PROJECT_INFO.pack_data = JSON.parse(text);
    // 版本的提取
    let version = TLM_PROJECT_INFO.pack_data.version;
    if (isEmpty(version)) {
        TLM_PROJECT_INFO.pack_data.version = "1.0.0";
        TLM_PROJECT_INFO.version = "1.0.0";
    } else {
        TLM_PROJECT_INFO.version = version;
    }

    // 模型列表为空的提示
    let modelList = TLM_PROJECT_INFO.pack_data.model_list;
    if (modelList === undefined || modelList === null || modelList.length < 1) {
        Blockbench.showMessageBox({
            title: "提示：",
            message: "检测到该包不包含模型，请确认你选择了正确的资源包！",
            icon: "warning"
        }, function (result) {
        });
        return;
    }
    // 获取一个包含 模型 ID -> 模型名称 的对象
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
            if (name.indexOf("{") === 0 && name.indexOf("}") === (name.length - 1)) {
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

    let selectModelDialog = new Dialog({
        id: "select_model_dialog",
        title: "请选择模型",
        form: {
            modelId: {
                type: "select",
                label: "选择模型",
                options: id2Name
            }
        },
        onConfirm: function (formData) {
            selectModelDialog.hide();

            // 依据 ID 获取对应条目
            TLM_PROJECT_INFO.model_id = formData.modelId;
            let modelId = `${TLM_PROJECT_INFO.namespace}:${formData.modelId}`;
            let modelData;
            modelList.forEach(function (model) {
                if (model.model_id === modelId) {
                    modelData = model;
                }
            });

            if (modelData === undefined || modelData === null) {
                console.exception("严重错误！选取的模型不在模型列表中！");
                return;
            }

            // 默认位置的书写
            let modelFilePath = `${TLM_PROJECT_INFO.models_path}/${formData.modelId}.json`;
            let textureFilePath = `${TLM_PROJECT_INFO.textures_path}/${formData.modelId}.png`;

            // 如果显示声明了位置，进行覆盖
            if (!isEmpty(modelData.model)) {
                // 拆分出 namespace
                let ns = modelData.model.split(":", 2)[0];
                let path = modelData.model.split(":", 2)[1];
                // 检查命名空间
                if (ns !== TLM_PROJECT_INFO.namespace) {
                    Blockbench.showMessageBox({
                        title: "异常：",
                        message: "检测到选择的模型含了其他外部文件，无法进行加载！",
                        icon: "warning"
                    }, function (result) {
                    });
                    return;
                } else {
                    modelFilePath = `${TLM_PROJECT_INFO.namespace_path}/${path}`;
                }
            }

            // 如果显示声明了位置，进行覆盖
            if (!isEmpty(modelData.texture)) {
                // 拆分出 namespace
                let ns = modelData.texture.split(":", 2)[0];
                let path = modelData.texture.split(":", 2)[1];
                // 检查命名空间
                if (ns !== TLM_PROJECT_INFO.namespace) {
                    Blockbench.showMessageBox({
                        title: "异常：",
                        message: "检测到选择的模型材质包含了其他外部文件，无法进行加载！",
                        icon: "warning"
                    }, function (result) {
                    });
                    return;
                } else {
                    textureFilePath = `${TLM_PROJECT_INFO.namespace_path}/${path}`;
                }
            }

            Blockbench.read([modelFilePath], {
                errorbox: true
            }, function (files) {
                // 加载模型
                loadModelFile(files[0]);
                // 模型改名
                Project.geometry_name = "model";
                Project.name = TLM_PROJECT_INFO.model_id;
                // 将导出路径修改为此路径
                // 这样后续 Ctrl + S 保存时候会自动覆盖
                ModelMeta.name = _dirname(modelFilePath);
                ModelMeta.export_path = modelFilePath;

                // 材质加载
                Blockbench.read([textureFilePath], {
                    readtype: "image",
                    errorbox: true
                }, function (files) {
                    files.forEach(function (f) {
                        new Texture({
                            name: f.name,
                            folder: _dirname(f.path),
                            path: f.path,
                        }).fromFile(f).add(false);
                        TLM_PROJECT_INFO.textures_path = _dirname(f.path);
                        TLM_PROJECT_INFO.texture_name = f.name;
                    });
                })
            });
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
            if (line.indexOf("#") !== 0) {
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
            if (line.indexOf("#") !== 0) {
                let text = line.split("=", 2);
                if (!isEmpty(text[0]) && !isEmpty(text[1])) {
                    output[text[0]] = text[1];
                }
            }
        });
    }
    return output;
}