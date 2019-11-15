
import { Component, Vue, Watch, Emit } from 'vue-property-decorator';
import Header from './Header';
import { Tabs, Layout } from 'ant-design-vue';
import _ from 'lodash';
import Sidebar from './Sidebar';
import './AppMain.less';
import config from '@/utils/config';
import SkinToolBox from './SkinToolbox/index.vue';
import jwt_decode from 'jwt-decode';
import awsconfig from '@/aws-exports';
import jsonpatch from 'fast-json-patch';
import { getEmployeeToken } from '@/api/operation';
import { setAccessToken, getAccessToken, setRefreshToken, getRefreshToken } from '../../utils/auth';
@Component({
    components: {
        'a-tabs': Tabs,
        'a-tab-pane': Tabs.TabPane,
        'a-layout-content': Layout.Content,
        'a-layout': Layout,
        'a-skin-box': SkinToolBox,
    },
})
export default class AppMain extends Vue {
    public onTabs: string = '1';
    public tabList: any[] = [];
    private $store: any;
    private $router: any;
    private $route: any;
    private globalClick: any;
    @Watch('$route', { immediate: true, deep: true })
    public routeChange(to: any, from: any) {
        this.$store.dispatch('AddTabPane' , to.path);
    }

    @Emit()
    private tabChange(name: any) {
        this.tabList.forEach((item: any, indexs: number) => {
            if (item.name === name) {
                if (_.isEqual(name, 'staffadd')) {
                    this.$store.dispatch('changeEmployeeStatus', 1);
                } else if (_.isEqual(name, 'staff-edit')) {
                    this.$store.dispatch('changeEmployeeStatus', 3);
                }
                this.$router.push({ name: item.name});
                this.$store.dispatch('TabChange', item.name);
            }
        });
    }

    @Emit()
    private onTabEdit(targetKey: string, action: string) {
        if (action === 'remove') {
            this.$store.dispatch('RemoveTab', targetKey);
        }
    }
    private mounted() {
        // this.globalClick(() => {
        //     const userToken = getAccessToken();
        //     if (userToken) {
        //         const decoded: any = jwt_decode(userToken);
        //         const tokenDate = decoded.exp;
        //         if (this.compareWithTokenDate(tokenDate)) {
        //             // 重新获取token
        //             const newUrl = config.awsTokenDomain;
        //             getEmployeeToken(newUrl, {
        //                 grant_type: 'refresh_token',
        //                 client_id: awsconfig.aws_user_pools_web_client_id,
        //                 refresh_token: getRefreshToken(),
        //               }).then((res: any) => {
        //                 setAccessToken(res.access_token);
        //               }).catch(() => {
        //                 this.$router.push({
        //                     name: 'login',
        //                 });
        //               });
        //         }
        //     }
        // });
    }
    private compareWithTokenDate(tokenDate: number): boolean {
        if ((new Date().getTime() / 1000 +  15 * 60) >= tokenDate) {
            return true;
        }
        return false;
    }
    private render() {
        const { sidebar: {opened} , tabList, tabActiveKey, keepList } = this.$store.state.app;
        this.onTabs = tabActiveKey;
        this.tabList = tabList;
        if (config.openPages.indexOf(this.$route.path) > -1) {
            return (
                <div class='app-one'>
                    <router-view></router-view>
                </div>
            );
        }
        return (
            <div class={`app-main ${opened ? '' : 'sideLayout'}`}>
                <Sidebar/>
                <a-layout class={`page-content ${opened ? '' : 'sideLayout'}`}>
                    <Header/>
                    <a-layout-content class='fixed-header-content'>
                        <a-tabs class='page-tabs' activeKey={this.onTabs}
                        on-change={this.tabChange} type='editable-card'
                        on-edit={this.onTabEdit} hide-add={true}>
                            {
                                tabList.map((item: any, index: number) => <a-tab-pane
                                tab={item.meta.title} key={item.name}
                                closable={tabList.length > 1}>
                                </a-tab-pane>)
                            }
                        </a-tabs>
                        <div class='page-wrap' id='page-wrap'>
                            <keep-alive include={keepList} exclude='staffadd'>
                                <router-view></router-view>
                            </keep-alive>
                        </div>
                    </a-layout-content>
                </a-layout>
                <a-skin-box></a-skin-box>
            </div>
        );
    }
}
