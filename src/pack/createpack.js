import {mkdirs} from "../utils/filesystem";
import {isEmpty} from "../utils/string";
import {TLM_PROJECT_INFO} from "../projectinfo";

export var createNewPack = new Action('create_new_pack', {
    name: '创建资源包',
    description: '创建一个新的资源包文件夹',
    icon: 'create',
    click: function () {
        createNewPackDialog.show();
    }
});

var createNewPackDialog = new Dialog({
    id: "create_new_pack",
    title: "请输入资源包相关参数",
    form: {
        packId: {
            label: "资源包 ID（必填）",
            type: "input",
            placeholder: "书写的字符和长度有一定要求"
        },
        line1: "_",
        packVersion: {
            label: "资源包版本（可选）",
            type: "input",
            placeholder: "格式推荐 1.0.0"
        },
        packIcon: {
            label: "资源包图标（可选）",
            type: "file",
            extensions: ['png'],
            filetype: 'PNG'
        }
    },
    onConfirm: function (formData) {
        // 将 ID 中的大写字符全部变成小写字符
        // 空格和 - 字符转换为下划线
        let packId = formData.packId.toLowerCase().replace(/\s|-/g, '_');

        // 必填数据的格式判定
        // ID 字符校验
        if (!(/^[\w.]+$/.test(packId))) {
            Blockbench.notification("资源包 ID 不合法！", "资源包 ID 仅支持英文字母，下划线和英文点号！");
            return;
        }
        // ID 长度校验
        if (packId.length < 6) {
            Blockbench.notification('资源包 ID 过短！', "为避免冲突，资源包 ID 至少应为 6 个字符！");
            return;
        }

        // 数据存储
        TLM_PROJECT_INFO["namespace"] = packId;

        // 包版本信息，如果没有，默认安置一个 1.0.0
        let packVersion;
        if (isEmpty(formData.packVersion)) {
            packVersion = "1.0.0";
        } else {
            // TODO: 不按要求书写的提醒？纠正？
            packVersion = formData.packVersion;
        }
        // 数据存储
        TLM_PROJECT_INFO["version"] = packVersion;

        // 选择放置资源包文件夹的窗口
        ElecDialogs.showOpenDialog(currentwindow, {
            properties: ['openDirectory']
        }, function (path) {
            // 取消选择时，path 为空
            if (path === undefined || path === null) {
                return;
            }

            // 创建资源包根目录
            let root = `${path}/${packId}-${packVersion}`;
            mkdirs(root);

            // 创建命名空间文件夹            
            let namespace = `${root}/assets/${packId}`;
            mkdirs(namespace);
            // 存储数据
            TLM_PROJECT_INFO["namespace_path"] = namespace;

            // 自定义动画脚本文件夹
            mkdirs(`${namespace}/animation`);
            TLM_PROJECT_INFO["animation_path"] = `${namespace}/animation`;

            // 语言文件夹
            mkdirs(`${namespace}/lang`);
            TLM_PROJECT_INFO["lang_path"] = `${namespace}/lang`;

            // 模型文件夹
            let packModels = `${namespace}/models/entity`;
            mkdirs(packModels);
            // 存储数据
            TLM_PROJECT_INFO["models_path"] = packModels;

            // 材质文件夹
            let packTextures = `${namespace}/textures/entity`;
            mkdirs(packTextures);
            TLM_PROJECT_INFO["textures_path"] = packTextures;

            // 创建 pack.mcmeta 文件
            let DEFAULT_TLM_PACK_DESC = '{"pack":{"pack_format":3,"description":"Touhou Little Maid Resources Pack"}}';
            fs.writeFileSync(`${root}/pack.mcmeta`, DEFAULT_TLM_PACK_DESC);

            // 如果图标不为空，复制图标
            if (!isEmpty(formData.packIcon)) {
                fs.writeFileSync(`${root}/pack.png`, fs.readFileSync(formData.packIcon))
            }

            createNewPackDialog.hide();
            Blockbench.notification("资源包创建成功！", `已经在 ${path} 放置对应资源包`);
        });
    }
});