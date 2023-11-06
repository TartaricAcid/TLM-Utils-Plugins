<script>
export default {
    props: {
        parent: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            soundType: [
                ["idle", "mode"],
                ["attack", "mode"],
                ["range_attack", "mode"],
                ["danmaku_attack", "mode"],
                ["farm", "mode"],
                ["feed", "mode"],
                ["shears", "mode"],
                ["milk", "mode"],
                ["torch", "mode"],
                ["feed_animal", "mode"],
                ["extinguishing", "mode"],
                ["snow", "mode"],
                ["break", "mode"],
                ["furnace", "mode"],
                ["brewing", "mode"],
                ["find_target", "ai"],
                ["hurt", "ai"],
                ["hurt_fire", "ai"],
                ["hurt_player", "ai"],
                ["tamed", "ai"],
                ["item_get", "ai"],
                ["death", "ai"],
                ["cold", "environment"],
                ["hot", "environment"],
                ["rain", "environment"],
                ["snow", "environment"],
                ["morning", "environment"],
                ["night", "environment"],
                ["credit", "other"]
            ],
        }
    },
    methods: {
        tl: tl
    },
    computed: {}
}

</script>

<template>
    <div style="max-height: 650px; overflow-y: auto;">
        <div v-for="(value, index) in soundType">
            <button :class="{'selected':index===parent.selectedId}"
                    style="width: 98%; margin-top: 2px; height: 30px" @click="parent.selectedSound(index)">
                {{ tl(`button.tlm_utils.sound_pack.sound.${value[1]}.${value[0]}`) }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.selected, .selected:hover {
    background-color: #21252b;
    pointer-events: none;
    border-left-color: #23d400;
    border-left-style: solid;
    border-left-width: 5px;
}
</style>