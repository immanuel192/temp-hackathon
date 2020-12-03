import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import firebase from 'firebase/app'
import 'firebase/firestore'
import config from '@/config';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import App from './App.vue';

Vue.use(VueCompositionApi);
Vue.use(BootstrapVue);

firebase.initializeApp({
  apiKey: config.API_KEY,
  authDomain: `${config.PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${config.PROJECT_ID}.firebaseio.com`,
  projectId: config.PROJECT_ID,
  storageBucket: `${config.PROJECT_ID}.appspot.com`,
  messagingSenderId: config.SENDER_ID,
  appId: config.APP_ID,
});

export const db = firebase.firestore();

Vue.config.productionTip = true;

new Vue({
  render: (h) => h(App),
  provide: {
  },
}).$mount('#app');
