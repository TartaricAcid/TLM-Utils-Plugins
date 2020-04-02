import { isEmpty } from "../utils/string";
import { addLanguageEntry, saveLanguageFile } from "../utils/lang";
import { TLM_PROJECT_INFO } from "../projectinfo";
import { checkDuplicateModelId } from "../utils/checkdata";

export var saveNewModel = new Action('save_new_model', {
    name: '存储模型',
    description: '在当前资源包内存储模型',
    icon: 'save',
    click: function () {
        // 未绑定资源包的提醒
        if (isEmpty(TLM_PROJECT_INFO["namespace"])) {
            Blockbench.showMessageBox({
                title: "警告！",
                message: "你没有绑定资源包！<br>请在菜单栏中创建新的资源包，或者绑定已有资源包！",
                icon: "warning"
            }, function (result) { });
            return;
        }
        // 已经存储过的提醒
        if (checkDuplicateModelId()) {
            Blockbench.showQuickMessage("你已经存储过模型了！");
        } else {
            if (TLM_PROJECT_INFO.type == "chair") {
                saveNewChairModelDialog.show();
            } else {
                saveNewMaidModelDialog.show();
            }
        }
    }
});

export var saveAsNewModel = new Action('save_as_new_model', {
    name: "另存为模型",
    description: "将当前模型更改 id 后导出成另一个模型",
    icon: 'save',
    click: function () {
        // 未绑定资源包的提醒
        if (isEmpty(TLM_PROJECT_INFO["namespace"])) {
            Blockbench.showMessageBox({
                title: "警告！",
                message: "你没有绑定资源包。请在菜单栏中创建新的资源包，或者绑定已有资源包！",
                icon: "warning"
            }, function (result) { });
        } else {
            if (TLM_PROJECT_INFO.type == "chair") {
                saveNewChairModelDialog.show();
            } else {
                saveNewMaidModelDialog.show();
            }
        }
    }
})

var saveNewMaidModelDialog = new Dialog({
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
            label: "是否显示旗指物",
            type: "checkbox",
            value: true
        },
        showBackpack: {
            label: "是否显示背包",
            type: "checkbox",
            value: true
        },
        canHoldTrolley: {
            label: "是否能够持有拉杆箱",
            type: "checkbox",
            value: true
        },
        canHoldVehicle: {
            label: "是否能够持有载具",
            type: "checkbox",
            value: true
        },
        canRidingBroom: {
            label: "是否骑乘扫帚",
            type: "checkbox",
            value: true
        },
        showCustomHead: {
            label: "是否显示头颅",
            type: "checkbox",
            value: true
        },
        animation: {
            label: "动画脚本（可选）",
            type: "file",
            extensions: ['js'],
            filetype: 'JS'
        },
    },
    onConfirm: function (formData) {
        // 数据获取
        let namespace = TLM_PROJECT_INFO["namespace"];
        let namespacePath = TLM_PROJECT_INFO["namespace_path"];
        let modelPath = TLM_PROJECT_INFO["models_path"];
        let texturePath = TLM_PROJECT_INFO["textures_path"];
        let animationPath = TLM_PROJECT_INFO["animation_path"];

        // 模型数据
        let modelData = {};

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
            addLanguageEntry(`model.${namespace}.${modelId}.name`, formData.modelName);
            saveLanguageFile();
            saveNewMaidModelDialog.form.modelName.value = formData.modelName;
        }

        // 模型描述数据存储
        if (!isEmpty(formData.modelDesc)) {
            modelData["description"] = [`{model.${namespace}.${modelId}.desc}`];
            // 往语言文件里面书写描述
            addLanguageEntry(`model.${namespace}.${modelId}.desc`, formData.modelDesc);
            saveLanguageFile();
            saveNewMaidModelDialog.form.modelDesc.value = formData.modelDesc;
        }

        // 兼容性数据书写
        if (formData.renderItemScale != 1) {
            modelData["render_item_scale"] = formData.renderItemScale;
            saveNewMaidModelDialog.form.renderItemScale.value = formData.renderItemScale;
        }
        if (formData.renderEntityScale != 1) {
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
            fs.writeFileSync(`${animationPath}/${animationFileName}.js`, fs.readFileSync(animationFilePath))
            modelData["animation"] = [`${namespace}:animation/${animationFileName}.js`];
        }

        // 存储 json 文件
        let modelList = TLM_PROJECT_INFO["pack_data"]["model_list"];
        modelList.push(modelData);

        // 书写女仆模型包的文件
        let maidJsonFilePath = `${namespacePath}/maid_model.json`;
        fs.writeFileSync(maidJsonFilePath, autoStringify(TLM_PROJECT_INFO["pack_data"]));

        // 模型改名
        Project.geometry_name = "model";
        Project.name = modelId;

        // 模型保存
        let modelFilePath = `${modelPath}/${modelId}.json`;
        fs.writeFile(modelFilePath, Format.codec.compile(), function (err) {
            cl(err)
        })
        // 将导出路径修改为此路径
        // 这样后续 Ctrl + S 保存时候会自动覆盖
        ModelMeta.name = `${modelPath}`;
        ModelMeta.export_path = modelFilePath;

        // 材质保存
        if (textures.length > 0) {
            // 实体模型是单材质，获取第一个即可
            let textureFile = textures[0];
            // 来自 Blockbench 的图片二进制文件获取，不太理解
            if (textureFile.mode === 'link') {
                var image = nativeImage.createFromPath(textureFile.source.replace(/\?\d+$/, '')).toPNG()
            } else {
                var image = nativeImage.createFromDataURL(textureFile.source).toPNG()
            }
            // 存储地址构建
            let textureFilePath = `${texturePath}/${modelId}.png`;
            // 存储图片文件
            fs.writeFile(textureFilePath, image, function (err) {
                cl(err)
            })
            // 设置图片的相关属性， 这样后续 Ctrl + S 保存时候会自动覆盖
            textureFile.name = `${modelId}.png`;
            textureFile.folder = texturePath;
            textureFile.path = textureFilePath;
            textureFile.saved = true;
            // 隐藏对话框
            saveNewMaidModelDialog.hide();
        } else {
            // 图片不存在时警告
            Blockbench.showMessageBox({
                title: "警告：",
                message: "当前模型材质为空！",
                icon: "warning"
            }, function (result) { })
        }
    }
});

