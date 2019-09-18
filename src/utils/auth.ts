import Cookie from 'js-cookie';

const TokenKey = 'vue_hr_token';

const refreshTokenKey = 'vue_hr_refresh_token';


export const getAccessToken = () => Cookie.get(TokenKey);
export const setAccessToken = (token: string) => Cookie.set(TokenKey, token);
export const removeAccessToken = () => Cookie.remove(TokenKey);

export const getRefreshToken = () => Cookie.get(refreshTokenKey);
export const setRefreshToken = (token: string) => Cookie.set(refreshTokenKey, token);
export const removeRefreshToken = () => Cookie.remove(refreshTokenKey);

