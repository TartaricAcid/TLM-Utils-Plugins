import { mkdirs } from "../utils/filesystem";
import { isEmpty } from "../utils/string";

export var createNewPackAction = new Action("tlm_utils.create_new_pack", {
    name: "menu.tlm_utils.create_new_pack",
    icon: "create",
    click: function () {
        createNewPackDialog.show();
    },
});

function clearData(data) {
    data.packId = "";
    data.packIcon = "";
    data.packVersion = [1, 0, 0];
    data.tip = "";
    data.canSubmit = false;
    data.packIdBorderColor = "#17191d";
    data.packIdBorderSize = "1px";
}

var createNewPackDialog = new Dialog({
    title: "dialog.tlm_utils.create_new_pack.title",
    width: 600,
    singleButton: true,
    onCancel: function () {
        clearData(createNewPackDialog.content_vue);
    },
    component: {
        data: {
            packId: "",
            packIdBorderColor: "#17191d",
            packIdBorderSize: "1px",
            packVersion: [1, 0, 0],
            packIcon: "",
            tip: "",
            canSubmit: false,
        },
        methods: {
            setWarning: function () {
                this.packIdBorderColor = "#FF0000";
                this.packIdBorderSize = "1px";
                this.canSubmit = false;
            },
            resetWarning: function () {
                this.tip = "";
                this.canSubmit = true;
                this.packIdBorderColor = "#17191d";
                this.packIdBorderSize = "1px";
            },
            checkId: function () {
                this.packId = this.packId.toLowerCase().replace(/\s|-/g, "_");
                if (!this.packId) {
                    this.tip = tl("dialog.tlm_utils.create_new_pack.pack_id.warn.empty.desc");
                    this.setWarning();
                    return;
                }
                if (this.packId.length < 6) {
                    this.tip = tl("dialog.tlm_utils.create_new_pack.pack_id.warn.length.desc");
                    this.setWarning();
                    return;
                }
                if (!(/^[\w.]+$/.test(this.packId))) {
                    this.tip = tl("dialog.tlm_utils.create_new_pack.pack_id.warn.invalid.desc");
                    this.setWarning();
                    return;
                }
                this.resetWarning();
            },
            submit: function () {
                if (!this.packId) {
                    this.tip = tl("dialog.tlm_utils.create_new_pack.pack_id.warn.empty.desc");
                    this.setWarning();
                    return;
                }
                if (this.canSubmit) {
                    let filePaths = electron.dialog.showOpenDialogSync(
                        currentwindow,
                        {
                            properties: ["openDirectory"],
                            title: tl(
                                "dialog.tlm_utils.create_new_pack.directory"
                            ),
                        }
                    );
                    if (filePaths) {
                        let path = filePaths[0];
                        if (path === undefined || path === null) {
                            return;
                        }
                        if (!isEmpty(this.packIcon) && !fs.existsSync(this.packIcon)) {
                            this.packIcon = "";
                        }
                        let packVersion;
                        if (!this.packVersion || this.packVersion.length < 3) {
                            packVersion = "1.0.0";
                        } else {
                            packVersion = `${this.packVersion[0]}.${this.packVersion[1]}.${this.packVersion[2]}`;
                        }
                        let root = `${path}/${this.packId}-${packVersion}`;
                        let namespace = `${root}/assets/${this.packId}`;
                        mkdirs(root);
                        mkdirs(namespace);
                        mkdirs(`${namespace}/animation`);
                        mkdirs(`${namespace}/lang`);
                        mkdirs(`${namespace}/models/entity`);
                        mkdirs(`${namespace}/textures/entity`);
                        fs.writeFileSync(`${root}/pack.mcmeta`, "{\"pack\":{\"pack_format\":3,\"description\":\"Touhou Little Maid Model Pack\"}}");
                        if (!isEmpty(this.packIcon)) {
                            fs.writeFileSync(`${root}/pack.png`, fs.readFileSync(this.packIcon));
                        }
                        createNewPackDialog.hide();
                        clearData(this);
                        Blockbench.notification(tl("dialog.tlm_utils.create_new_pack.success.title"),
                            tl("dialog.tlm_utils.create_new_pack.success.desc", path));
                    }
                }
            },
            openIconPath: function () {
                let filePaths = electron.dialog.showOpenDialogSync(
                    currentwindow,
                    {
                        properties: ["openFile"],
                        title: tl(
                            "dialog.tlm_utils.create_new_pack.pack_icon.desc"
                        ),
                        filters: [{ name: "PNG", extensions: ["png"] }],
                    }
                );
                if (filePaths) {
                    this.packIcon = filePaths[0];
                }
            },
        },
        template: `
            <div style="margin-left: 0">
                <div>
                    <h5 style="margin: 0; padding: 0">{{tl("dialog.tlm_utils.create_new_pack.pack_id")}}
                        <span style="color: #ff0000">*</span></h5>
                    <p style="color: #6a6a6d">{{tl("dialog.tlm_utils.create_new_pack.pack_id.desc")}}</p>
                    <input style="border-radius: 1px; margin-top:5px; padding: 5px; width: 100%; height:50px; font-size: 30px; background-color: #1c2026; border-style: solid"
                           :style="{'border-color': packIdBorderColor, 'border-width': this.packIdBorderSize}"
                           v-model="packId" placeholder="" type="text" @blur="checkId" required>
                </div>
                <div style="margin-top: 20px;">
                    <div style="display: flex; align-items: center;">
                        <button style="min-width: 50px; width: 130px; height: 130px; border-radius: 1px; margin: 0; padding: 0"
                                @click="openIconPath">
                            <div v-if="packIcon" style="padding: 5px">
                                <img :src="packIcon" alt="" width="120px" height="120px">
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
                               v-model="packVersion[0]" placeholder="1" type="number" value="1" step="1" min="0">
                        <p style="font-weight: bold; font-size: 30px; margin: 20px 2px 2px;">.</p>
                        <input style="border-radius: 1px; margin-top:5px; padding: 2px; width: 35px; height:50px; font-size: 30px; background-color: #1c2026; border: #17191d 1px solid"
                               v-model="packVersion[1]" placeholder="0" type="number" value="0" step="1" min="0">
                        <p style="font-weight: bold; font-size: 30px; margin: 20px 2px 2px;">.</p>
                        <input style="border-radius: 1px; margin-top:5px; padding: 2px; width: 35px; height:50px; font-size: 30px; background-color: #1c2026; border: #17191d 1px solid"
                               v-model="packVersion[2]" placeholder="0" type="number" value="0" step="1" min="0">
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
        `,
    },
});
