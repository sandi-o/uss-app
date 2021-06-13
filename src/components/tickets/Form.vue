<template>
<v-form ref="form" v-model="valid" lazy-validation>
    <v-card>
        <v-card-title>{{formTitle}}</v-card-title>
        <v-card-text>
            <v-container fluid>
            <v-row>
                <v-col cols="12">
                    <v-text-field
                        type='number'
                        v-model="quantity"
                        label="*Number of Tickets"
                        :rules="[v => !!v || 'Number of Ticket(s) is required',]"                        
                    ></v-text-field>
                </v-col>                  
            </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-btn color="error" text @click="close" :disabled="disabled">
                <v-icon right dark>close</v-icon>            
                Cancel
            </v-btn>
            <v-spacer></v-spacer>           
            <v-btn color="primary" @click="save" :loading="loading">
                <v-icon right dark>payment</v-icon>
                Pay
            </v-btn>
        </v-card-actions>
    </v-card>
</v-form>
</template>

<script>
export default {
     props: {
        dialog: Boolean,   
    },
    data: () => ({
        quantity: null,
        disabled: false,        
        loading: false,
        valid: true,        
    }),    
    computed: {
        formTitle() {
            return "But Ticket(s)";
        }
    },    
    methods: {
        close() {          
            this.$emit('refresh')
            this.$emit('update:dialog', false)
        },
        save() {            
            if(this.$refs.form.validate()) {           
                this.disabled = true;
                this.loading = true;

                this.$store.dispatch('ticket/create',{'quantity':this.quantity,'http':this.$http})
                .then(() => {
                    this.close();
                    this.loading = false;
                    this.disabled = false;
                    setTimeout(() => {  this.$store.commit('snackbar/CLEAR_SNACKBAR'); },4000); 
                })
                .catch(() => {
                    this.loading = false;
                    this.disabled = false;
                    setTimeout(() => { this.$store.commit('snackbar/CLEAR_SNACKBAR'); },4000); 
                });
            }
        }
    }
}
</script>

<style>

</style>