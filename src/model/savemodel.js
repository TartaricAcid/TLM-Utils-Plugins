import {isEmpty} from "../utils/string";
import {addLanguageEntry, saveLanguageFile} from "../utils/lang";
import {TLM_PROJECT_INFO} from "../projectinfo";
import {checkDuplicateModelId, addModelToList} from "../utils/checkdata";

export var saveNewMaidModelDialog = new Dialog({
    id: "save_new_maid_model_dialog",
    title: "请输入模型相关参数",
    form: {
        modelId: {
            label: "模型 ID（必填）",
            type: "input",
            placeholder: "仅支持小写英文字符和 . 和 _"
        },
        modelName: {
            label: "模型名称（必填）",
            type: "input",
            placeholder: "建议使用英文描述"
        },
        line1: "_",
        modelDesc: {
            label: "模型描述（可选）",
            type: "input",
            placeholder: "留空表示不填写任何描述"
        },
        renderItemScale: {
            label: "渲染成物品时的大小",
            type: "number",
            value: 1.0,
            min: 0.1,
            max: 2,
            step: 0.05
        },
        renderEntityScale: {
            label: "渲染成实体时的大小",
            type: "number",
            value: 1.0,
            min: 0.7,
            max: 1.3,
            step: 0.05
        },
        showHata: {
            label: "显示旗指物",
            type: "checkbox",
            value: true
        },
        showBackpack: {
            label: "显示背包",
            type: "checkbox",
            value: true
        },
        canHoldTrolley: {
            label: "持有拉杆箱",
            type: "checkbox",
            value: true
        },
        canHoldVehicle: {
            label: "持有载具",
            type: "checkbox",
            value: true
        },
        canRidingBroom: {
            label: "骑乘扫帚",
            type: "checkbox",
            value: true
        },
        showCustomHead: {
            label: "显示头颅",
            type: "checkbox",
            value: true
        },
        animation: {
            label: "动画脚本（可选）",
            type: "file",
            extensions: ['blockbench'],
            filetype: 'JS'
        },
    },
    onConfirm: function (formData) {
        // 数据获取
        let namespace = TLM_PROJECT_INFO["namespace"];

        // 模型数据
        let modelData = {};
        let languageMap = {};

        // 将 ID 中的大写字符全部变成小写字符
        // 空格和 - 字符转换为下划线
        let modelId = formData.modelId.toLowerCase().replace(/\s|-/g, '_');

        // 必填数据的格式判定
        // ID 字符校验
        if (!(/^[\w.]+$/.test(modelId))) {
            Blockbench.notification("模型 ID 不合法！", "模型 ID 仅支持英文字母，下划线和英文点号！");
            return;
        } else {
            saveNewMaidModelDialog.form.modelId.value = formData.modelId;
        }

        // 存储 id 数据
        TLM_PROJECT_INFO["model_id"] = modelId;
        TLM_PROJECT_INFO["texture_name"] = `${modelId}.png`;
        // 存入模型数据
        modelData["model_id"] = `${namespace}:${modelId}`;

        // 模型名不能为空
        if (isEmpty(formData.modelName)) {
            Blockbench.notification("模型名称不能为空", "请输入一个可辨识的英文模型名称！");
            return;
        } else {
            // 往语言文件里面书写名称
            languageMap[`model.${namespace}.${modelId}.name`] = formData.modelName;
            saveNewMaidModelDialog.form.modelName.value = formData.modelName;
        }

        // 模型描述数据存储
        if (!isEmpty(formData.modelDesc)) {
            modelData["description"] = [`{model.${namespace}.${modelId}.desc}`];
            // 往语言文件里面书写描述
            languageMap[`model.${namespace}.${modelId}.desc`] = formData.modelDesc;
            saveNewMaidModelDialog.form.modelDesc.value = formData.modelDesc;
        }

        // 兼容性数据书写
        if (formData.renderItemScale !== 1) {
            modelData["render_item_scale"] = formData.renderItemScale;
            saveNewMaidModelDialog.form.renderItemScale.value = formData.renderItemScale;
        }
        if (formData.renderEntityScale !== 1) {
            modelData["render_entity_scale"] = formData.renderEntityScale;
            saveNewMaidModelDialog.form.renderEntityScale.value = formData.renderEntityScale;
        }
        if (!formData.showHata) {
            modelData["show_hata"] = false;
            saveNewMaidModelDialog.form.showHata.value = false;
        }
        if (!formData.showBackpack) {
            modelData["show_backpack"] = false;
            saveNewMaidModelDialog.form.showBackpack.value = false;
        }
        if (!formData.canHoldTrolley) {
            modelData["can_hold_trolley"] = false;
            saveNewMaidModelDialog.form.canHoldTrolley.value = false;
        }
        if (!formData.canHoldVehicle) {
            modelData["can_hold_vehicle"] = false;
            saveNewMaidModelDialog.form.canHoldVehicle.value = false;
        }
        if (!formData.canRidingBroom) {
            modelData["can_riding_broom"] = false;
            saveNewMaidModelDialog.form.canRidingBroom.value = false;
        }
        if (!formData.showCustomHead) {
            modelData["show_custom_head"] = false;
            saveNewMaidModelDialog.form.showCustomHead.value = false;
        }
        // 动画脚本数据书写
        if (!isEmpty(formData.animation)) {
            let animationFilePath = formData.animation;
            let animationFileName = pathToName(animationFilePath).toLowerCase().replace(/\s|-/g, '_');
            modelData["animation"] = [`${namespace}:animation/${animationFileName}.js`];
        }

        // 检查重复 ID
        if (checkDuplicateModelId()) {
            Blockbench.showMessageBox({
                title: "检查到当前 ID 和已有模型 ID 重复",
                message: "是否继续进行保存？<br>这会覆盖掉同名模型的相关数据！",
                confirm: 0,
                cancel: 1,
                buttons: ["确认覆盖", "取消"]
            }, function (result) {
                if (result === 0) {
                    saveModel(modelData, formData.animation, languageMap, "maid_model");
                    // 隐藏对话框
                    saveNewMaidModelDialog.hide();
                }
            })
        } else {
            saveModel(modelData, formData.animation, languageMap, "maid_model");
            // 隐藏对话框
            saveNewMaidModelDialog.hide();
        }
    }
});

