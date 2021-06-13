<template>
<v-main>
    <v-container>
        <the-app-snackbar />
        <v-card class="mx-auto my-12" max-width="600">                    
            <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="login">
                <v-img class="white--text align-end" src="background.jpg" height="300px">
                    <v-card-title>USS</v-card-title>
                </v-img>
            <v-card-text>
                <v-text-field
                    label="E-mail"
                    v-model="email"
                    prepend-icon="email"
                    type="text"
                    clearable            
                    required                                        
                ></v-text-field>
                <v-text-field
                    label="Password"
                    v-model="password"
                    prepend-icon="lock"
                    type="password"
                    clearable
                    required
                >
                </v-text-field>     
            </v-card-text>
            <v-card-actions>
                <v-btn text to="/register">Register</v-btn>
                <v-spacer></v-spacer>
                <v-btn type="submit" color="primary" :loading="loading">Login</v-btn>
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
        email: '',
        password: '',
    }),   
    methods: {   
        login () {
            this.loading = true;
            const {email, password} = this;                       
            this.$http.get('/sanctum/csrf-cookie').then(() => {           
                this.$store.dispatch('auth/login', {
                    email, password, 'http': this.$http
                }).then(() => {
                    this.loading = false;
                    this.$router.push({name: 'Home'})
                }).catch(() => {
                    this.loading = false;
                    setTimeout(() => { this.$store.commit('snackbar/CLEAR_SNACKBAR');},4000); 
                });   
            });
                    
        },
    },
}
</script>