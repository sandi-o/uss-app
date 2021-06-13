<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>USS</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <v-icon>notifications</v-icon>
      </v-btn>

       <v-btn text  @click="logout">
            <v-icon>logout</v-icon>
        </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
    >

     <template v-slot:prepend>
        <v-list color="grey lighten-4">
          <v-list-item two-line ripple>
            <v-list-item-avatar color="primary">
              <v-icon dark>account_circle</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{profile.name}}</v-list-item-title>             
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>

      <v-divider></v-divider>
      <v-list>
        <template v-for="item in items">
          <v-list-group            
              v-if="item.children"                 
              :key="item.title" 
              :prepend-icon="item.icon" 
              :append-icon="item['icon-alt'] ? item['icon-alt'] : ''"
              color="secondary"
          >
            <template v-slot:activator>                    
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </template>
            <v-list-item color="primary" v-for="(child, i) in item.children" :key="i" router :to="child.link">
              <v-list-item-icon  v-if="child.icon" >
                <v-icon v-text="child.icon"></v-icon>
              </v-list-item-icon>       
              <v-list-item-title v-text="child.title"></v-list-item-title>                            
            </v-list-item>
          </v-list-group>

          <v-list-item color="primary" v-else :key="item.title" link router :to="item.link" v-show="ticketCount || item.title =='Tickets'" >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>

     </v-navigation-drawer>

    <v-main>
      <the-app-snackbar />
       <router-view/>
    </v-main>
  </v-app>
</template>

<script>
  export default {
    name: 'Home',

    data: () => ({
      drawer: null ,
      items: [
        { icon: 'confirmation_number', title: 'Tickets' ,link: 'tickets', slug: '' },
        { icon: 'attractions', title: 'Rides', link: '/park/rides', slug: '' },        
        { icon: 'theater_comedy', title: 'Shows', link: '/park/shows', slug: '' },        
        { icon: 'local_play', title: 'Attractions', link: '/park/attractions', slug: '' },        
      ],    
    }),
    computed: {
      profile() {
        return this.$store.getters['auth/profile']; 
      },
      ticketCount() {
        return this.$store.getters['ticket/ticket'].count;
      }
    },
    created() {
       this.getUser();  
       this.getTicketInUse();
    },
    methods: {
      getUser() {       
        this.$store.dispatch('auth/user',{'http':this.$http})
          .then(() => {
          })
          .catch(() => {
            setTimeout(() => { this.$store.commit('snackbar/CLEAR_SNACKBAR');},4000)
            //window.location.replace('/login')
          });
      },
      getTicketInUse() {
        this.$store.dispatch('ticket/inUse',{'http':this.$http})
      },
      logout() {
        this.$store.dispatch('auth/logout', {'http':this.$http})
          .then(() => {
            this.$router.push({name:'Login'})
            setTimeout(() => { this.$store.commit('snackbar/CLEAR_SNACKBAR');},4000)
          })
          .catch(() => {
            this.$router.push({name:'Login'})
          });
      }
    }
  }
</script>
