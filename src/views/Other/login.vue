<template>
    <div class="fillcontain login_page">
        <transition name="form-fade" mode="in-out">
            <section class="form_contianer">
                <!-- <div class="manage_tip">
                    <p>新感觉人事管理系统</p>
                </div> -->
                <div class='header'>
                    <img class='logo' alt='logo' :src="companyLogo"></img>
                    <span class='title'>{{companyName}}</span>
                </div>
                <a-form :form="form">
                    <a-form-item v-bind="formItemLayout">
                        <a-input placeholder="用户名" v-decorator="['username', { rules: [{required: true, message: '用户名不能为空'}] }]">
                            <a-icon type="user" slot="prefix" style="color: rgba(0,0,0,.25)"></a-icon>
                        </a-input>
                    </a-form-item>
                    <a-form-item v-bind="formItemLayout">
                        <a-input placeholder="密码" type="password" v-decorator="['password', { rules: [{required: true, message: '密码不能为空'}] }]">
                            <a-icon type="lock" slot="prefix" style="color: rgba(0,0,0,.25)"></a-icon>
                        </a-input>
                    </a-form-item>
                    <a-form-item v-bind="formItemLayout">
                        <a-button type="primary" class="submit_btn"
                        @click="submitForm" :loading="loginBtn"
                        :disabled="loginBtn">登陆</a-button>
                    </a-form-item>
                </a-form>
                <!-- <p class="tip">温馨提示：</p>
                <p class="tip">未登录过的新用户，自动注册</p> -->
            </section>
        </transition>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { Form, Input, Row, Icon, Button, message, notification } from 'ant-design-vue';
import Amplify, { Auth } from 'aws-amplify';
import { setAccessToken } from '@/utils/auth';
import config from '@/utils/config';
import URLSearchParams from 'url-search-params';
import awsConfig from '@/aws-exports';
import CryptoJS from 'crypto-js';
import _ from 'lodash';
import './login.less';
interface FormData {
    username: string;
    password: string;
}
@Component({
    components: {
        'a-form': Form,
        'a-form-item': Form.Item,
        'a-input': Input,
        'a-row': Row,
        'a-icon': Icon,
        'a-button': Button,
    },
})
export default class Login extends Vue {
    private formItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 0}},
        wrapperCol: { xs: {span: 24}, sm: {span: 24}},
    };
    private loginBtn: boolean = false;
    private companyName: string = config.name;
    private companyLogo: string = config.logo;
    private codeVerifier: string = '';
    private stateCode: string = '';
    private form: any;
    private $form: any;
    private $store: any;
    private $router: any;
    private created() {
        this.form = this.$form.createForm(this);
    }
    private LoginFromAuthorizationEndPoint() {
        const authorizationUrl = config.awsAuthDomain;
        const param = new URLSearchParams();
        this.generateCodeVerifier();
        this.generateStateCode();
        localStorage.setItem('stateCode', this.stateCode);
        localStorage.setItem('codeVerifier', this.codeVerifier);
        param.set('response_type', awsConfig.Auth.oauth.responseType);
        param.set('client_id', awsConfig.aws_user_pools_web_client_id);
        param.set('code_challenge_method', 'S256');
        param.set('code_challenge', this.generateCodeChallenge(this.codeVerifier));
        param.set('state', this.stateCode);
        param.set('redirect_uri', awsConfig.Auth.oauth.redirectSignIn);
        const newUrl = authorizationUrl + '?' + param.toString() + '&scope=' + _.join(awsConfig.Auth.oauth.scope, '+');
        // 替换页面上的URL
        window.location.assign(newUrl);
    }
    private generateStateCode() {
        this.stateCode = this.generateRandomString(32);
    }
    private generateCodeVerifier() {
        this.codeVerifier = this.generateRandomString(32);
    }
    private generateCodeChallenge(codeVerifier: string) {
        return this.base64URL(CryptoJS.SHA256(codeVerifier));
    }
    private base64URL(num: any) {
        return num.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    }
    private generateRandomString(length: number) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    private submitForm() {
        // this.LoginFromAuthorizationEndPoint();
        setAccessToken('123123');
        this.$store.dispatch('SetUsername', 'Admin');
        this.$router.push('/home');
        setTimeout(() => {
            notification.success({
                message: '欢迎',
                description: 'Admin, 欢迎回来',
            });
        }, 1000);
        // this.form.validateFields((err: any, values: FormData) => {
        //     if (!err) {
        //         this.loginBtn = true;
        //         Auth.signIn(values.username, values.password)
        //             .then((data: any) => {
        //                 this.loginBtn = false;
        //                 this.$store.dispatch('SetUsername', data.username);
        //                 setToken(data.signInUserSession.accessToken);
        //                 // this.$router.push('/home');
        //                 // setTimeout(() => {
        //                 //     notification.success({
        //                 //         message: '欢迎',
        //                 //         description: `${data.username}，欢迎回来`,
        //                 //     });
        //                 // }, 1000);
        //             })
        //             .catch((err: any) => {
        //                 switch (err.code) {
        //                     case 'UserNotConfirmedException':
        //                         message.error('用户尚未验证，请验证用户');
        //                         break;
        //                     case 'PasswordResetRequiredException':
        //                         message.error('密码错误');
        //                         break;
        //                     case 'NotAuthorizedException':
        //                         message.error('用户名尚未授权');
        //                         break;
        //                     case 'UserNotFoundException':
        //                         message.error('用户名不存在');
        //                         break;
        //                     default:
        //                         message.error(err.message);
        //                         break;
        //                 }
        //                 this.loginBtn = false;
        //             });
        //     }
        // });
    }
}
</script>

