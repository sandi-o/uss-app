<template>
    <v-container fluid>
        <v-data-table
            :headers="headers"
            :items="parks"
            :options.sync="options"
			:server-items-length="totalParks"
            :loading="dataTableLoader"
            sort-by="id"
			sort-desc            
            loading-text="Fetching Data, Please wait..."
            class="elevation-1"
        >
            <template v-slot:top>
            <v-toolbar
                flat
            >
                <v-toolbar-title>{{title}}</v-toolbar-title>
                <v-divider
                    class="mx-4"
                    inset
                    vertical
                ></v-divider>
                <v-spacer></v-spacer>            
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn 
                            v-on="on"
                            class="my-2 mx-1" 
                            color="accent"
                            fab 
                            dark 
                            small
                            @click="initialize" 
                            :loading="dataTableLoader"
                        ><v-icon dark>refresh</v-icon>
                        </v-btn> 
                    </template>
                    <span>Refresh</span>
                </v-tooltip>             
            </v-toolbar>
            </template>
         

            <template v-slot:item.actions="{item}">
                <v-tooltip bottom>
                    <template v-slot:activator="{on}">
                        <v-icon
                            class="ml-1 mr-1"
                            v-on="on"
                            color="secondary"
                            @click="q(item,1)"
                            v-show="!qd(item.id)"
                        >
                            add_to_queue
                        </v-icon>
                    </template>
					<span>Queue Up</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{on}">
                        <v-icon                      
                            v-on="on"
                            color="error"
                            class="ml-1 mr-1"
                            @click="q(item,0)"
                            v-show="qd(item.id)"
                        >
                            remove_from_queue
                        </v-icon>
                    </template>
					<span>Remove from Queue</span>
                </v-tooltip>
            </template>
        </v-data-table>
    </v-container>
</template>
<script>

export default {
    data: () => ({
        parkIndex: -1, 
        dataTableLoader: false,
        formDialog: false,        
        options: {},
    }),

    computed: {
        parks() {
            return  this.$store.getters['park/parks'].data;
        },
        qs() {
           return this.$store.getters['park/parkQueued'];
        },
        headers() {
            return [
                { text: 'Id', value: 'id',},       
                { text: 'Name', value: 'name' },                    
                // { text: 'Opening', value: 'opens_at' },                
                // { text: 'Closing', value: 'closes_at'},
                { text: 'Max. Capcity', value: 'max_capacity'},
                { text: 'Intermission', value: 'intermission'},
                { text: 'People In Queue', value: 'in_queue'},
                { text: 'Estimate Wait Time', value: 'wait_time'},
                { text: 'Actions', value: 'actions', sortable: false, filterable: false },
            ];
        },    
        title() {
            return this.$route.params.type;
        },
        totalParks() {
            return this.$store.getters['park/parks'].total;
        }
    },

    watch: {    
        options: {
			handler() {			
				this.initialize();		
			},
			deep: true,
		},
        $route() {
			this.options.page = 1; // reset page
			this.initialize();
		},
    },

    mounted() {
		this.initialize();
	},

    methods: {
        qd(id) {
            let q = this.qs.find( o => o.id == id);
            if(q != undefined)
                return true

            return false
        },    
        inQ() {
            this.$store.dispatch('park/fetchQs',{'http': this.$http})
        },
        initialize () {
            this.dataTableLoader = true
            this.$store.dispatch('park/fetchParks',{'http':this.$http,'options': this.options,'type': this.$route.params.type})
                .then(() => {
                    this.dataTableLoader = false
                    this.inQ();
                })
                .catch(() => {
                    this.dataTableLoader = false
                    setTimeout(() => {  this.$store.commit('snackbar/CLEAR_SNACKBAR'); },4000);                 
                }) 
        },        
        q(row,value) {            
            this.$store.dispatch('park/q',{'http':this.$http,'id': row.id,'q': value})
            .then(() => {
                this.initialize();
                setTimeout(() => {  this.$store.commit('snackbar/CLEAR_SNACKBAR'); },4000); 
            })
            .catch(() => {                
                setTimeout(() => {  this.$store.commit('snackbar/CLEAR_SNACKBAR'); },4000);                 
            }) 
        },
    },
  }
</script>