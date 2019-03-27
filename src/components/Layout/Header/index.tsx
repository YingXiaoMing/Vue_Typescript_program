import { Component, Vue, Watch, Prop, Emit } from 'vue-property-decorator';
import { Breadcrumb, Badge, Dropdown, Icon, Menu  } from 'ant-design-vue';
import './index.less';
import { routerItem } from '@/interface';
import { routeToArray } from '@/utils';

interface breadItem {
    url: string,
    text: string,
}

@Component({
    components:{
        'a-breadcrumb': Breadcrumb,
        'a-breadcrumb-item': Breadcrumb.Item,
        'a-badge': Badge,
        'a-dropdown': Dropdown,
        'a-icon': Icon,
        'a-menu': Menu,
        'a-menu-item': Menu.Item,
        'a-menu-divider': Menu.Divider,
    }
})
export default class Header extends Vue {
    menuData: routerItem[] = [];
    breadList: breadItem[] = [];
    onIndex: number = 0;


    @Watch('$route', { immediate: true, deep: true })
    routeChange(to: any, from: any) {
        const toDeapth = routeToArray(to.path);
        this.onIndex = 0;
        this.breadList = [];
        this.routerBread(this.menuData, toDeapth.routeArr);
    }

    @Watch('menuData')
    initRouteBread() {
        const toDeapth = routeToArray(this.$route.path);
        this.routerBread(this.menuData, toDeapth.routeArr);
    }

    @Emit()
    routerBread(data: routerItem[], toDeapth: string[]) {
        data.map((item: routerItem) => {
            if (item.path == toDeapth[this.onIndex]) {
                this.breadList.push({
                    url: item.path,
                    text: item.name ? item.name : ''
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
    switchSidebar(): void {
        this.$store.dispatch('ToggleSideBar');
    }

    render() {
        const { menuData , sidebar : { opened } } = this.$store.state.app;
        this.menuData = menuData;
        return(
            <div class='header-wrap'>
                <div class='header-left'>
                    <i class={`menu-btn iconfont-${!opened ? 'indent' : 'outdent'}`} on-click={this.switchSidebar}></i>
                    <a-breadcrumb class='header-bread' separator='/'>
                        {this.breadList.map((item: breadItem) => <a-breadcrumb-item
                        to={item.url ? { path: '/'} : null}>{item.text}</a-breadcrumb-item>)}
                    </a-breadcrumb>
                </div>
                <ul class='header-menu'>
                    <li>
                        <a-badge count={6} class='item'>
                            <i class='iconfont-email normal_icon'></i>
                        </a-badge>
                    </li>
                    <li><i class='iconfont-bell'></i></li>
                    <li class='user'>
                        <a-dropdown>
                            <span class='ant-dropdown-link'>
                                <a-icon type='user'></a-icon>
                                <span class='name'>admin</span>
                            </span>
                            <a-menu slot='overlay'>
                                <a-menu-item key='1'>个人中心</a-menu-item>
                                <a-menu-item key='2'>修改密码</a-menu-item>
                                <a-menu-divider></a-menu-divider>
                                <a-menu-item key='3'><font color='red'>退出登录</font></a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </li>
                </ul>
            </div>
        )
    }
}