import Cookie from 'js-cookie';
import { now, remove } from 'lodash';

const TokenKey = 'vue_hr_token';


import moment from 'moment';
const refreshTokenKey = 'vue_hr_refresh_token';
const TokenExpiredKey = 'vue_hr_token_EXPIRED';


export const getAccessToken = () => {
    const temp = window.localStorage.getItem(TokenKey);
    const temp_es = window.localStorage.getItem(TokenExpiredKey);

    if (temp && temp_es) {
        // tslint:disable-next-line: radix
        const expired = + temp_es;
        const nowTime =  + moment().format('X').valueOf();
        if (nowTime >= expired) {
            removeAccessToken();
            return false;
        }
        return temp;
    } else {
        return false;
    }
};
export const setAccessToken = (token: string) => {
    window.localStorage.setItem(TokenKey, token);
};
export const setAccessExpiredToken = (num: number) => {
    window.localStorage.setItem(TokenExpiredKey, JSON.stringify(num));
}
export const removeAccessToken = () => {
    window.localStorage.removeItem(TokenKey);
    window.localStorage.removeItem(TokenExpiredKey);
};

export const getRefreshToken = () => Cookie.get(refreshTokenKey);
export const setRefreshToken = (token: string) => Cookie.set(refreshTokenKey, token);
export const removeRefreshToken = () => Cookie.remove(refreshTokenKey);

