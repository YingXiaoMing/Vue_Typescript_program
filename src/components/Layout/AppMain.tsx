
import { Component, Vue, Watch } from 'vue-property-decorator';
import Header from './Header';
import { Tabs } from 'ant-design-vue';
import Sidebar from './Sidebar';
import './AppMain.less';
@Component({
    components: {
        'a-tabs': Tabs,
        'a-tab-pane': Tabs.TabPane,
    }
})
export default class AppMain extends Vue {

    @Watch('$route', { immediate: true, deep: true })
    routeChange(to: any, from: any) {
        this.$store.dispatch('AddTabPane' , to.path);
    }

    render() {
        const { sidebar: {opened} } = this.$store.state.app;
        return (
            <div class={`app-main ${opened ? '' : 'sideLayout'}`}>
                <Sidebar/>
                <div class='page-content'>
                    <Header/>
                    <div class='page-wrap'>
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        )
    }
}