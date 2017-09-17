import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    initData: {},
    currentArticle: {}
  },
  mutations: {
    setData (state, initData) {
      state.initData = initData;
    },
    setCurrentArticle (state, currentArticle) {
      state.currentArticle = currentArticle;
    }
  }
});

export default store;
