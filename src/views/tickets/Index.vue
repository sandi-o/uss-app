<template>
    <v-container fluid>
        <v-data-table
            :headers="headers"
            :items="tickets"
            :options.sync="options"
			:server-items-length="totalTickets"
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
                 <v-dialog
                        v-model="formDialog"
                        max-width="500px"
						persistent
						scrollable
                    >
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								color="primary"
								dark
								class="my-2 mx-1"
								v-bind="attrs"
								v-on="on"
							>
							Buy
							</v-btn>
						</template>
						<ticket-purchase-form
							v-if="formDialog"
							:dialog.sync="formDialog"
							@refresh="initialize"
						></ticket-purchase-form>
					</v-dialog>                
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

             <template v-slot:item.entry="{item}">
                    <span v-if="item.entry" class="blue--text">Used</span>
                    <span v-else-if="item.entry == 0" class="red--text">Invalid</span>
                    <span v-else class="green--text">Unused</span>
             </template>

            <template v-slot:item.actions="{item}">
                <v-tooltip bottom>
                    <template v-slot:activator="{on}">
                        <v-icon
                            v-if="item.entry == null"                
                            class="ml-1 mr-1"
                            v-on="on"
                            color="secondary"
                            @click="entry(item,1)"
                        >
                            touch_app
                        </v-icon>
                    </template>
					<span>Use Ticket</span>
                </v-tooltip>
                
                <v-tooltip bottom>
                    <template v-slot:activator="{on}">
                        <v-icon
                            v-if="item.entry"  
                            v-on="on"
                            color="error"
                            class="ml-1 mr-1"
                            @click="entry(item,0)"
                        >
                            delete_forever
                        </v-icon>
                    </template>
					<span>Discard Ticket</span>
                </v-tooltip>
            </template>
        </v-data-table>
    </v-container>
</template>
<script>
import TicketPurchaseForm from '@/components/tickets/Form';

export default {
    components: {
        TicketPurchaseForm
    },
    data: () => ({
        dataTableLoader: false,
        formDialog: false,        
        options: {},
    }),

    computed: {
        tickets() {
            return  this.$store.getters['ticket/tickets'].data;
        },
        headers() {
            return [
                { text: 'Id', value: 'id',},       
                { text: 'Ticket Number', value: 'ticket_no' },                    
                { text: 'Expiry Date', value: 'expires_at' },                
                { text: 'Status', value: 'entry',sortable: false },
                { text: 'Actions', value: 'actions', sortable: false, filterable: false },
            ];
        },    
        title() {
            return 'Tickets';
        },
        totalTickets() {
            return this.$store.getters['ticket/tickets'].total;
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
        initialize () {
            this.dataTableLoader = true
            this.$store.dispatch('ticket/fetchTickets',{'http':this.$http,'options': this.options})
                .then(() => {
                    this.dataTableLoader = false
                    
                })
                .catch(() => {
                    this.dataTableLoader = false
                    setTimeout(() => {  this.$store.commit('snackbar/CLEAR_SNACKBAR'); },4000);                 
                }) 
        },        
        entry(row,value) {            
            this.$store.dispatch('ticket/update',{'http':this.$http,'id': row.id,'value': value})
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