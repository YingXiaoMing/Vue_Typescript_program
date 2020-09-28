import Cookie from 'js-cookie';

const TokenKey = 'vue_hr_token';
const millisecond = new Date().getTime();
const expiresTime = new Date(millisecond + 60 * 1000 * 60 * 60);


const refreshTokenKey = 'vue_hr_refresh_token';


export const getAccessToken = () => Cookie.get(TokenKey);
export const setAccessToken = (token: string) => Cookie.set(TokenKey, token, {
    expires: expiresTime,
});
export const removeAccessToken = () => Cookie.remove(TokenKey);

export const getRefreshToken = () => Cookie.get(refreshTokenKey);
export const setRefreshToken = (token: string) => Cookie.set(refreshTokenKey, token);
export const removeRefreshToken = () => Cookie.remove(refreshTokenKey);

