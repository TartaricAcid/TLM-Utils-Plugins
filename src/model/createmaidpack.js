import { isEmpty, trim } from "../utils/string";
import { dateFormat } from "../utils/date";
import { addLanguageEntry, saveLanguageFile } from "../utils/lang";

var MAID_PACK_DATA = {};

/**
 * 绑定的资源包信息
 */
export var BIND_PACK_INFO = {
    namespace: "",
    texturesPath: "",
    modelPath: ""
};

var namespace;
var packId;
var packVersion;

/**
* 设置女仆模型包相关数据
* @param {String} namespaceIn 命名空间地址
* @param {String} packIdIn 模型包的命名空间
* @param {String} packVersionIn 模型包的版本
*/
export function setMaidPackData(namespaceIn, packIdIn, packVersionIn) {
    namespace = namespaceIn;
    packId = packIdIn;
    packVersion = packVersionIn;
}

export var createMaidPackDialog = new Dialog({
    id: "create_maid_pack",
    title: "创建一个新的女仆模型包",
    form: {
        packName: {
            label: "女仆模型包名称（必填）",
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
            label: "女仆模型包描述（可选）",
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
        // 剔除包名首尾空格
        let packName = trim(formData.packName);

        // 包名不能为空
        if (isEmpty(packName)) {
            Blockbench.notification("资源包名称不能为空", "请输入一个可辨识的英文资源包名称！");
            return;
        } else {
            MAID_PACK_DATA["pack_name"] = `{maid_pack.${packId}.name}`;
            // 往语言文件里面书写名称
            addLanguageEntry(`maid_pack.${packId}.name`, packName);
            saveLanguageFile(`${namespace}/lang`);
        }

        // 作者数据
        if (!isEmpty(formData.author)) {
            // 依据逗号分隔作者名称
            let authorList = formData.author.split(/[,|，]/);
            for (let i = 0; i < authorList.length; i++) {
                authorList[i] = trim(authorList[i]);
            }
            MAID_PACK_DATA["author"] = authorList;
        }

        // 包描述
        if (!isEmpty(formData.packDescription)) {
            MAID_PACK_DATA["description"] = [`{maid_pack.${packId}.desc}`];
            // 往语言文件里面书写描述
            addLanguageEntry(`maid_pack.${packId}.desc`, formData.packDescription);
            saveLanguageFile(`${namespace}/lang`);
        }

        // 包的制作日期
        let packDate;
        if (isEmpty(formData.packDate)) {
            // 依据当前日期格式化一个
            packDate = dateFormat(new Date());
        } else {
            packDate = formData.packDate;
        }
        MAID_PACK_DATA["date"] = packDate;

        // 包的图标
        if (!isEmpty(formData.packIcon)) {
            MAID_PACK_DATA["icon"] = `${packId}:textures/maid_icon.png`;
            let packIconPath = `${namespace}/textures/maid_icon.png`;
            fs.writeFileSync(packIconPath, fs.readFileSync(formData.packIcon));
        }

        // 包的版本
        MAID_PACK_DATA["version"] = packVersion;

        // 模型列表
        MAID_PACK_DATA["model_list"] = [];

        // 书写女仆模型包的文件
        let maidJsonFilePath = `${namespace}/maid_model.json`;
        fs.writeFileSync(maidJsonFilePath, autoStringify(MAID_PACK_DATA));

        // 记录相关数据
        BIND_PACK_INFO.namespace = packId;
        BIND_PACK_INFO.modelPath = `${namespace}/models/entity`;
        BIND_PACK_INFO.texturesPath = `${namespace}/textures/entity`;

        // 状态栏显示        
        Blockbench.notification('已绑定资源包：', `${packId}`);

        // 关闭当前窗口
        createMaidPackDialog.hide();
    }
});