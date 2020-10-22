import axios from 'axios';
import config from './config';
import _ from 'lodash';
import { message } from 'ant-design-vue';
import store from '@/store';
import awsconfig from '@/aws-exports';
import router from '@/router';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import { getRefreshToken, setAccessToken, setAccessExpiredToken, 
    getAccessToken, setRefreshToken} from '@/utils/auth';
const service = axios.create({
    baseURL: config.baseUrl,
    timeout: 5000,
    headers: {
            'Content-Type': 'application/vnd.ais.hr.department+json',
              'Cache-Control': 'no-cache',
              'Authorization': 'bearer ' + getAccessToken(),
            },
});
// 控制正在刷新的标记
let isRefreshing = false;
let subscribers : any[] = [];
// 刷新token后将缓存的接口重新请求一次
const onAccessTokenFetched = (newToken: any) => {
    subscribers.forEach((callback) => {
        callback(newToken);
    });
};
const addSubscriber = (callback: any) => {
    subscribers.push(callback);
};
const isTokenExpired = () => {
    const expireTime = store.state.app.expires_time;
    if (expireTime) {
        const nowTime =  + moment().format('X').valueOf();
        const willExpired = (expireTime - nowTime) < 60; // 最后30秒的时候刷新token
        return willExpired;
    }
    return true;
}
service.interceptors.request.use(
    (config: any) => {
        // 判断token是否快过期
        if (isTokenExpired()) {
            // 设置队列防止插队查询数据
            if (!isRefreshing) {
                isRefreshing = true;
                let vData: {refreshToken?: string} = {refreshToken: ''};
                vData.refreshToken = getRefreshToken() || '';
                axios({
                    url: 'http://192.168.20.222:8001/api/Account/RefreshTokenAuth',
                    method: 'post',
                    data: vData,
                    headers: {
                        'Authorization': 'Bearer ' + getAccessToken(),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }).then((res: any) => {
                    isRefreshing = false;
                    onAccessTokenFetched(res.data.idToken);
                    const jwtData = jwt.decode(res.data.idToken);
                    setAccessExpiredToken(jwtData.exp);
                    setAccessToken(res.data.idToken);
                    setRefreshToken(res.data.refreshToken);
                }).catch(() => {
                    isRefreshing = false;
                });
            }
            // 缓存其他接口
            const retryRequest = new Promise((resolve) => {
                // 等token刷新成功后地调用里面的接口，才可以去请求数据
                addSubscriber((newToken: any) => {
                    config.headers.Authorization = 'bearer ' + newToken;
                    config.url = config.url.replace(config.baseURL, '');
                    resolve(config);
                });
            });
            return retryRequest;
        }
        return config;
    }
);
// service.defaults.headers.common[] =
service.interceptors.response.use(
    (response) => {
        // 由于设置ETag，直接返回响应体信息
        return response;
    },
    (error) => {
        switch (error.response.status) {
            case 401:
                message.error('赶紧重新登录');
                console.log('跳转到401页面');
                break;
            default:
                const newData = error.response.data;
                const errMsg = _.values(newData);
                message.error(errMsg[0]);
                break;
        }
        return Promise.reject(error);
    },
);


export default service;

