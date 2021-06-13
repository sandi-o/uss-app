const state = {   
    attributes: {
        visible: false,
        text: '',
        timeout: 6000,
        multiline: false,
    },
};

const getters = {
    attributes: state => state.attributes
};

const mutations = {
    SNACKBAR_STATUS: (state, status) => {
        state.status = status
    },
    SET_SNACKBAR: (state, payload) => {
        state.attributes.text = payload.text
        state.attributes.multiline = (payload.text.length > 50) ? true : false

        if (payload.multiline) {
            state.attributes.multiline = payload.multiline
        }

        if (payload.color) {
            state.attributes.color = payload.color
        }
        
        if (payload.timeout) {
          state.attributes.timeout = payload.timeout
        }
  
        state.attributes.visible = payload.visible

    },
    CLEAR_SNACKBAR: (state) => {
        state.attributes.visible = false
        state.attributes.multiline = false
        state.attributes.timeout = 6000
        state.attributes.text = ''
    }
}

export default {
    namespaced:true,
    state,
    getters,
    mutations,
}