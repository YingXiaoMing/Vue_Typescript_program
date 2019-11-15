import Vue from 'vue';
import Router, {RouterOptions} from 'vue-router';
import { RouterItem } from '@/interface';

Vue.use(Router);

export const constantRouterMap: RouterItem[] & RouterOptions['routes'] = [
    {path: '/', redirect: '/home'},
    {path: '/login', name: 'login', component: () => import('../views/Other/login.vue')},
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
                path: 'remote',
                name: 'staffremote',
                icon: 'solution',
                component: () => import('../views/staff/remote'),
                meta: {key: 'staffremote', title: '人事调用'},
                children: [
                    {
                        path: 'srecord',
                        name: 'staffrecord',
                        isShow: true,
                        icon: 'file-text',
                        component: () => import('../views/staff/record/index.vue'),
                        meta: {key: 'staffrecord', title: '职位记录查询'},
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
                        path: 'serve',
                        name: 'staffserve',
                        isShow: true,
                        icon: 'crown',
                        component: () => import('../views/staff/serve/index.vue'),
                        meta: {key: 'staffrecord', title: '员工任职'},
                    }],
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
            {
                path: 'record',
                icon: 'layout',
                isShow: true,
                name: 'rewardRecord',
                component: () => import ('../views/reward/record/index.vue'),
                meta: { key: 'rewardRecord', title: '奖惩记录' },
            },
        ],
    },
    {
        path: '/attend',
        icon: 'dingding',
        name: 'attend',
        component: () => import('../views/attendance'),
        meta: { key: 'attend', title: '考勤操作'},
        children: [{
            path: 'attendAdd',
            icon: 'link',
            isShow: true,
            name: 'attendAdd',
            component: () => import('../views/attendance/add/index.vue'),
            meta: { key: 'attendAdd', title: '新增加班/请假/出差' },
        }, {
            path: 'attendRecord',
            icon: 'database',
            isShow: true,
            name: 'attendRecord',
            component: () => import('../views/attendance/record/index.vue'),
            meta: { key: 'attendRecord', title: '加班/请假/出差 记录' },
        }],
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
];

const routes = [ ...asyncRouterMap, ...constantRouterMap];

export default new Router({
    mode: 'hash',
    routes,
});







