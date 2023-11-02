import {isEmpty} from "./string";

export function getPackLanguage(langPath, local) {
    if (!local) {
        local = tl("local.tlm_utils.name");
    }
    let output = {};
    let englishFile = `${langPath}/en_us.lang`;
    readLanguageFile(englishFile, output);
    if (local !== "en_us") {
        let localFile = `${langPath}/${local}.lang`;
        readLanguageFile(localFile, output);
    }
    return output;
}

export function writeLanguageFile(local, langPath, langMap) {
    let langFile = `${langPath}/${local}.lang`;
    let output = "";
    for (let k of Object.keys(langMap)) {
        output = output + `${k}=${langMap[k]}\n`;
    }
    fs.writeFileSync(langFile, output);
}

export function getTranslationKey(keyRaw) {
    if (keyRaw.indexOf("{") === 0 && keyRaw.indexOf("}") === (keyRaw.length - 1)) {
        return keyRaw.replace(/^{/, "").replace(/}$/, "");
    } else {
        return keyRaw;
    }
}

export function getTranslationResult(keyRaw, langMap) {
    if (keyRaw.indexOf("{") === 0 && keyRaw.indexOf("}") === (keyRaw.length - 1)) {
        let key = keyRaw.replace(/^{/, "").replace(/}$/, "");
        if (!langMap || isEmpty(langMap[key])) {
            return keyRaw;
        }
        return langMap[key];
    } else {
        return keyRaw;
    }
}

export function readLanguageFile(langFile, langMap) {
    if (fs.existsSync(langFile) && fs.statSync(langFile).isFile()) {
        let allText = fs.readFileSync(langFile, "utf8");
        if (allText.charCodeAt(0) === 0xFEFF) {
            allText = allText.substr(1);
        }
        allText.split(/\r?\n/).forEach(function (line) {
            if (line.indexOf("#") !== 0) {
                let text = line.split("=", 2);
                if (!isEmpty(text[0]) && !isEmpty(text[1])) {
                    langMap[text[0]] = text[1];
                }
            }
        });
    }
}