import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import store from './vuex/index.js';

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  data: {
    eventHub: new Vue()
  },
  components: { App }
});
