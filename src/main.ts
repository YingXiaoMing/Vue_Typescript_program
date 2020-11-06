import Vue from 'vue';
import App from '@/App.vue';
import { Modal } from 'ant-design-vue';
import router , { asyncRouterMap } from '@/router';
import store from '@/store';
import awsconfig from './aws-exports';
import Amplify from 'aws-amplify';
import { getAccessToken, setAccessToken } from '@/utils/auth';
import { setUserName } from '@/utils/cookie';
import Antd from 'ant-design-vue';
import config from '@/utils/config';
import { getEmployeeToken } from '@/api/operation';
import { getQueryObject } from '@/utils';

Vue.config.productionTip = false;
import _ from 'lodash';
Vue.prototype.$confirm = Modal.confirm;
import './style/global.less';
import 'ant-design-vue/dist/antd.css';
import { getUserName } from './utils/cookie';
import jwt from 'jsonwebtoken';
import astict from '@/utils/astrict';
import { setRefreshToken, setAccessExpiredToken } from './utils/auth';
const whiteList = ['/login'];
const flag: boolean = true;
Vue.use(Antd);
Vue.use(astict);
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
  const queryObj = getQueryObject();
  const accessToken = queryObj.id_token;
  const refreshToken = queryObj.refresh_token;
  if (accessToken && refreshToken) {
    const jwtData = jwt.decode(accessToken);
    setAccessExpiredToken(jwtData.exp);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  }
  if (getAccessToken()) {
    const jwtData = jwt.decode(getAccessToken());
    const userName = jwtData.name;
    // tslint:disable-next-line: variable-name
    const expire_time = jwtData.exp;
    const param = {
      access_token: getAccessToken(),
      refresh_token: '1',
      expires_in: expire_time,
    };
    store.dispatch('setToken', param);
    if (userName) {
      setUserName(userName);
    }
    store.dispatch('SetUsername', getUserName());
  } else {
    window.location.href = 'http://192.168.20.222';
    // console.log('想要成为rappstar吗??');
  }
  next();
});

new Vue({
  router,
  store,
  render: (h: any) => h(App),
}).$mount('#app');

