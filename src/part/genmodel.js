import {addSkirtMenu} from "./genskirt";

export var addPartMenu = {
    is_tlm_add_menu: true,
    icon: 'fa-cheese',
    name: '生成预设模型',
    description: "生成一些规则的几何图形，方便制作一些特殊部件",
    condition: {modes: ['edit'], method: () => (Format.id === "bedrock_old")},
    children: [
        addSkirtMenu
    ]
};