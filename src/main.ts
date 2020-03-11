import Vue from 'vue';
import App from '@/App.vue';
import { Modal } from 'ant-design-vue';
import router , { asyncRouterMap } from '@/router';
import store from '@/store';
import awsconfig from './aws-exports';
import Amplify from 'aws-amplify';
import { getAccessToken, setAccessToken, setRefreshToken } from '@/utils/auth';
import Antd from 'ant-design-vue';
import config from '@/utils/config';
import { getEmployeeToken } from '@/api/operation';
Vue.config.productionTip = false;
import _ from 'lodash';
Vue.prototype.$confirm = Modal.confirm;
import './style/global.less';
import 'ant-design-vue/dist/antd.css';

const whiteList = ['/login'];
const flag: boolean = true;
Vue.use(Antd);
const VerifyStateCode = (value: string): boolean => {
  const retrieveStateValue = localStorage.getItem('stateCode');
  if (value !== '' && retrieveStateValue === value) { return true; }
  return false;
};
// tslint:disable-next-line: only-arrow-functions
Vue.prototype.globalClick = function(callback: any) {
  const pageHtml: HTMLElement | null = document.getElementById('app');
  if (pageHtml && getAccessToken()) {
    pageHtml.addEventListener('click', (e: Event) => {
      callback();
    });
  }
};
router.beforeEach((to: any, from: any, next: any) => {
  // const code = to.query.code;
  // const stateCode = to.query.state;
  // if (code && VerifyStateCode(stateCode) || getAccessToken()) {
  //   if (code) {
  //     const newUrl = config.awsTokenDomain;
  //     getEmployeeToken(newUrl, {
  //       grant_type: 'authorization_code',
  //       client_id: awsconfig.aws_user_pools_web_client_id,
  //       code,
  //       redirect_uri: awsconfig.Auth.oauth.redirectSignIn,
  //       code_verifier: localStorage.getItem('codeVerifier'),
  //     }).then((res: any) => {
  //       setAccessToken(res.access_token);
  //       setRefreshToken(res.refresh_token);
  //       store.dispatch('GetMenuData', asyncRouterMap);
  //       next();
  //     }).catch(() => {
  //       next('/login');
  //     });
  //   }
  //   store.dispatch('GetMenuData', asyncRouterMap);
  //   next();
  // } else {
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     next();
  //   } else {
  //     next('/login');
  //   }
  // }

  // 测试版本 (暂时屏蔽掉congito登录)
  // const toPath = config.noLoginList.indexOf(`#${to.path}`) > -1 ? '/' : to.path;
  // store.dispatch('GetMenuData', asyncRouterMap);
  // next();
  // if (getAccessToken()) {
  //   const signed = store.state.app.signedIn;
  //   if (!store.state.app.menuData.length && flag && !signed) {
  //     const ToPath = config.noLoginList.indexOf(`#${to.path}`) > -1 ? '/' : to.path;
  //     store.dispatch('GetMenuData', asyncRouterMap);
  //     next({
  //       path: ToPath,
  //     });
  //   }
  //   next();
  // } else {
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     next();
  //   } else {
  //     next('/login');
  //   }
  // }

  // Xunit Test版本
  next();
});

new Vue({
  router,
  store,
  render: (h: any) => h(App),
}).$mount('#app');

