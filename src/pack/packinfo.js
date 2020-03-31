import { TLM_PROJECT_INFO } from "../projectinfo"
import { isEmpty } from "../utils/string";

export var packInfoAction = new Action('tlm_pack_info', {
    name: "查看绑定的资源包信息",
    description: '查看绑定的资源包信息',
    icon: 'pageview',
    click: function () {
        if (isEmpty(TLM_PROJECT_INFO.namespace)) {
            Blockbench.showMessageBox({
                title: "提示：",
                message: "当前未绑定资源包！",
                icon: "warning"
            }, function (result) { })
        } else {
            Blockbench.showMessageBox({
                title: "当前绑定资源包信息：",
                message: `命名空间为：${TLM_PROJECT_INFO.namespace}`,
                icon: "info"
            }, function (result) { })
        }
    }
});