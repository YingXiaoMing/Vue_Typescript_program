import { Component, Vue } from 'vue-property-decorator';
import './index.less';
import config from '@/utils/config';
import MenuList from './MenuList';
import types from '@/store/mutation-types';
import { asyncRouterMap } from "@/router/index";
@Component({
    components: {}
})
export default class Sidebar extends Vue {
    created() {
        console.log(types.SET_MENUDATA);
        console.log(this.$store);
        this.$store.dispatch('GetMenuData',asyncRouterMap);
    }
    render() {
        return (
            <div class='side-bar'>
                <div class='logo-wrap'>
                    <img alt='logo' src={config.logo}></img>
                    <h1 class='txt'>{config.name}</h1>
                </div>
                <MenuList/>
            </div>
        )
    }
}