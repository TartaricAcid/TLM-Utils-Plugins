export var addBoneMenu = {
    is_tlm_add_menu: true,
    icon: 'fa-chart-pie',
    name: '生成特殊骨骼',
    condition: {modes: ['edit']},
    children: function () {
        let out = [];
        for (let o of boneNameList) {
            out.push({
                icon: o.icon,
                name: o.name,
                condition: {modes: ['edit']},
                click: function (group) {
                    let allGroups = Group.all.slice();
                    // 检查重名
                    for (let g of allGroups) {
                        if (g.name === o.bone) {
                            Blockbench.notification("重名骨骼", "发现当前名称骨骼已经存在，创建失败");
                            return;
                        }
                    }
                    // 生成骨骼
                    let baseGroup = new Group({
                        name: o.bone,
                        origin: group ? group.origin : undefined
                    });
                    baseGroup.addTo(group);
                    // 不明白的参数
                    baseGroup.isOpen = true;
                    baseGroup.icon = `fa ${o.icon}`;
                    baseGroup.init().select();
                }
            })
        }
        return out;
    }
};

var boneNameList = [
    {bone: "head", name: "头部", icon: "fa-graduation-cap"},
    {bone: "armLeft", name: "左臂", icon: "fa-hand-point-left"},
    {bone: "armRight", name: "右臂", icon: "fa-hand-point-right"},
    {bone: "legLeft", name: "左腿", icon: "fa-arrow-alt-circle-left"},
    {bone: "legRight", name: "右腿", icon: "fa-arrow-alt-circle-right"},
    {bone: "wingLeft", name: "左翅膀", icon: "fa-chevron-circle-left"},
    {bone: "wingRight", name: "右翅膀", icon: "fa-chevron-circle-right"}
];