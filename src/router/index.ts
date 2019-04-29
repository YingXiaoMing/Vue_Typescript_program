import Vue from 'vue';
import Router, {RouterOptions} from 'vue-router';
import { RouterItem } from '@/interface';

Vue.use(Router);

export const constantRouterMap: RouterItem[] & RouterOptions['routes'] = [
    {path: '/', redirect: '/home'},
];


export const asyncRouterMap: RouterItem[] = [
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
                isShow: true,
                component: () => import('../views/staff/add/index.vue'),
                meta: {key: 'staffadd', title: '新增员工'},
            },
            {
                path: 'search',
                icon: 'idcard',
                name: 'staffsearch',
                isShow: true,
                component: () => import('../views/staff/search/index.vue'),
                meta: {key: 'staffsearch', title: '查询员工资料'},
            },
            {
                path: 'edit',
                name: 'staff-edit',
                isShow: false,
                icon: 'idcard',
                component: () => import('../views/staff/edit/index.vue'),
                meta: {key: 'staffedit', title: '编辑员工资料'},
            },
            {
                path: 'transfer',
                name: 'staff-transfer',
                isShow: true,
                icon: 'team',
                component: () => import('../views/staff/transfer/index.vue'),
                meta: {key: 'stafftransfer', title: '员工调离职'},
            },
        ],
    },
    {
        path: '/sys',
        icon: 'layout',
        name: 'sys',
        component: () => import('../views/sys'),
        meta: { key: 'sys', title: '系统操作' },
        children: [
            {
                path: 'basic',
                icon: 'setting',
                isShow: true,
                name: 'basic',
                component: () => import('../views/sys/basic'),
                meta: {key: 'basic', title: '基础资料设置'},
            },
        ],
    },
];













export default new Router({
    routes: [...constantRouterMap, ...asyncRouterMap],
});







