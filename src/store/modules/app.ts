import types from '../mutation-types';
import { RouterItem } from '@/interface';
import { routeToArray } from '@/utils';
import router from '@/router';
import _ from 'lodash';


function findMenu(
    data: any,
    url: string[],
    tabList: any[],
    tabActiveKey: string,
    params?: string,
    query?: any,
    key?: string[],
) {
    let result: any = { tabList, tabActiveKey };
    data.forEach((item: any) => {
        if (url.indexOf(item.path.replace(/\/:\w+/g, '')) > -1) {
            if (!key) {
                key = [];
            }
            key.push(item.meta.key);
            if (url.length === 1) {
                result.tabList.push({
                    ...item,
                    params,
                    query,
                });
                result.tabActiveKey = item.name;
            } else {
                url.shift();
                result = findMenu(item.children, url, tabList, tabActiveKey, params, query, key);
            }
        }
    });
    result.key = key;
    return result;
}


const app = {
    state: {
        menuData: [],
        sidebar: {
            opened: true,
        },
        tabList: [],
        tabActiveKey: '',
        keepList: [],
        signedIn: false,
        username: 'admin',
    },
    mutations: {
        [types.SET_MENUDATA]: (state: any, menuData: RouterItem[]) => {
            state.menuData = menuData;
        },
        [types.TOGGLE_SIDEBAR]: (state: any) => {
            state.sidebar.opened = !state.sidebar.opened;
        },
        [types.TAB_CHANGE]: (state: any, tabList: any) => {
            state.tabList = tabList.tabList;
            state.tabActiveKey = tabList.tabActiveKey;
        },
        [types.KEEP_CHANGE]: (state: any, keepList: any) => {
            state.keepList = keepList;
        },
        [types.SET_LOGINSTATUS]: (state: any, loginStatus: boolean) => {
            state.signedIn = loginStatus;
        },
        [types.LOGOUT]: (state: any) => {
            state.signedIn = false;
            state.username = '';
        },
        [types.SET_USERNAME]: (state: any, username: string) => {
            state.username = username;
        },
    },
    actions: {
        GetMenuData: (context: any, menuData: RouterItem[]) => {
            context.commit(types.SET_MENUDATA, menuData);
        },
        ToggleSideBar: (context: any) => {
            context.commit(types.TOGGLE_SIDEBAR);
        },
        SetSignedStatus: (context: any, signed: boolean) => {
            context.commit(types.SET_LOGINSTATUS, signed);
        },
        AddKeep: (context: any, name: string[]) => {
            const { keepList } = context.state;
            name.forEach((item: string) => {
                if (keepList.indexOf(item) === -1) {
                    keepList.push(item);
                }
            });
            context.commit(types.KEEP_CHANGE, keepList);
        },
        RemoveKeep: (context: any, name: string) => {
            const newKeepList = context.state.keepList.filter((item: string) => item !== name);
            context.commit(types.KEEP_CHANGE, newKeepList);
        },
        Logout: (context: any) => {
            context.commit(types.LOGOUT);
        },
        SetUsername: (context: any, username: string) => {
            context.commit(types.SET_USERNAME, username);
            context.commit(types.SET_LOGINSTATUS, true);
        },
        AddTabPane: (context: any, url: string) => new Promise((resolve, rejct) => {
            const { menuData, tabList, tabActiveKey } = context.state;
            let resultData = { tabList, tabActiveKey, key: [] };
            let hasMenu = false;
            const ArrPath = routeToArray(url);
            tabList.map((item: any) => {
                if (ArrPath.routeArr.indexOf(item.path.replace(/\/:\w+/g, '')) > -1) {
                    resultData.tabActiveKey = item.name;
                    hasMenu = true;
                    return false;
                }
                return item;
            });
            if (!hasMenu) {
                console.log('添加路由');
                resultData = findMenu(menuData, ArrPath.routeArr, tabList, tabActiveKey, ArrPath.params);
                if (resultData.tabActiveKey && resultData.key) {
                    context.dispatch('AddKeep', resultData.key);
                }
            }
            context.commit(types.TAB_CHANGE, resultData);
            resolve(true);
        }),
        TabChange: (context: any, name: string) => {
            const { tabList } = context.state;
            const resultData = { tabList, tabActiveKey: name };
            context.commit(types.TAB_CHANGE, resultData);
        },
        RemoveTab: (context: any, name: string) => {
            let { tabList } = context.state;
            const resultData = { tabList: [], tabActiveKey: '' };
            tabList = tabList.filter((item: any, index: number) => {
                if (item.name === name) {
                    resultData.tabActiveKey = index ? tabList[index - 1].name : tabList[index + 1].name;
                    context.dispatch('RemoveKeep', name);
                    if (_.isEqual(resultData.tabActiveKey, 'staffadd')) {
                        context.dispatch('changeEmployeeStatus', 1);
                    } else if (_.isEqual(resultData.tabActiveKey, 'staff-edit')) {
                        context.dispatch('changeEmployeeStatus', 2);
                    }
                    router.push({name: resultData.tabActiveKey});
                    return false;
                }
                return true;
            });
            resultData.tabList = tabList;
            context.commit(types.TAB_CHANGE, resultData);
        },
    },
};

export default app;
