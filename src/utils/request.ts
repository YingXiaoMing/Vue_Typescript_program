import axios from 'axios';
import config from './config';
import _ from 'lodash';
const service = axios.create({
    baseURL: config.baseUrl,
    timeout: 5000,
});

service.interceptors.response.use(
    (response) => {
        if (_.has(response.headers, 'x-pagination')) {
            return response;
        }
        return response.data;
    },
    (error) => {
        return Promise.reject(error);
    },
);


export default service;

