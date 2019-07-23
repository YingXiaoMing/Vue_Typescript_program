import Vue from 'vue';
import App from '@/App';
import { Modal } from 'ant-design-vue';
import router , { asyncRouterMap } from '@/router';
import store from '@/store';
import Amplify, * as AmplifyModules from 'aws-amplify';
import { AmplifyPlugin } from 'aws-amplify-vue';
import awsconfig from './aws-exports';
import { getToken } from '@/utils/auth';
import config from '@/utils/config';
Vue.config.productionTip = false;
Amplify.configure(awsconfig);
Vue.use(AmplifyPlugin, AmplifyModules);
Vue.prototype.$confirm = Modal.confirm;
import './style/global.less';

const whiteList = ['/login'];
let flag: boolean = true;
router.beforeEach((to: any, from: any, next: any) => {
  console.log(getToken());
  if (getToken()) {
    const signed = store.state.app.signedIn;
    if (!store.state.app.menuData.length && flag && !signed) {
      flag = false;
      const toPath = config.noLoginList.indexOf(`#${to.path}`) > -1 ? '/' : to.path;
      store.dispatch('GetMenuData', asyncRouterMap);
      next({
        path: toPath,
      });
    }
    next();
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next('/login');
    }
  }
});

new Vue({
  router,
  store,
  render: (h: any) => h(App),
}).$mount('#app');
