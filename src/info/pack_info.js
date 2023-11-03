export var TlmPackInfo = class {
    constructor() {
        // Only two options: maid, chair
        this.type = "maid";

        this.namespace = "";
        this.version = [];
        this.data = {};
        this.lang = {};
        this.local = {};

        this.namespacePath = "";
        this.texturesPath = "";
        this.animationPath = "";
        this.soundsPath = "";
        this.langPath = "";
        this.modelsPath = "";
    }
};

export var splitStringVersion = function (strVersion) {
    let re = /^(\d+)\.(\d+)\.(\d+)$/;
    let result = re.exec(strVersion);
    if (result.length >= 4) {
        return [result[1], result[2], result[3]];
    } else {
        return [1, 0, 0];
    }
};