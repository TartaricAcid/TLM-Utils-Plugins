import { isEmpty, trim } from "../utils/string";
import { dateFormat } from "../utils/date";
import { addLanguageEntry, saveLanguageFile } from "../utils/lang";
import { TLM_PROJECT_INFO } from "../projectinfo";

export var createChairPackDialog = new Dialog({
    id: "create_chair_pack",
    title: "创建一个新的坐垫模型包",
    form: {
        packName: {
            label: "坐垫模型包名称（必填）",
            type: "input",
            placeholder: "建议使用英文描述"
        },
        line1: "_",
        author: {
            label: "作者（可选）",
            type: "input",
            placeholder: "用逗号分隔多个作者"
        },
        packDescription: {
            label: "坐垫模型包描述（可选）",
            type: "input",
            placeholder: "留空表示不填写任何描述"
        },
        packDate: {
            label: "创建日期（可选）",
            type: "input",
            placeholder: "格式推荐 2020-3-28"
        },
        packIcon: {
            label: "游戏内标签图标（可选）",
            type: "file",
            extensions: ['png'],
            filetype: 'PNG'
        }
    },
    onConfirm: function (formData) {
        // 获取数据
        let namespace = TLM_PROJECT_INFO["namespace"];
        let namespacePath = TLM_PROJECT_INFO["namespace_path"];
        let langPath = TLM_PROJECT_INFO["lang_path"];
        let packVersion = TLM_PROJECT_INFO["version"];
        let packData = TLM_PROJECT_INFO["pack_data"];

        // 剔除包名首尾空格
        let packName = trim(formData.packName);

        // 包名不能为空
        if (isEmpty(packName)) {
            Blockbench.notification("资源包名称不能为空", "请输入一个可辨识的英文资源包名称！");
            return;
        } else {
            packData["pack_name"] = `{chair_pack.${namespace}.name}`;
            // 往语言文件里面书写名称
            addLanguageEntry(`chair_pack.${namespace}.name`, packName);
            saveLanguageFile(langPath);
        }

        // 作者数据
        if (!isEmpty(formData.author)) {
            // 依据逗号分隔作者名称
            let authorList = formData.author.split(/[,|，]/);
            for (let i = 0; i < authorList.length; i++) {
                authorList[i] = trim(authorList[i]);
            }
            packData["author"] = authorList;
        }

        // 包描述
        if (!isEmpty(formData.packDescription)) {
            packData["description"] = [`{chair_pack.${namespace}.desc}`];
            // 往语言文件里面书写描述
            addLanguageEntry(`chair_pack.${namespace}.desc`, formData.packDescription);
            saveLanguageFile(langPath);
        }

        // 包的制作日期
        let packDate;
        if (isEmpty(formData.packDate)) {
            // 依据当前日期格式化一个
            packDate = dateFormat(new Date());
        } else {
            packDate = formData.packDate;
        }
        packData["date"] = packDate;

        // 包的图标
        if (!isEmpty(formData.packIcon)) {
            packData["icon"] = `${namespace}:textures/chair_icon.png`;
            let packIconPath = `${namespacePath}/textures/chair_icon.png`;
            fs.writeFileSync(packIconPath, fs.readFileSync(formData.packIcon));
        }

        // 包的版本
        packData["version"] = packVersion;

        // 模型列表
        packData["model_list"] = [];

        // 书写坐垫模型包的文件
        let maidJsonFilePath = `${namespacePath}/maid_chair.json`;
        fs.writeFileSync(maidJsonFilePath, autoStringify(packData));

        // 状态栏显示        
        Blockbench.notification('已绑定资源包：', `${namespace}`);

        // 关闭当前窗口
        createChairPackDialog.hide();
    }
});