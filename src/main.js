import { createNewPack } from "./pack/createpack";
import { exportPack } from "./pack/exportpack"
import { newWorkSpace } from "./model/workspace";
import { registerTextureEvent } from "./event/textureevent";
import { loadPack } from "./pack/loadpack";
import { createDefaultMaidModel } from "./tool/defaultmodel";

(function () {
    Plugin.register('tlm-utils', {
        title: '车万女仆模组插件',
        author: '酒石酸菌',
        description: '专门为车万女仆模组制作模型包所设计的插件。',
        // about: `<p align="center"><iframe src="https://player.bilibili.com/player.html?aid=98652305&bvid=BV1h7411m7vh&cid=168399462&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width="500" height="400"></iframe><p>`,
        icon: 'card_membership',
        version: '1.0.0',
        variant: 'desktop',
        onload() {
            Language.data["menu.tlm_bar_menu"] = "车万女仆";
            // 添加主菜单
            new BarMenu("tlm_bar_menu", [
                'new_work_space',
                '_',
                'create_new_pack',
                'export_pack',
                'load_pack',
                '_',
                {
                    name: '工具',
                    id: 'tlm_tool',
                    icon: 'fa-tools',
                    children: [
                        'create_default_maid_model'
                    ]
                }
            ]);
            MenuBar.update();
            registerTextureEvent();
        },
        onunload() {
            // 删除主菜单按钮
            delete MenuBar.menues["tlm_bar_menu"];
            MenuBar.update();

            // 删除子菜单按钮
            createNewPack.delete();
            exportPack.delete();
            newWorkSpace.delete();
            loadPack.delete();
            createDefaultMaidModel.delete();
        }
    });
})();




