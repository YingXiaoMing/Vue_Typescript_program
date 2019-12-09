import axios from 'axios';
import config from './config';
import qs from 'qs';
const service = axios.create({
    baseURL: config.baseUrl,
    headers: {'Content-Type': 'application/vnd.ais.hr.department+json',
              'Cache-Control': 'no-cache'},
    timeout: 5000,
});

service.interceptors.request.use(
    (config) => {
        if (config.method === 'post') {
            config.data = qs.stringify(config.data);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

service.interceptors.response.use(
    (response) => {
        return response.data;
    },
);

export default service;
