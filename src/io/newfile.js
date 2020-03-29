export var newModelButton = new Action('new_tlm_model', {
    name: '新建 TLM 模型',
    description: '创建一个新的车万女仆模组模型',
    icon: 'fa-bomb',
    click: function () {
        let format = Formats['bedrock_old'];
        format.new();
    }
});