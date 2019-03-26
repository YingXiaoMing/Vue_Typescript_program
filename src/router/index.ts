import Vue from 'vue';
import Router, {RouterOptions} from 'vue-router';
import { routerItem } from '@/interface';

Vue.use(Router);

export const constantRouterMap: routerItem[] & RouterOptions['routes'] = [
    {path: '/', redirect: '/home'}
]


export const asyncRouterMap: routerItem[] = [
    {
        path: '/staff',
        icon: 'user',
        name: '员工操作',
        component: () => import('../views/staff'),
        meta: { key: 'staff' },
        children: [
            {
                path: 'add',
                icon: 'add',
                name: '新增员工',
                component: () => import('@/views/staff/add'),
                meta: {key: 'staffadd'}
            }
        ]

    }
]













export default new Router({
    routes: constantRouterMap
});







