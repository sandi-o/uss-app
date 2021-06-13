<template>
    <v-snackbar
        top
        :value="snack.visible"
        :timeout="snack.timeout"
        :color="snack.color"
        :multi-line="snack.multiline === true"
    >
    {{ snack.text }}
    
        <template v-slot:action="{ attrs }">
            <v-btn
                dark
                text
                v-bind="attrs"
                @click="close"
            >
            Close
            </v-btn>
        </template>

    </v-snackbar>
</template>

<script>
export default {
    computed: {
        snack() {
            return this.$store.getters['snackbar/attributes'];
        }
    },
    methods: {
        close() {
            this.$store.commit('snackbar/CLEAR_SNACKBAR');
        }
    }
}
</script>