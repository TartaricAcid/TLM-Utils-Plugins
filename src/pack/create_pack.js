import {mkdirs} from "../utils/filesystem";
import {isEmpty} from "../utils/string";

export var createNewPack = new Action("tlm_utils.create_new_pack", {
    name: "menu.tlm_utils.create_new_pack",
    icon: "create",
    click: function () {
        createNewPackDialog.show();
    }
});

let createNewPackDialog = new Dialog({
    title: "dialog.tlm_utils.create_new_pack.title",
    width: 800,
    form: {
        packId: {
            label: "dialog.tlm_utils.create_new_pack.pack_id",
            type: "input",
            placeholder: tl("dialog.tlm_utils.create_new_pack.pack_id.placeholder")
        },
        line1: "_",
        packVersion: {
            label: "dialog.tlm_utils.create_new_pack.pack_version",
            type: "input",
            placeholder: tl("dialog.tlm_utils.create_new_pack.pack_version.placeholder")
        },
        packIcon: {
            label: "dialog.tlm_utils.create_new_pack.pack_icon",
            type: "file",
            extensions: ["png"],
            filetype: "PNG"
        }
    },
    onConfirm: function (formData) {
        let packId = formData.packId.toLowerCase().replace(/\s|-/g, "_");
        if (!(/^[\w.]+$/.test(packId))) {
            Blockbench.notification(tl("dialog.tlm_utils.create_new_pack.pack_id.warn.invalid.title"),
                tl("dialog.tlm_utils.create_new_pack.pack_id.warn.invalid.desc"));
            return;
        }
        if (packId.length < 6) {
            Blockbench.notification(tl("dialog.tlm_utils.create_new_pack.pack_id.warn.length.title"),
                tl("dialog.tlm_utils.create_new_pack.pack_id.warn.length.desc"));
            return;
        }

        let packVersion;
        if (isEmpty(formData.packVersion)) {
            packVersion = "1.0.0";
        } else {
            packVersion = formData.packVersion;
        }

        let filePaths = electron.dialog.showOpenDialogSync(currentwindow, {
            properties: ["openDirectory"]
        });

        if (filePaths) {
            let path = filePaths[0];
            if (path === undefined || path === null) {
                return;
            }
            let root = `${path}/${packId}-${packVersion}`;
            let namespace = `${root}/assets/${packId}`;
            mkdirs(root);
            mkdirs(namespace);
            mkdirs(`${namespace}/animation`);
            mkdirs(`${namespace}/lang`);
            mkdirs(`${namespace}/models/entity`);
            mkdirs(`${namespace}/textures/entity`);
            fs.writeFileSync(`${root}/pack.mcmeta`, "{\"pack\":{\"pack_format\":3,\"description\":\"Touhou Little Maid Model Pack\"}}");
            if (!isEmpty(formData.packIcon)) {
                fs.writeFileSync(`${root}/pack.png`, fs.readFileSync(formData.packIcon))
            }
            createNewPackDialog.hide();
            Blockbench.notification(tl("dialog.tlm_utils.create_new_pack.success.title"),
                tl("dialog.tlm_utils.create_new_pack.success.desc", path));
        }
    }
});