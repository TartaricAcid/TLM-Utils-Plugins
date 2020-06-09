var IS_TLM_ARMOR_HIDE = false;

var armorTlmBone = ["helmet", "chestPlate", "chestPlateLeft", "chestPlateMiddle", "chestPlateRight",
    "leggings", "leggingsLeft", "leggingsMiddle", "leggingsRight",
    "bootsLeft", "bootsRight"]

var hideArmorTlmBone = ["-helmet", "_helmet", "-chestPlate", "-chestPlateLeft", "-chestPlateMiddle", "-chestPlateRight",
    "_chestPlate", "_chestPlateLeft", "_chestPlateMiddle", "_chestPlateRight",
    "-leggings", "-leggingsLeft", "-leggingsMiddle", "-leggingsRight", "_leggings",
    "_leggingsLeft", "_leggingsMiddle", "_leggingsRight",
    "-bootsLeft", "-bootsRight", "_bootsLeft", "_bootsRight"]

export var hideArmor = new Action('tlm_hide_armor', {
    name: '切换护甲隐藏',
    description: '切换护甲隐藏',
    icon: 'visibility',
    category: 'edit',
    condition: () => (Format.id === 'bedrock_old'),
    click: function () {
        IS_TLM_ARMOR_HIDE = !IS_TLM_ARMOR_HIDE;
        if (IS_TLM_ARMOR_HIDE) {
            BarItems["tlm_hide_armor"].setIcon('visibility_off')
        } else {
            BarItems["tlm_hide_armor"].setIcon('visibility')
        }

        let armor = [];
        let hideArmor = [];

        Group.all.forEach(group => {
            if (armorTlmBone.includes(group.name)) {
                armor.push(group);
            }
            if (hideArmorTlmBone.includes(group.name)) {
                hideArmor.push(group);
            }
            if (group.name === "_helmet") {
                console.log(hideArmor);
            }
        })

        armor.forEach(group => {
            group.select();
            Cube.selected.forEach(cube => {
                cube.visibility = !IS_TLM_ARMOR_HIDE;
            })
        })
        hideArmor.forEach(group => {
            group.select();
            Cube.selected.forEach(cube => {
                cube.visibility = IS_TLM_ARMOR_HIDE;
            })
        })

        Canvas.updateVisibility()
    }
})