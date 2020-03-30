import { BIND_PACK_INFO } from "../model/createmaidpack";

var modelPath;
var texturePath;

export var saveNewModel = new Action('save_new_model', {
    name: '导出模型',
    description: '导出当前模型到资源包',
    icon: 'save',
    click: function () {
        setPath(BIND_PACK_INFO.modelPath, BIND_PACK_INFO.texturesPath);
        saveNewModelDialog.show();
    }
});

var saveNewModelDialog = new Dialog({
    id: "save_new_model_dialog",
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
        packDescription: {
            label: "模型描述（可选）",
            type: "input",
            placeholder: "留空表示不填写任何描述"
        },
        packIcon: {
            label: "动画脚本（可选）",
            type: "file",
            extensions: ['js'],
            filetype: 'JS'
        }
    },
    onConfirm: function (formData) {
        // TODO 相关数据校验

        // 模型改名
        Project.geometry_name = "model";
        Project.name = formData.modelId;

        // 模型保存
        let modelFilePath = `${modelPath}/${formData.modelId}.json`;
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
            let textureFilePath = `${texturePath}/${formData.modelId}.png`;
            // 存储图片文件
            fs.writeFile(textureFilePath, image, function (err) {
                cl(err)
            })
            // 设置图片的相关属性， 这样后续 Ctrl + S 保存时候会自动覆盖
            textureFile.name = `${formData.modelId}.png`;
            textureFile.folder = texturePath;
            textureFile.path = textureFilePath;
            // 隐藏对话框
            saveNewModelDialog.hide();
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

function setPath(model, texture) {
    modelPath = model;
    texturePath = texture;
}