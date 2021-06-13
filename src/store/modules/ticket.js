const state = {
    tickets: [],
    ticket: 0,
    status: '', 
};

const getters = {
    tickets: state => state.tickets,
    ticket: state => state.ticket,
    status: state => state.status,
};

const actions = {
    fetchTickets: ({commit},payload) => {        
        commit('STATUS','fetching data');
     
        const {sortBy, sortDesc,  page, itemsPerPage } = payload.options;

        return new Promise((resolve, reject) => {
            payload.http.get('/api/tickets?page='+page  +'&per_page='+itemsPerPage+'&sort_by='+sortBy+'&sort_desc='+sortDesc)
            .then(response => {
                commit('STATUS', 'success');
                commit('SET_TICKETS', response.data);
                resolve(response.data);
            })
            .catch(errors => {
                commit('STATUS', 'error');
                let err = []
                for(const k in errors.response.data)
                    err.push(errors.response.data[k])

                commit('snackbar/SET_SNACKBAR',{text: err.toString().split(',').join('\n'), visible: true, color: 'error'},{ root: true });
                reject(errors);
            })
        });
    },
    inUse: ({commit},payload) => {
        commit('STATUS','fetching tickets in use.');

        return new Promise((resolve, reject) => {
            payload.http.get('/api/tickets/using')
            .then(response => {
                commit('SET_TICKET', response.data);
                resolve(response.data);
            })
            .catch(errors => {
                commit('STATUS', 'error');
                let err = []
                for(const k in errors.response.data)
                    err.push(errors.response.data[k])

                commit('snackbar/SET_SNACKBAR',{text: err.toString().split(',').join('\n'), visible: true, color: 'error'},{ root: true });
                reject(errors);
            })
        });
    },
    create: ({commit}, payload) => {
        commit('STATUS','storing data');
        return new Promise((resolve, reject) => {
            payload.http.post('/api/tickets', {quantity: payload.quantity})
            .then(response => {
                commit('STATUS', 'stored');
                commit('snackbar/SET_SNACKBAR',{text: response.data.message, visible: true, color: 'success', timeout: 5000},{ root: true });
                resolve(response.data);
            })
            .catch(errors => {
                commit('STATUS', 'error storing');
                let err = []
                for(const k in errors.response.data)
                    err.push(errors.response.data[k])

                commit('snackbar/SET_SNACKBAR',{text: err.toString().split(',').join('\n'), visible: true, color: 'error'},{ root: true });
                // commit('snackbar/SET_SNACKBAR',{text: errors.response.data.message, visible: true, color: 'error', timeout: 5000},{ root: true });
                reject(errors);
            })
        });
    },
    update: ({commit}, payload) => {
        commit('STATUS','updating data');
        return new Promise((resolve, reject) => {
            payload.http.patch('/api/tickets/'+payload.id, {entry:payload.value})
            .then(response => {
                if(payload.value == 1)
                    commit('ADD_TICKET')
                else
                    commit('LESS_TICKET')

                commit('STATUS', 'updated');
                commit('snackbar/SET_SNACKBAR',{text: response.data.message, visible: true, color: 'success', timeout: 5000},{ root: true });
                resolve(response.data);
            })
            .catch(errors => {
                commit('STATUS', 'error updating');
                let err = []
                for(const k in errors.response.data)
                    err.push(errors.response.data[k])

                commit('snackbar/SET_SNACKBAR',{text: err.toString().split(',').join('\n'), visible: true, color: 'error'},{ root: true });
                reject(errors);
            })
        });
    },
};

const mutations = {
    STATUS: (state, status) => {
        state.status = status;
    },
    SET_TICKETS: (state, data) => {
        state.tickets = data
    },
    CLEAR_TICKETS: (state) => {
        state.tickets = []
    },
    SET_TICKET: (state, ticket) => {
        state.ticket = ticket
    },
    CLEAR_TICKET: (state) => {
        state.ticket = 0
    },
    ADD_TICKET:(state) => {
        state.ticket.count++
    },
    LESS_TICKET:(state) => {
        state.ticket.count--
    }
}

export default {
    namespaced:true,
    state,
    getters,
    actions,
    mutations,
}