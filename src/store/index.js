import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId: '123456',
    mapVersion: '',
  },
  getters: {
  },
  mutations: {
    setMapVersion(state, version){
      state.mapVersion = version;
    }
  },
  actions: {
  },
  modules: {
  }
})
