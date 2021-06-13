const state = {
    access_token: localStorage.getItem("access_token") || '',
    status: '',
    hasLoadedOnce: false,
    profile: {},
    err: []
};

const getters = {
    isAuthenticated: state => !!state.access_token,
    status: state => state.status,
    err: state =>state.err,
    profile: state => state.profile,
};

const actions = {
    //to do reset password that came from the email (with token and session validity)
    //login from the system
    login: ({commit,dispatch}, payload) => {           
        return new Promise((resolve, reject) => {
            commit('AUTH_STATUS','logging in');
            
            payload.http.post('/api/login', {'email':payload.email, 'password': payload.password})
                .then(response => {
                    console.log('log')    
                    console.log(response)    
                    let token = response.data.access_token;
                    commit('AUTH_STATUS','login successful');
                    commit('AUTH_SUCCESS', token);
                    localStorage.setItem('access_token',token)
                    
                    dispatch('user',payload);

                    resolve(token);
                })
                .catch(errors => {  
                    let err = []
                    for(const k in errors.response.data)
                        err.push(errors.response.data[k])
                    
                    commit('snackbar/SET_SNACKBAR',{text:err.toString().split(',').join('\n'), visible: true, color: 'error'},{ root: true });            
                    commit('AUTH_ERROR', errors.response.data);           
                    reject(errors);
                })
        });
    },
    //logout from the system
    logout: ({commit},payload) => {
        commit('AUTH_STATUS','logging out');
        localStorage.clear();
        return new Promise((resolve, reject) => {
            payload.http.post('/api/logout')
                .then((response) => {
                    commit('AUTH_STATUS','logout successful');                    
                    commit('AUTH_LOGOUT');
                    commit('CLEAR_AUTH_USER')
                    commit('snackbar/SET_SNACKBAR',{text: response.data.message, visible: true, color: 'success'},{ root: true });            
                    resolve(response.data);
                })
                .catch((errors) => {
                    let err = []
                    for(const k in errors.response.data)
                        err.push(errors.response.data[k])

                    commit('AUTH_ERROR', err.toString().split(',').join('\n'));
                    reject(err);
                });
        })
    },
    //register a user
    create: ({commit},payload) => {

        return new Promise((resolve, reject) => {
            commit('AUTH_STATUS','registering user');

            payload.http.post('/api/register', payload)
                .then(response => {                  
                    commit('AUTH_STATUS','registration successful');
                    commit('snackbar/SET_SNACKBAR',{text: response.data.message, visible: true, color: 'success'},{ root: true });                  
                    resolve(response);                    
                })
                .catch(errors => {
                    let err = []
                    for(const k in errors.response.data)
                        err.push(errors.response.data[k])

                    commit('snackbar/SET_SNACKBAR',{text: err.toString().split(',').join('\n'), visible: true, color: 'error'},{ root: true });
                    commit('AUTH_ERROR', errors.response.data);
              
                    reject(err);
                })
        });
    },
    //request for the authenticated user details
    user: ({commit, dispatch},payload) => {
        commit('AUTH_STATUS','fetching user')
        return new Promise ((resolve, reject) => {
            payload.http.get('/api/user')
            .then((resp) => {
                commit('AUTH_USER', resp.data);
                resolve(resp.data)
            })
            .catch(errors => {
                let err = []
                for(const k in errors.response.data)
                    err.push(errors.response.data[k])

                commit('snackbar/SET_SNACKBAR',{text: err.toString().split(',').join('\n'), visible: true, color: 'error'},{ root: true });
                // if resp is unauthorized, logout, to
                dispatch('logout',payload)
                commit('AUTH_ERROR', errors.response.data);                
                reject(errors)
            })
        })
    },
};

const mutations = {
    AUTH_STATUS: (state, msg) => {
        state.status = msg;
    },
    AUTH_SUCCESS: (state, access_token) => {
        state.status = 'user authorized';
        state.access_token = access_token;        
        state.hasLoadedOnce = true;        
    },
    AUTH_ERROR: (state, err) => {     
        state.err = err;
        state.status = 'error';
        state.hasLoadedOnce = true;
    },
    AUTH_LOGOUT: (state) => {
        state.access_token = '';        
    },
    AUTH_USER: (state, resp) => {
        state.status = 'success';
        state.profile = resp
        state.hasLoadedOnce = true;
    },
    CLEAR_AUTH_USER: (state) => {
        state.profile = {}
    },
};

export default {
    namespaced:true,
    state,
    getters,
    actions,
    mutations,
}