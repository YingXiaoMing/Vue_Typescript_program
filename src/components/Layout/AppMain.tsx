
import { Component, Vue, Watch, Emit } from 'vue-property-decorator';
import Header from './Header';
import { Tabs } from 'ant-design-vue';
import Sidebar from './Sidebar';
import './AppMain.less';
import '@/style/global.less';
@Component({
    components: {
        'a-tabs': Tabs,
        'a-tab-pane': Tabs.TabPane,
    },
})
export default class AppMain extends Vue {

    public onTabs: any = '1';

    public tabList = [];

    @Watch('$route', { immediate: true, deep: true })
    public routeChange(to: any, from: any) {
        this.$store.dispatch('AddTabPane' , to.path);
    }

    @Emit()
    private tabChange(name: any) {
        this.tabList.forEach((item: any, indexs: number) => {
            if (item.name === name) {
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
    private render() {
        const { sidebar: {opened} , tabList, tabActiveKey, keepList } = this.$store.state.app;
        this.onTabs = tabActiveKey;
        this.tabList = tabList;
        return (
            <div class={`app-main ${opened ? '' : 'sideLayout'}`}>
                <Sidebar/>
                <div class='page-content'>
                    <Header/>
                    <a-tabs class='page-tabs' activeKey={this.onTabs}
                    on-change={this.tabChange} type='editable-card'
                    on-edit={this.onTabEdit}>
                        {
                            tabList.map((item: any, index: number) => <a-tab-pane
                            tab={item.meta.title} key={item.name}
                            closable={tabList.length > 1}>
                            </a-tab-pane>)
                        }
                    </a-tabs>
                    <div class='page-wrap'>
                        <keep-alive include={keepList}>
                            <router-view></router-view>
                        </keep-alive>
                    </div>
                </div>
            </div>
        );
    }
}
