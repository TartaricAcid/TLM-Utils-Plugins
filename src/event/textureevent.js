import { TLM_PROJECT_INFO } from "../projectinfo";
import { isEmpty } from "../utils/string"

export function registerTextureEvent() {
    Blockbench.on("add_texture", function (data) {
        // 如果 modelId 为空，不进行修改
        let modelId = TLM_PROJECT_INFO.model_id
        let texturePath = TLM_PROJECT_INFO.textures_path;
        let textureName = TLM_PROJECT_INFO.texture_name;
        if (!isEmpty(modelId) && !isEmpty(texturePath) && !isEmpty(textureName)) {
            // 如果不为空，进行二次判定
            let textureFile = data.texture;
            // 设置图片的相关属性， 这样后续 Ctrl + S 保存时候会自动覆盖
            textureFile.name = textureName;
            textureFile.folder = texturePath;
            textureFile.path = `${texturePath}/${textureName}`;
            Blockbench.notification("自动材质定位：", "检测到你已经绑定了资源包，并设置了模型数据。自动定位创建的材质！");
        }
    });
}