import Cookie from 'js-cookie';

const TokenKey = 'vue_hr_tooken';

export const getToken = () => Cookie.get(TokenKey);

export const setToken = (token: string) => Cookie.set(TokenKey, token);

export const removeToken = () => Cookie.remove(TokenKey);