function saveModel(modelData, animationFilePath, languageMap, jsonFileName) {
    // 模型包文件地址
    let jsonFile = `${TLM_PROJECT_INFO.namespace_path}/${jsonFileName}.json`;
    // 模型文件地址
    let modelFilePath = `${TLM_PROJECT_INFO.models_path}/${TLM_PROJECT_INFO.model_id}.json`;

    // 模型改名
    Project.geometry_name = "model";
    Project.name = TLM_PROJECT_INFO.model_id;
    // 将导出路径修改为此路径
    // 这样后续 Ctrl + S 保存时候会自动覆盖
    ModelMeta.name = TLM_PROJECT_INFO.models_path;
    ModelMeta.export_path = modelFilePath;

    // 把模型添加到列表中
    addModelToList(modelData);

    // 各种文件的书写    
    if (!isEmpty(animationFilePath)) {
        let animationFileName = pathToName(animationFilePath).toLowerCase().replace(/\s|-/g, '_');
        fs.writeFileSync(`${TLM_PROJECT_INFO.animation_path}/${animationFileName}.js`, fs.readFileSync(animationFilePath))
    }
    fs.writeFileSync(jsonFile, autoStringify(TLM_PROJECT_INFO["pack_data"]));
    fs.writeFile(modelFilePath, Format.codec.compile(), function (err) {
    });

    // 语言文件
    for (let key of Object.keys(languageMap)) {
        addLanguageEntry(key, languageMap[key]);
    }
    saveLanguageFile();

    // 材质保存
    if (textures.length > 0) {
        // 实体模型是单材质，获取第一个即可
        let textureFile = textures[0];
        // 来自 Blockbench 的图片二进制文件获取，不太理解
        let image;
        if (textureFile.mode === 'link') {
            image = nativeImage.createFromPath(textureFile.source.replace(/\?\d+$/, '')).toPNG()
        } else {
            image = nativeImage.createFromDataURL(textureFile.source).toPNG()
        }
        // 存储地址构建
        let textureFilePath = `${TLM_PROJECT_INFO.textures_path}/${TLM_PROJECT_INFO.model_id}.png`;
        // 存储图片文件
        fs.writeFile(textureFilePath, image, function (err) {
        });
        // 设置图片的相关属性， 这样后续 Ctrl + S 保存时候会自动覆盖
        textureFile.name = `${TLM_PROJECT_INFO.model_id}.png`;
        textureFile.folder = TLM_PROJECT_INFO.textures_path;
        textureFile.path = textureFilePath;
        textureFile.saved = true;
    } else {
        // 图片不存在时警告
        Blockbench.notification("你当前没有创建材质！", "游戏内的该模型将没有材质！");
    }

    // 保存成功的提醒
    Blockbench.notification("模型导出成功！", "");
}

