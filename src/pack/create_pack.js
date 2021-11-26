import {mkdirs} from "../utils/filesystem";
import {isEmpty} from "../utils/string";

export var createNewPackAction = new Action("tlm_utils.create_new_pack", {
    name: "menu.tlm_utils.create_new_pack",
    icon: "create",
    click: function () {
        createNewPackDialog.show();
    }
});

function clearData(data) {
    data.pack_id = ""
    data.pack_icon = ""
    data.pack_version = [1, 0, 0]
    data.tip = ""
    data.canSubmit = false
    data.pack_id_border_color = "#17191d"
    data.pack_id_border_size = "1px"
}

var createNewPackDialog = new Dialog({
    title: "dialog.tlm_utils.create_new_pack.title",
    width: 600,
    singleButton: true,
    onCancel: function () {
        clearData(createNewPackDialog.content_vue)
    },
    component: {
        data: {
            pack_id: "",
            pack_id_border_color: "#17191d",
            pack_id_border_size: "1px",
            pack_version: [1, 0, 0],
            pack_icon: "",
            tip: "",
            canSubmit: false
        },
        methods: {
            setWarning: function () {
                this.pack_id_border_color = "#FF0000"
                this.pack_id_border_size = "1px"
                this.canSubmit = false
            },
            resetWarning: function () {
                this.tip = ""
                this.canSubmit = true
                this.pack_id_border_color = "#17191d"
                this.pack_id_border_size = "1px"
            },
            checkId: function () {
                this.pack_id = this.pack_id.toLowerCase().replace(/\s|-/g, "_");
                if (!this.pack_id) {
                    this.tip = tl("dialog.tlm_utils.create_new_pack.pack_id.warn.empty.desc")
                    this.setWarning()
                    return;
                }
                if (this.pack_id.length < 6) {
                    this.tip = tl("dialog.tlm_utils.create_new_pack.pack_id.warn.length.desc")
                    this.setWarning()
                    return;
                }
                if (!(/^[\w.]+$/.test(this.pack_id))) {
                    this.tip = tl("dialog.tlm_utils.create_new_pack.pack_id.warn.invalid.desc")
                    this.setWarning()
                    return;
                }
                this.resetWarning()
            },
            submit: function () {
                if (!this.pack_id) {
                    this.tip = tl("dialog.tlm_utils.create_new_pack.pack_id.warn.empty.desc")
                    this.setWarning()
                    return;
                }
                if (this.canSubmit) {
                    let filePaths = electron.dialog.showOpenDialogSync(currentwindow, {
                        properties: ["openDirectory"],
                        title: tl("dialog.tlm_utils.create_new_pack.directory")
                    });
                    if (filePaths) {
                        let path = filePaths[0];
                        if (path === undefined || path === null) {
                            return;
                        }
                        if (!isEmpty(this.pack_icon) && !fs.existsSync(this.pack_icon)) {
                            this.pack_icon = ""
                        }
                        let packVersion;
                        if (!this.pack_version || this.pack_version.length < 3) {
                            packVersion = "1.0.0";
                        } else {
                            packVersion = `${this.pack_version[0]}.${this.pack_version[1]}.${this.pack_version[2]}`;
                        }
                        let root = `${path}/${this.pack_id}-${packVersion}`;
                        let namespace = `${root}/assets/${this.pack_id}`;
                        mkdirs(root);
                        mkdirs(namespace);
                        mkdirs(`${namespace}/animation`);
                        mkdirs(`${namespace}/lang`);
                        mkdirs(`${namespace}/models/entity`);
                        mkdirs(`${namespace}/textures/entity`);
                        fs.writeFileSync(`${root}/pack.mcmeta`, "{\"pack\":{\"pack_format\":3,\"description\":\"Touhou Little Maid Model Pack\"}}");
                        if (!isEmpty(this.pack_icon)) {
                            fs.writeFileSync(`${root}/pack.png`, fs.readFileSync(this.pack_icon))
                        }
                        createNewPackDialog.hide();
                        clearData(this)
                        Blockbench.notification(tl("dialog.tlm_utils.create_new_pack.success.title"),
                            tl("dialog.tlm_utils.create_new_pack.success.desc", path));
                    }
                }
            },
            openIconPath: function () {
                let filePaths = electron.dialog.showOpenDialogSync(currentwindow, {
                    properties: ["openFile"],
                    title: tl("dialog.tlm_utils.create_new_pack.pack_icon.desc"),
                    filters: [{name: "PNG", extensions: ["png"]}]
                });
                if (filePaths) {
                    this.pack_icon = filePaths[0]
                }
            }
        },
        template: `
            <div style="margin-left: 0">
                <div>
                    <h5 style="margin: 0; padding: 0">{{tl("dialog.tlm_utils.create_new_pack.pack_id")}}
                        <span style="color: #ff0000">*</span></h5>
                    <p style="color: #6a6a6d">{{tl("dialog.tlm_utils.create_new_pack.pack_id.desc")}}</p>
                    <input style="border-radius: 1px; margin-top:5px; padding: 5px; width: 100%; height:50px; font-size: 30px; background-color: #1c2026; border-style: solid"
                           :style="{'border-color': pack_id_border_color, 'border-width': this.pack_id_border_size}"
                           v-model="pack_id" placeholder="" type="text" @blur="checkId" required>
                </div>
                <div style="margin-top: 20px;">
                    <div style="display: flex; align-items: center;">
                        <button style="min-width: 50px; width: 130px; height: 130px; border-radius: 1px; margin: 0; padding: 0"
                                @click="openIconPath">
                            <div v-if="pack_icon" style="padding: 5px">
                                <img :src="pack_icon" alt="" width="120px" height="120px">
                            </div>
                            <div v-else>
                                <i class="far fa-4x fa-images"></i>
                            </div>
                        </button>
                        <div style="margin-left: 20px">
                            <h5 style="margin: 0; padding: 0">{{tl("dialog.tlm_utils.create_new_pack.pack_icon")}}</h5>
                            <p style="color: #6a6a6d">{{tl("dialog.tlm_utils.create_new_pack.pack_icon.desc")}}</p>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 20px">
                    <div style="display: flex; align-items: center">
                        <input style="border-radius: 1px; margin-top:5px; padding: 2px; width: 35px; height:50px; font-size: 30px; background-color: #1c2026; border: #17191d 1px solid"
                               v-model="pack_version[0]" placeholder="1" type="number" value="1" step="1" min="0">
                        <p style="font-weight: bold; font-size: 30px; margin: 20px 2px 2px;">.</p>
                        <input style="border-radius: 1px; margin-top:5px; padding: 2px; width: 35px; height:50px; font-size: 30px; background-color: #1c2026; border: #17191d 1px solid"
                               v-model="pack_version[1]" placeholder="0" type="number" value="0" step="1" min="0">
                        <p style="font-weight: bold; font-size: 30px; margin: 20px 2px 2px;">.</p>
                        <input style="border-radius: 1px; margin-top:5px; padding: 2px; width: 35px; height:50px; font-size: 30px; background-color: #1c2026; border: #17191d 1px solid"
                               v-model="pack_version[2]" placeholder="0" type="number" value="0" step="1" min="0">
                        <div style="margin-left: 20px">
                            <h5 style="margin: 0; padding: 0">{{tl("dialog.tlm_utils.create_new_pack.pack_version")}}</h5>
                            <p style="color: #6a6a6d">{{tl("dialog.tlm_utils.create_new_pack.pack_version.desc")}}</p>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 20px; height: 20px">
                    <p style="color: red">{{tip}}</p>
                </div>
                <div style="margin-top: 20px">
                    <button style="width: 100%; height:50px; border-radius: 1px"
                            @click="submit">
                        <h5>{{tl("dialog.tlm_utils.create_new_pack.create")}}</h5></button>
                </div>
            </div>
        `
    }
});