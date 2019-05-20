import axios from 'axios';
import config from './config';
import _ from 'lodash';
import { message } from 'ant-design-vue';
const service = axios.create({
    baseURL: config.baseUrl,
    timeout: 5000,
    headers: {'Content-Type': 'application/vnd.ais.hr.department+json'},
});

service.interceptors.response.use(
    (response) => {
        if (_.has(response.headers, 'x-pagination')) {
            return response;
        }
        return response.data;
    },
    (error) => {
        // message.error();
        const data = error.response.data;
        message.error(data);
        return Promise.reject(error);
    },
);


export default service;

