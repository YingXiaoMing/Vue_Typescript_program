import { Component, Vue, Watch, Prop, Emit } from 'vue-property-decorator';
import { Breadcrumb, Badge, Dropdown, Icon, Menu  } from 'ant-design-vue';
import './index.less';
import { RouterItem } from '@/interface';
import { routeToArray } from '@/utils';
import UpdatePassword from '@/components/personal/UpdatePassword.vue';
import awsConfig from '@/aws-exports';
import URLSearchParams from 'url-search-params';
import _ from 'lodash';
import CryptoJS from 'crypto-js';
// import { Auth } from 'aws-amplify';
import AmazonCognitoIdentity from 'amazon-cognito-auth-js';
import { removeAccessToken, removeRefreshToken } from '@/utils/auth';
interface BreadItem {
    url: string;
    text: string;
    name: string;
}

@Component({
    components: {
        'a-breadcrumb': Breadcrumb,
        'a-breadcrumb-item': Breadcrumb.Item,
        'a-badge': Badge,
        'a-dropdown': Dropdown,
        'a-icon': Icon,
        'a-menu': Menu,
        'a-menu-item': Menu.Item,
        'a-menu-divider': Menu.Divider,
        'a-updatePassword': UpdatePassword,
    },
})
export default class Header extends Vue {
    private menuData: RouterItem[] = [];
    private breadList: BreadItem[] = [];
    private onIndex: number = 0;
    private https: string = 'https://';
    private $router: any;
    private $route: any;
    private $store: any;
    private codeVerifier: string = '';
    private codeChallenge: string = '';
    private modalVisible: boolean = false;
    @Watch('$route', { immediate: true, deep: true })
    private routeChange(to: any, from: any) {
        const toDeapth = routeToArray(to.path);
        this.onIndex = 0;
        this.breadList = [];
        this.routerBread(this.menuData, toDeapth.routeArr);
    }

    @Watch('menuData')
    private initRouteBread() {
        const toDeapth = routeToArray(this.$route.path);
        this.routerBread(this.menuData, toDeapth.routeArr);
    }

    @Emit()
    private routerBread(data: RouterItem[], toDeapth: string[]) {
        data.map((item: RouterItem) => {
            if (item.path === toDeapth[this.onIndex]) {
                this.breadList.push({
                    url: item.path,
                    text: item.meta.title ? item.meta.title : '',
                    name: item.name,
                });
                if (item.children && (toDeapth.length - 1) >= this.onIndex) {
                    this.onIndex += 1;
                    this.routerBread(item.children, toDeapth);
                }
            }
            return true;
        });
    }

    @Emit()
    private switchSidebar(): void {
        this.$store.dispatch('ToggleSideBar');
    }
    private menuClick(params: {item: any, key: string, keyPath: string[]}): void {
        const self = this;
        switch (params.key) {
            case 'userChangePassword':
                this.modalVisible = true;
                break;
            case 'userLogOut':
                // removeAccessToken();
                // removeRefreshToken();
                // this.SingOutFromSingoutEndPoint();
                // this.$store.dispatch('Logout');
                // removeToken();
                this.$router.push('/login');
                break;
            default:
                break;
        }
    }
    private SingOutFromSingoutEndPoint(): void {
        const LoginOutUrl = this.https + awsConfig.Auth.oauth.domain + '/logout';
        const param = new URLSearchParams();
        param.set('client_id', awsConfig.aws_user_pools_web_client_id);
        param.set('logout_uri', awsConfig.Auth.oauth.redirectSignOut);
        const newUrl =  LoginOutUrl + '?' + param;
        window.location.href = newUrl;
    }
    private SignHandler() {
        const authorizationUrl = this.https + awsConfig.Auth.oauth.domain + '/oauth2/authorize';
        const param = new URLSearchParams();
        this.generateCodeVerifier();
        param.set('response_type', awsConfig.Auth.oauth.responseType);
        param.set('client_id', awsConfig.aws_user_pools_web_client_id);
        // param.set('scope', _.join(awsConfig.Auth.oauth.scope, '+'));
        param.set('code_challenge_method', 'S256');
        param.set('code_challenge', this.generateCodeChallenge(this.codeVerifier));
        param.set('redirect_uri', awsConfig.Auth.oauth.redirectSignIn);
        const newUrl = authorizationUrl + '?' + param.toString() + '&scope=' + _.join(awsConfig.Auth.oauth.scope, '+');
        window.location.assign(newUrl);
    }
    private generateCodeChallenge(codeVerifier: string) {
        return this.base64URL(CryptoJS.SHA256(codeVerifier));
    }
    private base64URL(num: any) {
        return num.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    }
    private generateCodeVerifier() {
        this.codeVerifier = this.generateRandomString(32);
    }
    private generateRandomString(length: number) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    private cancelHandle() {
        this.modalVisible = false;
    }
    private render() {
        const { menuData , sidebar : { opened }, username } = this.$store.state.app;
        this.menuData = menuData;
        return(
            <div class={`header-wrap ${opened ? '' : 'sideLayout'}`}>
                <div class='header-left'>
                    <i class={`menu-btn iconfont-${!opened ? 'indent' : 'outdent'}`} on-click={this.switchSidebar}></i>
                    <transition-group name='breadcrumb'>
                        <a-breadcrumb class='header-bread' separator='/' key='breadcrumb-item'>
                                {this.breadList.map((item: BreadItem) => <a-breadcrumb-item key={item.name}
                                to={item.url ? { path: '/'} : null}>{item.text}</a-breadcrumb-item>)}
                        </a-breadcrumb>
                        </transition-group>
                </div>
                <ul class='header-menu'>
                    <li class='user'>
                        <a-dropdown>
                            <span class='ant-dropdown-link'>
                                <a-icon type='user'></a-icon>
                                <span class='name'>{username}</span>
                            </span>
                            <a-menu slot='overlay' on-click={this.menuClick}>
                                <a-menu-item key='userChangePassword'>修改密码</a-menu-item>
                                <a-menu-divider/>
                                <a-menu-item key='userLogOut'><font color='red'>退出登录</font></a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </li>
                </ul>
                <a-updatePassword visible={this.modalVisible} cancel={this.cancelHandle}/>
            </div>
        );
    }
}
