import axios from 'axios';
import config from './config';
import _ from 'lodash';
import { message } from 'ant-design-vue';
import awsconfig from '@/aws-exports';
import { getAccessToken } from './auth';
import router from '@/router';
import { getEmployeeTokenByRrefreshToken } from '../api/operation';
const service = axios.create({
    baseURL: config.baseUrl,
    timeout: 5000,
    headers: {'Content-Type': 'application/vnd.ais.hr.department+json',
              'Cache-Control': 'no-cache',
              'Authorization': 'bearer ' + getAccessToken(),
            },
});

// service.defaults.headers.common[] =
service.interceptors.response.use(
    (response) => {
        // 由于设置ETag，直接返回响应体信息
        return response;
    },
    (error) => {
        switch (error.response.status) {
            case 401:
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

