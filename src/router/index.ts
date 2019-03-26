import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export const constantRouterMap = [
    {path: '/', redirect: '/home'}
]


export default new Router({
    routes: constantRouterMap
});







