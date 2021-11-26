export var TlmPackInfo = class TlmPackInfo {
    constructor() {
        this.type = "maid" // Only two options: maid, chair

        this.namespace = ""
        this.version = []
        this.data = {}
        this.lang = {}

        this.namespace_path = ""
        this.textures_path = ""
        this.animation_path = ""
        this.lang_path = ""
        this.models_path = ""
    }
}

export var splitStringVersion = function (strVersion) {
    let re = /^(\d+)\.(\d+)\.(\d+)$/
    let result = re.exec(strVersion)
    if (result.length >= 4) {
        return [result[1], result[2], result[3]]
    } else {
        return [1, 0, 0]
    }
}