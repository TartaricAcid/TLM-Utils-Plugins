import { TLM_PROJECT_INFO } from "../projectinfo"
import { isEmpty } from "./string"

/**
 * 检查当前模型 id 是否和已经存储的模型有同名冲突？
 * 如果确实冲突，返回 true
 */
export function checkDuplicateModelId() {
    let namespace = TLM_PROJECT_INFO["namespace"];
    let modelId = TLM_PROJECT_INFO["model_id"];
    let modelList = TLM_PROJECT_INFO["pack_data"]["model_list"];
    if (isEmpty(modelId)) {
        return false;
    }
    if (modelList == undefined || modelList == null || modelList.length == 0) {
        return false;
    }
    for (let i in modelList) {
        if (modelList[i]["model_id"] == `${namespace}:${modelId}`) {
            return true;
        }
    }
    return false;
}

export function addModelToList(modelData){
    let namespace = TLM_PROJECT_INFO["namespace"];
    let modelId = TLM_PROJECT_INFO["model_id"];
    let modelList = TLM_PROJECT_INFO["pack_data"]["model_list"];
    if (isEmpty(modelId)) {
        return;
    }
    if (modelList == undefined || modelList == null || modelList.length == 0) {
        TLM_PROJECT_INFO.pack_data.model_list = [modelData];
        return;
    }
    for (let i in modelList) {
        if (modelList[i]["model_id"] == `${namespace}:${modelId}`) {
            modelList[i] = modelData;
            return;
        }
    }
    modelList.push(modelData);
}