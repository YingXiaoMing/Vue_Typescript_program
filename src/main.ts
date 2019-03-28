import Vue from 'vue';
import App from '@/App';
import router ,{asyncRouterMap} from '@/router';
import store from '@/store';
import './style/global.less';
import { asyncRouterMap } from './router';
Vue.config.productionTip = false;


router.beforeEach((to, from, next) => {
  if (!store.state.app.menuData.length) {
    store.dispatch('GetMenuData',asyncRouterMap);
    next();
  }
  next();
})






new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
