import { mkdirs } from "../utils/filesystem";
import { saveNewModelDialog, setPath } from "./savemodel";

var exportTypeDialog = new Dialog({
    id: "export_type",
    title: "选择你想导出的方式",
    form: {
        selectType: {
            label: "导出方式",
            type: "select",
            options: {
                create: '创建新的资源包',
                add: '加入已有资源包'
            },
            default: 'create'
        }
    },
    onConfirm: function (formData) {
        this.hide();
        if (formData.selectType === 'create') {
            createNewPackDialog.show();
        }
    }
});

var createNewPackDialog = new Dialog({
    id: "create_new_pack",
    title: "请输入资源包相关参数",
    form: {
        packId: {
            label: "资源包 ID（必填）",
            type: "input",
            placeholder: "仅支持小写英文字符和 . 和 _"
        },
        packName: {
            label: "资源包名称（必填）",
            type: "input",
            placeholder: "建议使用英文描述"
        },
        author: {
            label: "作者（可选）",
            type: "input",
            placeholder: "用逗号分隔多个作者"
        },
        packDescription: {
            label: "资源包描述（可选）",
            type: "input",
            placeholder: "留空表示不填写任何描述"
        },
        packVersion: {
            label: "资源包版本（可选）",
            type: "input",
            placeholder: "格式推荐 1.0.0"
        },
        packDate: {
            label: "创建日期（可选）",
            type: "input",
            placeholder: "格式推荐 2020-3-28"
        },
        packIcon: {
            label: "资源包图标（可选）",
            type: "file",
            extensions: ['png'],
            filetype: 'PNG'
        }
    },
    onConfirm: function (formData) {
        ElecDialogs.showOpenDialog(currentwindow, {
            properties: ['openDirectory'],
            defaultPath: formData.value
        }, function (filePaths) {
            let root = filePaths + "/" + formData.packId + "-" + formData.packVersion;
            let namespace = root + "/" + "assets" + "/" + formData.packId;
            let animation = namespace + "/" + "animation";
            let lang = namespace + "/" + "lang";
            let models = namespace + "/" + "models/entity";
            let textures = namespace + "/" + "textures/entity";
            mkdirs(root);
            mkdirs(namespace);
            mkdirs(animation);
            mkdirs(lang);
            mkdirs(models);
            mkdirs(textures);

            fs.writeFile(root + "/pack.mcmeta", `{"pack":{"pack_format":3,"description":"${formData.packName}"}}`,
                function (err) { });

            maidModelJson.pack_name = formData.packName;
            maidModelJson.author[0] = formData.author;
            maidModelJson.description[0] = formData.packDescription;
            maidModelJson.version = formData.packVersion;
            maidModelJson.date = formData.packDate;
            maidModelJson.icon = formData.packIcon;
            fs.writeFile(`${namespace}/maid_model.json`, JSON.stringify(maidModelJson, null, 4),
                function (err) { });

            createNewPackDialog.hide();
            setPath(models, textures);
            saveNewModelDialog.show();
        })
    }
});

var maidModelJson = {
    pack_name: "Default Name",
    author: [],
    description: [],
    version: null,
    date: null,
    icon: null,
    model_list: []
}

export var exportModelButton = new Action('export_tlm_model', {
    name: '导出 TLM 模型',
    description: '将车万女仆模组模组导出成资源包，或者加入已有资源包。',
    icon: 'fa-bomb',
    click: function () {
        exportTypeDialog.show();
    }
});