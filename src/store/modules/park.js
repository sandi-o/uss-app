const state = {
    parkQueued: [],
    parks: [],
    park: {},    
    status: '', 
};

const getters = {
    parkQueued: state => state.parkQueued,
    parks: state => state.parks,
    park: state => state.park,
    status: state => state.status,
};

const actions = {
    fetchParks: ({commit},payload) => {        
        commit('STATUS','fetching data');
     
        const {sortBy, sortDesc,  page, itemsPerPage } = payload.options;

        return new Promise((resolve, reject) => {
            payload.http.get('/api/parks/'+payload.type+'?page='+page  +'&per_page='+itemsPerPage+'&sort_by='+sortBy+'&sort_desc='+sortDesc)
            .then(response => {
                commit('STATUS', 'success');
                commit('SET_PARKS', response.data);
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
   fetchQs: ({commit}, payload) => {
        commit('STATUS','fetching queued rides');

        return new Promise((resolve, reject) => {
            payload.http.get('/api/parks/q')
            .then(response => {
                commit('STATUS', 'success');
                commit('SET_QS', response.data);
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
    q: ({commit}, payload) => {
        commit('STATUS','updating data, queueing');
        return new Promise((resolve, reject) => {
            payload.http.post('/api/parks/q/'+payload.id, {value:payload.q})
            .then(response => {                
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
    SET_PARKS: (state, data) => {
        state.parks = data
    },
    CLEAR_PARKS: (state) => {
        state.parks = []
    },
    SET_QS: (state, data) => {
        state.parkQueued = data
    },
    CLEAR_QS: (state) => {
        state.parkQueued = []
    },
}

export default {
    namespaced:true,
    state,
    getters,
    actions,
    mutations,
}