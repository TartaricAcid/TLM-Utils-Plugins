import {loadTLMLanguage} from "./utils/i18nloader";
import TLM from "../package.json";
import {createDefaultAction} from "./init/create_default";
import {createNewPackAction} from "./pack/create_pack";
import {CACHE_TLM_PACK_ACTION, initCacheTlmPackAction, loadPackAction} from "./load/load_pack";
import {initPresentAnimations} from "./animation/manger";

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
            new BarMenu("tlm_utils", [
                "tlm_utils.create_new_model",
                "_",
                "tlm_utils.create_new_pack",
                "tlm_utils.load_pack",
                CACHE_TLM_PACK_ACTION
            ]);
            MenuBar.update();
        },
        onunload() {
            delete MenuBar.menues["tlm_utils"];
            MenuBar.update();
            createDefaultAction.delete();
            createNewPackAction.delete();
            loadPackAction.delete();
        }
    });
})();