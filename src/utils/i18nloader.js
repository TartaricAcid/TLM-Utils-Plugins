import TLM_EN from "../../assets/lang/en_us.json";
import TLM_DE from "../../assets/lang/de_de.json";
import TLM_ES from "../../assets/lang/es_es.json";
import TLM_FR from "../../assets/lang/fr_fr.json";
import TLM_IT from "../../assets/lang/it_it.json";
import TLM_JA from "../../assets/lang/ja_jp.json";
import TLM_KO from "../../assets/lang/ko_kr.json";
import TLM_PT_BR from "../../assets/lang/pt_br.json";
import TLM_RU from "../../assets/lang/ru_ru.json";
import TLM_ZH from "../../assets/lang/zh_cn.json";

Language.addTranslations("en", TLM_EN);
Language.addTranslations("de", TLM_DE);
Language.addTranslations("es", TLM_ES);
Language.addTranslations("es", TLM_ES);
Language.addTranslations("fr", TLM_FR);
Language.addTranslations("it", TLM_IT);
Language.addTranslations("ja", TLM_JA);
Language.addTranslations("ko", TLM_KO);
Language.addTranslations("pt", TLM_PT_BR);
Language.addTranslations("ru", TLM_RU);
Language.addTranslations("zh", TLM_ZH);

export var loadTLMLanguage = function () {
    // TODO: Print the list of acknowledgments for translators
    console.log("Language file loaded!");
};