export var saveNewChairModelDialog = new Dialog({
    id: "save_new_chair_model_dialog",
    title: "请输入模型相关参数",
    form: {
        modelId: {
            label: "模型 ID（必填）",
            type: "input",
            placeholder: "仅支持小写英文字符和 . 和 _"
        },
        modelName: {
            label: "模型名称（必填）",
            type: "input",
            placeholder: "建议使用英文描述"
        },
        line1: "_",
        modelDesc: {
            label: "模型描述（可选）",
            type: "input",
            placeholder: "留空表示不填写任何描述"
        },
        renderItemScale: {
            label: "渲染成物品时的大小",
            type: "number",
            value: 1.0,
            min: 0.1,
            max: 2,
            step: 0.05
        },
        mountedHeight: {
            label: "坐上去的高度",
            type: "number",
            value: 6,
            min: 0,
            max: 40,
            step: 1
        },
        tameableCanRide: {
            label: "女仆能否能主动坐上去",
            type: "checkbox",
            value: true
        },
        noGravity: {
            label: "坐垫可以浮空",
            type: "checkbox",
            value: false
        },
        animation: {
            label: "动画脚本（可选）",
            type: "file",
            extensions: ['blockbench'],
            filetype: 'JS'
        },
    },
    onConfirm: function (formData) {
        // 数据获取
        let namespace = TLM_PROJECT_INFO["namespace"];

        // 模型数据
        let modelData = {};
        let languageMap = {};

        // 将 ID 中的大写字符全部变成小写字符
        // 空格和 - 字符转换为下划线
        let modelId = formData.modelId.toLowerCase().replace(/\s|-/g, '_');

        // 必填数据的格式判定
        // ID 字符校验
        if (!(/^[\w.]+$/.test(modelId))) {
            Blockbench.notification("模型 ID 不合法！", "模型 ID 仅支持英文字母，下划线和英文点号！");
            return;
        }

        // 存储 id 数据
        TLM_PROJECT_INFO["model_id"] = modelId;
        // 存入模型数据
        modelData["model_id"] = `${namespace}:${modelId}`;

        // 模型名不能为空
        if (isEmpty(formData.modelName)) {
            Blockbench.notification("模型名称不能为空", "请输入一个可辨识的英文模型名称！");
            return;
        } else {
            // 往语言文件里面书写名称
            languageMap[`model.${namespace}.${modelId}.name`] = formData.modelName;
            saveNewChairModelDialog.form.modelName.value = formData.modelName;
        }

        // 模型描述数据存储
        if (!isEmpty(formData.modelDesc)) {
            modelData["description"] = [`{model.${namespace}.${modelId}.desc}`];
            // 往语言文件里面书写描述
            languageMap[`model.${namespace}.${modelId}.desc`] = formData.modelDesc;
            saveNewChairModelDialog.form.modelDesc.value = formData.modelDesc;
        }

        // 其他数据书写
        if (formData.renderItemScale !== 1) {
            modelData["render_item_scale"] = formData.renderItemScale;
            saveNewChairModelDialog.form.renderItemScale.value = formData.renderItemScale;
        }

        modelData["mounted_height"] = formData.mountedHeight;
        saveNewChairModelDialog.form.mountedHeight.value = formData.mountedHeight;

        if (!formData.tameableCanRide) {
            modelData["tameable_can_ride"] = false;
            saveNewChairModelDialog.form.tameableCanRide.value = false;
        }
        if (formData.noGravity) {
            modelData["no_gravity"] = true;
            saveNewChairModelDialog.form.noGravity.value = true;
        }
        // 动画脚本数据书写
        if (!isEmpty(formData.animation)) {
            let animationFilePath = formData.animation;
            let animationFileName = pathToName(animationFilePath).toLowerCase().replace(/\s|-/g, '_');
            modelData["animation"] = [`${namespace}:animation/${animationFileName}.js`];
        }

        // 检查重复 ID
        if (checkDuplicateModelId()) {
            Blockbench.showMessageBox({
                title: "检查到当前 ID 和已有模型 ID 重复",
                message: "是否继续进行保存？<br>这会覆盖掉同名模型的相关数据！",
                confirm: 0,
                cancel: 1,
                buttons: ["确认覆盖", "取消"]
            }, function (result) {
                if (result === 0) {
                    saveModel(modelData, formData.animation, languageMap, "maid_chair");
                    saveNewChairModelDialog.hide();
                }
            })
        } else {
            saveModel(modelData, formData.animation, languageMap, "maid_chair");
            saveNewChairModelDialog.hide();
        }
    }
});