import request from '@/utils/request';

export const getWorkLocation = () =>
    request({
        url: '/workingLocation',
        method: 'get',
    });

export const getEmploymentSource = () =>
    request({
        url: '/employmentSource',
        method: 'get',
    });

