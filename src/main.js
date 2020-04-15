import {createNewPack} from "./pack/createpack";
import {exportPack} from "./pack/exportpack"
import {newWorkSpace} from "./model/workspace";
import {registerTextureEvent} from "./event/textureevent";
import {loadPack} from "./pack/loadpack";
import {createDefaultMaidModel} from "./tool/defaultmodel";
import {addSkirtMenu} from "./tool/genskirt";


(function () {
    Plugin.register('tlm-utils', {
        title: '车万女仆模组插件',
        author: '酒石酸菌',
        description: '专门为车万女仆模组制作模型包所设计的插件。',
        about: `<hr>
        <p>感谢你使用 Blockbench 车万女仆模组插件 1.0.0 版本，此插件专为车万女仆模组制作资源包所设计，欢迎您反馈使用过程中的意见和建议。</p>
        <p>期望大家能够在创作自己喜爱的事物中，收获到更多的快乐。</p>
        <p>下附一首我很喜欢的一首名为《金木犀》的曲子：</p>
        <br>
        <p align="center">
        <iframe 
        frameborder="no" border="0" marginwidth="0" 
        marginheight="0" width=350 height=133 
        src="https://music.163.com/outchain/player?type=2&id=41554447&auto=0&height=133">
        </iframe>
        <p>
        <br>`,
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
                        'create_default_maid_model',
                    ]
                }
            ]);
            MenuBar.update();
            registerTextureEvent();
            Group.prototype.menu.structure.push('_');
            Group.prototype.menu.structure.push(addSkirtMenu);
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

            let structure = Group.prototype.menu.structure;
            for (let i = 0; i < structure.length; i++) {
                if (structure[i] && structure[i]["is_tlm_add_menu"]) {
                    delete structure[i];
                }
            }
        }
    });
})();




