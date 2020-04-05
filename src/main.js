import { createNewPack } from "./pack/createpack";
import { exportPack } from "./pack/exportpack"
import { newWorkSpace } from "./model/workspace";
import { registerTextureEvent } from "./event/textureevent";
import { loadPack } from "./pack/loadpack"

Plugin.register('tlm-utils', {
    name: '车万女仆模组插件',
    author: 'tartaric_acid',
    description: '专门为车万女仆模组制作模型包所设计的插件。',
    icon: 'card_membership',
    version: '1.0.0',
    variant: 'both',
    onload() {
        Language.data["menu.tlm_bar_menu"] = "车万女仆";
        // 添加主菜单
        new BarMenu("tlm_bar_menu", [            
            'new_work_space',
            '_',
            'create_new_pack',
            'export_pack',
            'load_pack',
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
    }
});




