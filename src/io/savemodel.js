var modelPath;
var texturePath;

export var saveNewModelDialog = new Dialog({
    id: "save_new_model",
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
        Project.geometry_name = "model";
        Project.name = formData.modelId;

        let tex = textures[0];
        if (tex.mode === 'link') {
            var image = nativeImage.createFromPath(tex.source.replace(/\?\d+$/, '')).toPNG()
        } else {
            var image = nativeImage.createFromDataURL(tex.source).toPNG()
        }
        fs.writeFile(`${texturePath}/${formData.modelId}.png`, image, function (err) {
            cl(err)
        })

        fs.writeFile(`${modelPath}/${formData.modelId}.json`, Format.codec.compile(), function (err) {
            cl(err)
        })
    }
})

export function setPath(model, texture) {
    modelPath = model;
    texturePath = texture;
}