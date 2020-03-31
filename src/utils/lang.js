import { TLM_PROJECT_INFO } from "../projectinfo";

var english = {};

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