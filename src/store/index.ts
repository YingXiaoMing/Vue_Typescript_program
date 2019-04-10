import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import step from './modules/step';
import getters from './getters';
Vue.use(Vuex);


const store = new Vuex.Store({
    modules: {
        app,
        step,
    },
    getters,
});
export default store;
