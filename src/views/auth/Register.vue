<template>
<v-main>
    <v-container>
        <the-app-snackbar />
        <v-card class="mx-auto my-12" max-width="600">                    
            <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="save">           
            <v-card-title>Register</v-card-title>
            <v-card-text>
                <v-text-field
                    label="Name"
                    v-model="name"
                    prepend-icon="how_to_reg"
                    type="text"
                    :rules="[v => !!v || 'Name is required']"
                    clearable            
                    required                                        
                ></v-text-field>
                <v-text-field
                    label="E-mail"
                    v-model="email"
                    prepend-icon="email"
                    type="text"
                    :rules="[v => !!v || 'E-mail is required']"
                    clearable            
                    required                                        
                ></v-text-field>
                <v-text-field
                    label="Mobile Number"
                    v-model="mobile"
                    prepend-icon="phone_iphone"
                    type="number"
                    :rules="[v => !!v || 'Mobile Number is required']"
                    clearable            
                    required                                        
                ></v-text-field>
                <v-text-field
                    label="Password"
                    v-model="password"
                    prepend-icon="lock"
                    type="password"
                    :rules="[v => !!v || 'Password is required']"
                    clearable
                    required
                >
                </v-text-field>     
            </v-card-text>
            <v-card-actions>
                <v-btn text to="/login">Back to Login</v-btn>
                <v-spacer></v-spacer>
                <v-btn type="submit" color="primary" :loading="loading">Submit</v-btn>
            </v-card-actions>
            </v-form>
        </v-card>
    </v-container>
</v-main>
</template>

<script>
export default {
    data: () => ({
        valid: true,
        loading: false,
        name: '',
        email: '',
        mobile: '',
        password: '',
    }),
    methods: {   
        save () {
            if(this.$refs.form.validate()) {   
                this.loading = true;
                const {name, email, mobile, password} = this;                                   
                this.$store.dispatch('auth/create', {
                    name, email, mobile, password, 'http': this.$http
                }).then(() => {
                    this.loading = false;
                    this.$router.push({name: 'Home'})
                }).catch(() => {
                    this.loading = false;
                    setTimeout(() => { this.$store.commit('snackbar/CLEAR_SNACKBAR');},4000); 
                });   
                 
            }
        },
    },
}
</script>

<style>

</style>