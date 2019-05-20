<template>
    <div>
        <a-tabs type="card">
            <a-tab-pane key="1" tab="奖励"><a-tab1></a-tab1></a-tab-pane>
            <a-tab-pane key="2" tab="惩罚">456</a-tab-pane>
        </a-tabs>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Tabs } from 'ant-design-vue';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { SelectValue } from '@/interface';
import Tab1 from './tab1';
@Component({
    components: {
        'a-tabs': Tabs,
        'a-tab-pane': Tabs.TabPane,
        'a-tab1': Tab1,
    },
})
export default class Tab extends Vue {
    @Prop({default: ''}) private employeeId!: string;
}
</script>

