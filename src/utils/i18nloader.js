import TLM_EN from "../../assets/lang/en.json";
import TLM_ZH from "../../assets/lang/zh.json";

Language.addTranslations("en", TLM_EN);
Language.addTranslations("zh", TLM_ZH);

export var loadTLMLanguage = function () {
    // TODO: Print the list of acknowledgments for translators
    console.log("Language file loaded!");
};
