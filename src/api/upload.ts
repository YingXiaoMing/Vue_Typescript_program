import request from '@/utils/request';

export const uploadAvatar = (id: string, params: any) =>
    request.post('/employee/' + id + '/PortraitImage', params);
