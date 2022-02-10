import polygonVue from "./polygon.vue";
import pleatedSkirtVue from "./pleated_skirt.vue";
import squareSkirtVue from "./square_skirt.vue";
import pyramidVue from "./pyramid.vue";
import customVue from "./custom.vue";

export var addPresent = {
    is_tlm_add_menu: true,
    icon: "fa-swatchbook",
    name: "dialog.tlm_utils.add_present",
    condition: () => Modes.edit && (Format.id === "bedrock" || Format.id === "bedrock_old"),
    click: function (group) {
        let dialog = new Dialog({
            title: "dialog.tlm_utils.add_present",
            width: 750,
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
                    "square_skirt": tl("dialog.tlm_utils.add_present.square_skirt"),
                    "pyramid": tl("dialog.tlm_utils.add_present.pyramid"),
                    "custom": tl("dialog.tlm_utils.add_present.custom")
                },
                page: "polygon",
                onPageSwitch(page) {
                    dialog.content_vue.openCategory = page;
                    if (dialog.content_vue.isPreview.data && dialog.content_vue.isPreview.group) {
                        dialog.content_vue.isPreview.group.remove(false);
                        dialog.content_vue.isPreview.data = false;
                        dialog.content_vue.isPreview.group = false;
                    }
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
                components: {polygonVue, pleatedSkirtVue, squareSkirtVue, pyramidVue, customVue},
                template: `
                    <div>
                        <polygonVue v-if="openCategory==='polygon'" :group='group' :isPreview="isPreview"
                                    :dialog="dialog"/>
                        <pleatedSkirtVue v-if="openCategory==='pleated_skirt'" :group='group' :isPreview="isPreview"
                                         :dialog="dialog"/>
                        <squareSkirtVue v-if="openCategory==='square_skirt'" :group='group' :isPreview="isPreview"
                                        :dialog="dialog"/>
                        <pyramidVue v-if="openCategory==='pyramid'" :group='group' :isPreview="isPreview"
                                    :dialog="dialog"/>
                        <customVue v-if="openCategory==='custom'" :group='group' :isPreview="isPreview"
                                   :dialog="dialog"/>
                    </div>`
            }
        });
        dialog.show();
    }
};