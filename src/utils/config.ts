import awsConfig from '@/aws-exports';
// tslint:disable-next-line: no-var-requires
const Logo = require('../assets/logo.jpg');
const config = {
    logo: Logo,
    name: '新感觉人事管理系统',
    baseUrl: 'https://192.168.16.47:5001/api/hr',
    noLoginList: ['#/login'],
    openPages: ['/login'],
    awsAuthDomain: 'https://' + awsConfig.Auth.oauth.domain + '/oauth2/authorize',
    awsTokenDomain: 'https://' + awsConfig.Auth.oauth.domain + '/oauth2/token',
};
export default config;
