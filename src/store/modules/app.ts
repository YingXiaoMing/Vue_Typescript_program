import types from '../mutation-types';
import { routerItem } from '@/interface';
const app = {
    state: {
        menuData: [{
            name: '新增员工',
            hidden: true,
            icon: 'user',
            children: [],
        }],
        sidebar: {
            opened: true,
        },
        tabList: []

    },
    mutations: {
        [types.SET_MENUDATA]: (state: any, menuData: routerItem[]) => {
            state.menuData = menuData;
        },
        [types.TOGGLE_SIDEBAR]: (state: any) => {
            state.sidebar.opened = !state.sidebar.opened;
        },
        [types.TAB_CHANGE]: (state: any, tabList: any) => {
            state.tabList = tabList;
        },
    },
    actions: {
        GetMenuData: (context: any, menuData: routerItem[]) => {
            context.commit(types.SET_MENUDATA, menuData);
        },
        ToggleSideBar: (context: any) => {
            context.commit(types.TOGGLE_SIDEBAR);
        },
        AddTabPane: (context: any, url: string) => new Promise((resolve, rejct) => {
            resolve(true);
        })
    }
}

export default app;