import { Component, Vue, Watch } from 'vue-property-decorator';
import { Menu, Icon } from 'ant-design-vue';
import { RouterItem } from '@/interface';
import { routeToArray } from '@/utils';
import './MenuList.less';
import _ from 'lodash';
@Component({
    components: {
        'a-menu': Menu,
        'a-submenu': Menu.SubMenu,
        'a-icon': Icon,
        'a-menu-item': Menu.Item,
        'a-menu-item-group': Menu.ItemGroup,
    },
})
export default class MenuList extends Vue {
    public keys: string[] = [];
    private $store: any;
    private $router: any;
    @Watch('$route', { immediate: true, deep: true })
    public routeChange(to: any, from: any) {
        this.keys = routeToArray(to.path).routeArr;
    }

    public render() {
        const {menuData, sidebar: { opened } } = this.$store.state.app;
        return (
            <div class='R_Menu'>
                <a-menu
                inlineCollapsed={!opened}
                mode='inline'
                class='left-menu'
                selectedKeys= {this.keys}
                on-click={(params: {item: any, key: string, keyPath: string[]}) => {
                    const keyPath = params.keyPath.reverse();
                    console.log(keyPath.join('/'));
                    this.openPage(keyPath.join('/'));
                }}
                >
                {menuData ? this.renderMenu(menuData) : null}
                </a-menu>
            </div>
        );
    }

    public renderMenu(menuData: RouterItem[], parentPath?: string): Array<JSX.Element | null> {
        return menuData.map((item: RouterItem) => {
            if (item.children) {
                let isEmpty = true;
                item.children.forEach((items: RouterItem) => {
                    if (!items.hidden) {
                        isEmpty = false;
                    }
                });
                if (isEmpty) {
                    return <a-menu-item
                        id={item.path}
                        key={`${item.path}`}>
                            <a-icon type={item.icon}></a-icon>
                            <span>{item.meta.title}</span>
                        </a-menu-item>;
                }
                return <a-submenu id={item.path} key={item.path}>
                    <template slot='title'>
                        <a-icon type={item.icon}></a-icon>
                        <span>{item.meta.title}</span>
                    </template>
                    {this.renderMenu(item.children, parentPath ? `${parentPath}/${item.path}` : item.path)}
                </a-submenu>;
            }
            if (item.isShow) {
                return <a-menu-item id={item.path}
                key={`${item.path}`}>
                    <a-icon type={item.icon}></a-icon>
                    <span>{item.meta.title}</span>
                </a-menu-item>;
            }
            return null;
        });
    }

    public openPage(path: string) {
        if (_.isEqual(path, '/staff/staffadd')) {
            this.$store.dispatch('changeEmployeeStatus', 1);
            this.$store.dispatch('changeNewEmployeeStatus', 1);
        } else if (_.isEqual(path, '/staff/staffEdit')) {
            this.$store.dispatch('changeEmployeeStatus', 3);
        }
        this.$router.push(path);
    }

}
