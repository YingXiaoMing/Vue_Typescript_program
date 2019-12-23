<template>
    <div class="wrapper">
        <div class="staff-head">
            <a-card style="width:100%" :tabList="tabListNoTitle"
            @tabChange="key => onTabChange(key)" :activeTabKey="key">
                <template v-if="key === 'person'">
                    <a-tab1></a-tab1>
                </template>
                <template v-else="key === 'all'">
                    <a-tab2></a-tab2>
                </template>
            </a-card>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Card } from 'ant-design-vue';
import Tab1 from './tab1.vue';
import Tab2 from './tab2.vue';
import './index.less';

@Component({
    components: {
        'a-card': Card,
        'a-tab1': Tab1,
        'a-tab2': Tab2,
    },
    name: 'rewardRecord',
})
export default class Record extends Vue {
    private tabListNoTitle = [{
        key: 'person',
        tab: '个人查询',
    }, {
        key: 'all',
        tab: '全部查询',
    }];
    private key: string = 'person';
    private onTabChange(key: string) {
        this.key = key;
    }
}
</script>

