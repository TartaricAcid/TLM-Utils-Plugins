export var newWorkSpace = new Action('new_work_space', {
    name: '新建模型工作区',
    description: '创建一个新的模型',
    icon: 'fiber_new',
    click: function () {
        // 获取旧版本基岩版模型工作区
        let format = Formats['bedrock_old'];
        format.new();
    }
});