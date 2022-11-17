import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false


import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
Vue.use(ViewUI);

import request from './utils/request'
Vue.prototype.$request = request

import utils from './utils/utils'
Vue.prototype.$utils = utils

import DialogPlugin from './widget/dialog/DialogPlugin';
Vue.use(DialogPlugin);

import element from './libs/element';
Vue.use(element);

// import {
//   Tabs,
//   Tag,
// } from 'element-ui';
// Vue.use(Tabs);
// Vue.use(Tag);
// Vue.component(Tabs.name, Tabs);
// Vue.component(Tag.name, Tag);

//
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);

import Header from "./widget/Header";
Vue.component("my-header", Header);
import Condition from "@/widget/Condition";
Vue.component("Condition", Condition);
import PageTable from "@/widget/PageTable";
Vue.component("PageTable", PageTable);
import UploadImage from "@/widget/UploadImage";
Vue.component("UploadImage", UploadImage);

import VueParticles from 'vue-particles'
Vue.use(VueParticles)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
