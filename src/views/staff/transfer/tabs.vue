<template>
    <div>
        <a-tabs type="card">
            <a-tab-pane key="1" tab="调职"><a-tab1 :OriginPostionOption="originOptionData" :employeeId="employeeId" @clearEmployeeData="clearEmployeeData"/></a-tab-pane>
            <a-tab-pane key="2" tab="离职"><a-tab2 :employeeId="employeeId" @clearEmployeeData="clearEmployeeData"/></a-tab-pane>
        </a-tabs>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Tabs } from 'ant-design-vue';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import Tab1 from './tab1';
import Tab2 from './tab2';
import { SelectValue } from '@/interface';
@Component({
    components: {
        'a-tabs': Tabs,
        'a-tab-pane': Tabs.TabPane,
        'a-tab1': Tab1,
        'a-tab2': Tab2,
    },
})
export default class Tab extends Vue {
    @Prop() private orginData!: SelectValue[];
    @Prop({default: ''}) private employeeId!: string;
    private originOptionData: SelectValue[] = this.orginData;
    @Watch('orginData')
    private originPositionChange(value: SelectValue[]) {
        this.originOptionData = value;
    }
    private clearEmployeeData() {
        this.originOptionData = [];
        this.$emit('clearEmployeeDatas');
    }
}
</script>

