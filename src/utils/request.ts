import axios from 'axios';
import config from './config';
import _ from 'lodash';
import { message } from 'ant-design-vue';
import awsconfig from '@/aws-exports';
import { removeAccessToken, getRefreshToken, setAccessToken } from './auth';
import router from '@/router';
import { getEmployeeTokenByRrefreshToken } from '../api/operation';
const service = axios.create({
    baseURL: config.baseUrl,
    timeout: 5000,
    headers: {'Content-Type': 'application/vnd.ais.hr.department+json',
              'Cache-Control': 'no-cache'},
});

service.interceptors.response.use(
    (response) => {
        // 由于设置ETag，直接返回响应体信息
        return response;
    },
    (error) => {
        switch (error.response.status) {
            case 401:
                if (getRefreshToken()) {
                    const refreshToken = getRefreshToken();
                    const newUrl = config.awsTokenDomain;
                    getEmployeeTokenByRrefreshToken(newUrl, {
                        grant_type: 'refresh_token',
                        refresh_token: refreshToken,
                        client_id: awsconfig.aws_user_pools_web_client_id,
                    }).then((res: any) => {
                        // 刷新token
                        setAccessToken(res.access_token);
                        // 再次发送用户上次的请求
                        const token = res.token_type + res.access_token;
                        const Config = error.response.config;
                        Config.header.Authorization = token;
                        const request = axios.request(Config);
                        return request;
                    });
                } else {
                    message.error('登录过期请重新登录！');
                    removeAccessToken();
                    router.push({
                        name: 'login',
                    });
                }
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

