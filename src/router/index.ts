import Vue from 'vue';
import Router, {RouterOptions} from 'vue-router';
import { RouterItem } from '@/interface';
import { lazyLoadView } from '@/utils';
Vue.use(Router);

export const constantRouterMap: RouterItem[] & RouterOptions['routes'] = [
    {path: '/', name: 'home', redirect: '/home'},
    {path: '/login', name: 'login', component: () => import('../views/Other/login.vue')},
];

export const asyncRouterMap: RouterItem[] = [
    {
        path: '/staff',
        icon: 'user',
        name: 'staff',
        component: lazyLoadView('staff'),
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
                name: 'staffSearch',
                isShow: true,
                component: () => import('../views/staff/search/index.vue'),
                meta: {key: 'staffSearch', title: '查询员工资料'},
            },
            {
                path: 'edit',
                name: 'staffEdit',
                isShow: false,
                icon: 'idcard',
                component: () => import('../views/staff/edit/index.vue'),
                meta: {key: 'staffEdit', title: '编辑员工资料'},
            },
            {
                path: 'remote',
                name: 'staffremote',
                icon: 'solution',
                component: () => import('../views/staff/remote'),
                meta: {key: 'staffremote', title: '人事调用'},
                children: [
                    {
                        path: 'serve',
                        name: 'staffServe',
                        isShow: true,
                        icon: 'crown',
                        component: () => import('../views/staff/serve/index.vue'),
                        meta: {key: 'staffServe', title: '员工任职'},
                    },
                    {
                        path: 'transfer',
                        name: 'stafftransfer',
                        isShow: true,
                        icon: 'team',
                        component: () => import('../views/staff/transfer/index.vue'),
                        meta: {key: 'stafftransfer', title: '员工调离职'},
                    },
                    {
                        path: 'dismiss',
                        name: 'staffdismiss',
                        isShow: true,
                        icon: 'tag',
                        component: () => import('../views/staff/dismiss/index.vue'),
                        meta: {key: 'staffdismiss', title: '员工撤复职'},
                    },
                    {
                        path: 'srecord',
                        name: 'staffRecordSearch',
                        isShow: true,
                        icon: 'file-text',
                        component: () => import('../views/staff/record/index.vue'),
                        meta: {key: 'staffRecordSearch', title: '职位变动查询'},
                    },
                    {
                        path: 'operationStaffRecord',
                        name: 'operationStaffRecord',
                        isShow: true,
                        icon: 'read',
                        component: () => import('../views/staff/operation/index.vue'),
                        meta: {key: 'operationStaffRecord', title: '操作记录查询'},
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
                meta: { key: 'rewardRecord', title: '奖惩查询' },
            },
            {
                path: 'rewardOperationRecord',
                icon: 'read',
                isShow: true,
                name: 'rewardOperationRecord',
                component: () => import ('../views/reward/operation/index.vue'),
                meta: { key: 'rewardOperationRecord', title: '操作记录查询' },
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
            meta: { key: 'attendRecord', title: '加班/请假/出差 查询' },
        }, {
            path: 'salaryRecord',
            icon: 'money-collect',
            isShow: true,
            name: 'salaryRecord',
            component: () => import('../views/attendance/salaryRecord/index.vue'),
            meta: { key: 'salaryRecord', title: '有薪假查询' },
        }, {
            path: 'attendOperationRecord',
            icon: 'read',
            isShow: true,
            name: 'attendOperationRecord',
            component: () => import('../views/attendance/operation/index.vue'),
            meta: { key: 'attendOperationRecord', title: '操作记录查询' },
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
            {
                path: 'export',
                icon: 'export',
                name: 'staffExport',
                isShow: true,
                component: () => import('../views/staff/export/index.vue'),
                meta: {key: 'staffExport', title: '基础数据导入'},
            },
        ],
    },
];

const routes = [ ...asyncRouterMap, ...constantRouterMap];

export default new Router({
    mode: 'hash',
    routes,
});







