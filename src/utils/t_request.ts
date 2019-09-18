import axios from 'axios';
import qs from 'qs';
const service = axios.create({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8;' },
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
