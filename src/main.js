import {loadTLMLanguage} from "./utils/i18nloader";
import TLM from "../package.json";
import {createDefaultAction} from "./init/create_default";
import {createNewPackAction} from "./pack/create_pack";
import {CACHE_TLM_PACK_ACTION, initCacheTlmPackAction, loadPackAction} from "./load/load_pack";
import {initPresentAnimations} from "./animation/manger";
import {registerTextureEvent, removeTextureEvent} from "./event/texture_save";
import {addChairMenu, addMaidMenu} from "./part/present_groups";
import {addPresent} from "./part/add_present";

(function () {
    Plugin.register(TLM.name, {
        title: tl("info.tlm_utils.title"),
        author: TLM.author,
        description: tl("info.tlm_utils.description"),
        icon: "card_membership",
        version: TLM.version,
        variant: "desktop",
        min_version: "4.0.0",
        onload() {
            loadTLMLanguage();
            initPresentAnimations();
            initCacheTlmPackAction();
            registerTextureEvent();
            new BarMenu("tlm_utils", [
                "tlm_utils.create_new_model",
                "tlm_utils.create_new_pack",
                "_",
                "tlm_utils.load_pack",
                CACHE_TLM_PACK_ACTION
            ]);
            MenuBar.update();

            Group.prototype.menu.structure.push("_");
            Group.prototype.menu.structure.push(addPresent);
            Group.prototype.menu.structure.push(addMaidMenu);
            Group.prototype.menu.structure.push(addChairMenu);
            Interface.Panels.outliner.menu.structure.push("_");
            Interface.Panels.outliner.menu.structure.push(addPresent);
            Interface.Panels.outliner.menu.structure.push(addMaidMenu);
            Interface.Panels.outliner.menu.structure.push(addChairMenu);
        },
        onunload() {
            removeTextureEvent();
            delete MenuBar.menues["tlm_utils"];
            MenuBar.update();
            createDefaultAction.delete();
            createNewPackAction.delete();
            loadPackAction.delete();

            deleteMenu(Group.prototype.menu.structure);
            deleteMenu(Interface.Panels.outliner.menu.structure);
        }
    });
})();