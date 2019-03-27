import { Component, Vue } from 'vue-property-decorator';
import { Menu, Icon } from 'ant-design-vue';
import { routerItem } from '@/interface';
import './MenuList.less';
@Component({
    components: {
        'a-menu': Menu,
        'a-submenu': Menu.SubMenu,
        'a-icon': Icon,
        'a-menu-item': Menu.Item,
        'a-menu-item-group': Menu.ItemGroup
    }
})


export default class MenuList extends Vue {
    render() {
        const {menuData} = this.$store.state.app;
        console.log('玫瑰');
        console.log(menuData);
        return (
            <a-menu 
            mode='inline'
            class='left-menu'
            >
            {menuData ? this.renderMenu(menuData) : null}
            </a-menu>
        )
    }

    renderMenu(menuData: routerItem[], parentPath?: string): (JSX.Element | null)[] {
        return menuData.map((item: routerItem) => {
            if (item.children) {
                let isEmpty = true;
                item.children.forEach((items: routerItem) => {
                    if (!items.hidden) {
                        isEmpty = false;
                    }
                });
                if (isEmpty) {
                    return <a-menu-item
                        id={item.path}
                        key={`${item.path}`}>
                            <a-icon type={item.icon}></a-icon>
                            <span>{item.name}</span>
                        </a-menu-item>
                }
                console.log("11111");
                return <a-submenu id={item.path} key={item.path}>
                    <template slot='title'>
                        <a-icon type={item.icon}></a-icon>
                        <span>{item.name}</span>
                    </template>
                    {this.renderMenu(item.children, parentPath ? `${parentPath}/${item.path}` : item.path)}
                </a-submenu>
            }
            return <a-menu-item id={item.path}
            key={`${item.path}`}>
                <a-icon type={item.icon}></a-icon>
                <span>{item.name}</span>
            </a-menu-item>
        })
    }

}