import { newModelButton } from "./io/newfile"
import { exportModelButton } from "./io/createpack"

Plugin.register('tlm-utils', {
    name: '车万女仆模组插件',
    author: 'tartaric_acid',
    description: '专门为车万女仆模组制作模型包所设计的插件。',
    icon: 'fa-bomb',
    version: '1.0.0',
    variant: 'both',
    onload() {
        MenuBar.addAction(newModelButton, 'file.-10086');
        MenuBar.addAction(exportModelButton, 'file.export.0');
    },
    onunload() {
        newModelButton.delete();
        exportModelButton.delete();
    }
});




