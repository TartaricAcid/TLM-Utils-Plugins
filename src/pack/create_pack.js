import createDialogVue from "./create_dialog.vue";

export var createNewPackAction = new Action("tlm_utils.create_new_pack", {
    name: "menu.tlm_utils.create_new_pack",
    icon: "create",
    click: function () {
        createNewPackDialog.show();
    }
});

export function clearNewPackDialogData(data) {
    data.packId = "";
    data.packIcon = "";
    data.packVersion = [1, 0, 0];
    data.tip = "";
    data.canSubmit = false;
    data.packIdBorderColor = "#17191d";
    data.packIdBorderSize = "1px";
}

export var createNewPackDialog = new Dialog({
    title: "dialog.tlm_utils.create_new_pack.title",
    width: 600,
    singleButton: true,
    onCancel: function () {
        clearNewPackDialogData(createNewPackDialog.content_vue);
    },
    component: createDialogVue
});