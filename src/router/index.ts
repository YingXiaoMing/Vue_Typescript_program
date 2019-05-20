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
            {
                path: 'dismiss',
                name: 'staff-dismiss',
                isShow: true,
                icon: 'tag',
                component: () => import('../views/staff/dismiss/index.vue'),
                meta: {key: 'staffdismiss', title: '员工撤复职'},
            },
            {
                path: 'record',
                name: 'staff-record',
                isShow: true,
                icon: 'file-text',
                component: () => import('../views/staff/record/index.vue'),
                meta: {key: 'staffrecord', title: '职位操作查询'},
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
            {
                path: 'department',
                icon: 'cluster',
                isShow: true,
                name: 'department',
                component: () => import('../views/sys/department/index.vue'),
                meta: {key: 'department', title: '部门管理'},
            },
        ],
    },
    {
        path: '/reward',
        icon: 'edit',
        name: 'reward',
        component: () => import('../views/reward'),
        meta: { key: 'reward', title: '奖惩操作' },
        children: [
            {
                path: 'addReward',
                icon: 'trophy',
                isShow: true,
                name: 'addReward',
                component: () => import('../views/reward/add/index.vue'),
                meta: { key: 'addReward', title: '新增奖惩' },
            },
        ],
    },
];













export default new Router({
    routes: [...constantRouterMap, ...asyncRouterMap],
});







