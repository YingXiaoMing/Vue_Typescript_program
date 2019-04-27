import axios from 'axios';
import config from './config';
const service = axios.create({
    baseURL: config.baseUrl,
    timeout: 5000,
});

service.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        return Promise.reject(error);
    },
);


export default service;

