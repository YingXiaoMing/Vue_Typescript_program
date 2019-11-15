<template>
    <div :class="['app-main']">
        <a-sidebar></a-sidebar>
        <a-layout>
        </a-layout>
        <a-layout-content class='fixed-header-content'>
            <a-tabs class="page-tabs" :activeKey="onTabs"
            onChange="tabChange" type="editable-card"
            >
              <a-tab-pane key=""></a-tab-pane>
            </a-tabs>

        </a-layout-content>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import './AppMain.less';
import Sidebar from './Sidebar';
import Header from './Header';
import { Component } from 'vue-property-decorator';
import _ from 'lodash';
@Component({
    components: {
        'a-sidebar': Sidebar,
        'a-header': Header,
    },
})
export default class AppMain extends Vue {
    private onTabs: string = '1';
    private tabList: any[] = [];
    private $router: any;
    private $store: any;
    private tabChange(name: string) {
        this.tabList.forEach((item: any, indexs: number) => {
            if (item.name === name) {
                this.$router.push({ name: item.name});
                this.$store.dispatch('TabChange', item.name);
            }
        });
    }
}
</script>
<style lang="less" scoped>
</style>


