import {
  Tabs,
  Tag,
  Image,
  Tree
} from 'element-ui';
import Vue from 'vue';

// Vue.use(Tabs);
// Vue.use(Tag);

const element = {
  install: (Vue) => {
    Vue.use(Tabs);
    Vue.use(Tag);
    Vue.use(Image);
    Vue.use(Tree);
  }
};


export default element;
