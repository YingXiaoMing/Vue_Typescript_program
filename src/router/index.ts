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
        name: 'staff',
        component: () => import('../views/staff'),
        meta: { key: 'staff', title: '员工操作' },
        children: [
            {
                path: 'add',
                icon: 'user-add',
                name: 'staffadd',
                component: () => import('../views/staff/add'),
                meta: {key: 'staffadd', title: '新增员工'}
            },
            {
                path: 'search',
                icon: 'idcard',
                name: 'staffsearch',
                component: () => import('../views/staff/search'),
                meta: {key: 'staffsearch', title: '查询员工资料'}
            }
        ]
    }
]













export default new Router({
    routes: [...constantRouterMap,...asyncRouterMap]
});







