import Vue from 'vue';
import App from '@/App';
import { Modal } from 'ant-design-vue';
import router , { asyncRouterMap } from '@/router';
import store from '@/store';
Vue.config.productionTip = false;
Vue.prototype.$confirm = Modal.confirm;
// import './style/global.less';
router.beforeEach((to, from, next) => {
  if (!store.state.app.menuData.length) {
    store.dispatch('GetMenuData', asyncRouterMap);
    next();
  }
  next();
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
