// tslint:disable-next-line: no-var-requires
const Logo = require('../assets/logo.jpg');
const config = {
    logo: Logo,
    name: '新感觉人事管理系统',
    baseUrl: 'http://192.168.18.28:80/api/hr',
    noLoginList: ['#/login'],
    openPages: ['/login'],
};
export default config;
