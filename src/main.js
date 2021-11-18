import TLM from "../package.json";
import TLM_EN from "../assets/lang/en.json";
import TLM_ZH from "../assets/lang/zh.json";
import {createDefaultAction} from "./init/create_default";
import {createNewPack} from "./pack/create_pack";

(function () {
    const OUTPUT_INFO = {}
    Language.addTranslations("en", TLM_EN)
    Language.addTranslations("zh", TLM_ZH)
    Plugin.register(TLM.name, {
        title: tl("info.tlm_utils.title"),
        author: TLM.author,
        description: tl("info.tlm_utils.description"),
        icon: "card_membership",
        version: TLM.version,
        variant: "desktop",
        min_version: "4.0.0",
        onload() {
            new BarMenu("tlm_utils", [
                "tlm_utils.create_new_model",
                "_",
                "tlm_utils.create_new_pack"
            ]);
            MenuBar.update();
        },
        onunload() {
            delete MenuBar.menues["tlm_utils"];
            MenuBar.update();
            createDefaultAction.delete();
            createNewPack.delete();
        }
    });
})();