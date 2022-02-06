import polygonVue from "./polygon.vue";
import pleatedSkirtVue from "./pleated_skirt.vue";
import squareSkirtVue from "./square_skirt.vue";

export var addPresent = {
    is_tlm_add_menu: true,
    icon: "fa-swatchbook",
    name: "dialog.tlm_utils.add_present",
    condition: {modes: ["edit"]},
    click: function (group) {
        let dialog = new Dialog({
            title: "dialog.tlm_utils.add_present",
            width: 600,
            singleButton: true,
            onCancel: function () {
                if (dialog.content_vue.isPreview.data && dialog.content_vue.isPreview.group) {
                    dialog.content_vue.isPreview.group.remove(false);
                }
            },
            sidebar: {
                pages: {
                    "polygon": tl("dialog.tlm_utils.add_present.polygon"),
                    "pleated_skirt": tl("dialog.tlm_utils.add_present.pleated_skirt"),
                    "square_skirt": tl("dialog.tlm_utils.add_present.square_skirt")
                },
                page: "polygon",
                onPageSwitch(page) {
                    dialog.content_vue.openCategory = page;
                }
            },
            component: {
                data() {
                    return {
                        group: group,
                        openCategory: "polygon",
                        dialog: dialog,
                        isPreview: {
                            data: false,
                            group: false
                        }
                    };
                },
                components: {polygonVue, pleatedSkirtVue, squareSkirtVue},
                template: `
                    <div>
                        <polygonVue v-if="openCategory==='polygon'" :group='group' :isPreview="isPreview"
                                    :dialog="dialog"/>
                        <pleatedSkirtVue v-if="openCategory==='pleated_skirt'" :group='group' :isPreview="isPreview"
                                         :dialog="dialog"/>
                        <squareSkirtVue v-if="openCategory==='square_skirt'" :group='group' :isPreview="isPreview"
                                        :dialog="dialog"/>
                    </div>`
            }
        });
        dialog.show();
    }
};