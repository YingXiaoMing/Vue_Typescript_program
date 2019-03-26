import types from '../mutation-types';
import { routerItem } from '@/interface';
const app = {
    state: {
        menuData: [{
            name: '新增员工',
            hidden: true,
            icon: 'user',
            children: [],
        }]
    },
    mutations: {
        [types.SET_MENUDATA]: (state: any, menuData: routerItem[]) => {
            state.menuData = menuData;
        }
    },
    actions: {
        GetMenuData: (context: any, menuData: routerItem[]) => {
            context.commit(types.SET_MENUDATA, menuData);
        }
    }
}

export default app;