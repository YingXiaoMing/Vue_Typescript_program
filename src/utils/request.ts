import axios from 'axios';

const service = axios.create({
    baseURL: 'http://192.168.18.28/api/hr',
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
