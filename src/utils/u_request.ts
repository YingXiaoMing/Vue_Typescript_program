import axios from 'axios';
import config from './config';
import qs from 'qs';
import { getAccessToken } from './auth';
const service = axios.create({
    baseURL: config.baseUrl,
    headers: {'Content-Type': 'application/vnd.ais.hr.department+json',
              'Cache-Control': 'no-cache',
              'Authorization': 'bearer ' + getAccessToken(),
            },
    timeout: 5000,
});

service.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default service;
