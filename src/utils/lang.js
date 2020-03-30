var english = {};

export function addLanguageEntry(key, value) {
    english[key] = value;
}

export function saveLanguageFile(path) {
    let output = "";
    for (let k in english) {
        output = output + `${k}=${english[k]}\n`;
    }
    fs.writeFileSync(`${path}/en_us.lang`, output);
}