var saveNewChairModelDialog = new Dialog({
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
            label: "女仆是否能主动坐上去",
            type: "checkbox",
            value: true
        },
        noGravity: {
            label: "坐垫是否受重力影响",
            type: "checkbox",
            value: true
        },
        animation: {
            label: "动画脚本（可选）",
            type: "file",
            extensions: ['js'],
            filetype: 'JS'
        },
    },
    onConfirm: function (formData) {
        // 数据获取
        let namespace = TLM_PROJECT_INFO["namespace"];
        let namespacePath = TLM_PROJECT_INFO["namespace_path"];
        let modelPath = TLM_PROJECT_INFO["models_path"];
        let texturePath = TLM_PROJECT_INFO["textures_path"];
        let animationPath = TLM_PROJECT_INFO["animation_path"];

        // 模型数据
        let modelData = {};

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
            addLanguageEntry(`model.${namespace}.${modelId}.name`, formData.modelName);
            saveLanguageFile();
            saveNewChairModelDialog.form.modelName.value = formData.modelName;
        }

        // 模型描述数据存储
        if (!isEmpty(formData.modelDesc)) {
            modelData["description"] = [`{model.${namespace}.${modelId}.desc}`];
            // 往语言文件里面书写描述
            addLanguageEntry(`model.${namespace}.${modelId}.desc`, formData.modelDesc);
            saveLanguageFile();
            saveNewChairModelDialog.form.modelDesc.value = formData.modelDesc;
        }

        // 其他数据书写
        if (formData.renderItemScale != 1) {
            modelData["render_item_scale"] = formData.renderItemScale;
            saveNewChairModelDialog.form.renderItemScale.value = formData.renderItemScale;
        }

        modelData["mounted_height"] = formData.mountedHeight;
        saveNewChairModelDialog.form.mountedHeight.value = formData.mountedHeight;

        if (!formData.tameableCanRide) {
            modelData["tameable_can_ride"] = false;
            saveNewChairModelDialog.form.tameableCanRide.value = false;
        }
        if (!formData.noGravity) {
            modelData["no_gravity"] = false;
            saveNewChairModelDialog.form.noGravity.value = false;
        }
        // 动画脚本数据书写
        if (!isEmpty(formData.animation)) {
            let animationFilePath = formData.animation;
            let animationFileName = pathToName(animationFilePath).toLowerCase().replace(/\s|-/g, '_');
            fs.writeFileSync(`${animationPath}/${animationFileName}.js`, fs.readFileSync(animationFilePath))
            modelData["animation"] = [`${namespace}:animation/${animationFileName}.js`];
        }

        // 存储 json 文件
        let modelList = TLM_PROJECT_INFO["pack_data"]["model_list"];
        modelList.push(modelData);

        // 书写坐垫模型包的文件
        let chairJsonFilePath = `${namespacePath}/maid_chair.json`;
        fs.writeFileSync(chairJsonFilePath, autoStringify(TLM_PROJECT_INFO["pack_data"]));

        // 模型改名
        Project.geometry_name = "model";
        Project.name = modelId;

        // 模型保存
        let modelFilePath = `${modelPath}/${modelId}.json`;
        fs.writeFile(modelFilePath, Format.codec.compile(), function (err) {
            cl(err)
        })
        // 将导出路径修改为此路径
        // 这样后续 Ctrl + S 保存时候会自动覆盖
        ModelMeta.name = `${modelPath}`;
        ModelMeta.export_path = modelFilePath;

        // 材质保存
        if (textures.length > 0) {
            // 实体模型是单材质，获取第一个即可
            let textureFile = textures[0];
            // 来自 Blockbench 的图片二进制文件获取，不太理解
            if (textureFile.mode === 'link') {
                var image = nativeImage.createFromPath(textureFile.source.replace(/\?\d+$/, '')).toPNG()
            } else {
                var image = nativeImage.createFromDataURL(textureFile.source).toPNG()
            }
            // 存储地址构建
            let textureFilePath = `${texturePath}/${modelId}.png`;
            // 存储图片文件
            fs.writeFile(textureFilePath, image, function (err) {
                cl(err)
            })
            // 设置图片的相关属性， 这样后续 Ctrl + S 保存时候会自动覆盖
            textureFile.name = `${modelId}.png`;
            textureFile.folder = texturePath;
            textureFile.path = textureFilePath;
            textureFile.saved = true;
            // 隐藏对话框
            saveNewChairModelDialog.hide();
        } else {
            // 图片不存在时警告
            Blockbench.showMessageBox({
                title: "警告：",
                message: "当前模型材质为空！",
                icon: "warning"
            }, function (result) { })
        }
    }
});