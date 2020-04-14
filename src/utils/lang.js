import {TLM_PROJECT_INFO} from "../projectinfo";
import {isEmpty} from "./string"

let english = {};

export function addLanguageEntry(key, value) {
    english[key] = value;
}

export function saveLanguageFile() {
    let output = "";
    for (let k in english) {
        output = output + `${k}=${english[k]}\n`;
    }
    fs.writeFileSync(`${TLM_PROJECT_INFO["lang_path"]}/en_us.lang`, output);
}

export function reloadAndReadLanguage() {
    let englishFile = `${TLM_PROJECT_INFO["lang_path"]}/en_us.lang`;
    english = {};
    if (fs.existsSync(englishFile) && fs.statSync(englishFile).isFile()) {
        let allText = fs.readFileSync(englishFile, 'utf8');
        allText.split(/\r?\n/).forEach(function (line) {
            // 排除 # 开头的注释
            if (line.indexOf("#") !== 0) {
                let text = line.split("=", 2);
                if (!isEmpty(text[0]) && !isEmpty(text[1])) {
                    english[text[0]] = text[1];
                }
            }
        });
    }
}