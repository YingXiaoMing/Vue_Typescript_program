<template>
    <div>
        <a-tabs type="card" @change="tabChange">
            <a-tab-pane key="1" tab="撤职"><a-tab1 :valueOption="originOptionData" :employeeId="employeeId" @getData="getEmployeePostionData"/></a-tab-pane>
            <a-tab-pane key="2" tab="复职"><a-tab2 :valueOption="dismissOptionData" :employeeId="employeeId" @getData="getEmployeeDismissPositionData"/></a-tab-pane>
        </a-tabs>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Tabs, message } from 'ant-design-vue';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import Tab1 from './tab1';
import Tab2 from './tab2';
import { SelectValue } from '@/interface';
import _ from 'lodash';
import { getEmployeePositionData } from '@/api/staff';
import { getEmployeeDismissedPosition } from '@/api/operation';
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
    @Prop() private dismissData!: SelectValue[];
    @Prop({default: ''}) private employeeIds!: string;
    private tabKey: string = '1';
    private employeeId: string = this.employeeIds;
    private originOptionData: SelectValue[] = this.orginData;
    private dismissOptionData: SelectValue[] = this.dismissData;
    @Watch('orginData')
    private originPositionChange(value: SelectValue[]) {
        this.originOptionData = value;
    }
    @Watch('dismissData')
    private dismissPositionChange(value: SelectValue[]) {
        this.dismissOptionData = value;
    }
    @Watch('employeeIds')
    private employeeIdChange(value: string) {
        this.employeeId = value;
    }
    private tabChange(key: string) {
        this.tabKey = key;
        if (_.isEqual(this.employeeId, '')) { return; }
        switch (key) {
            case '1':
                this.getEmployeePostionData();
                break;
            default:
                this.getEmployeeDismissPositionData();
                break;
        }
    }
    private loadRemoteEmployeePositionData() {
        switch (this.tabKey) {
            case '1':
                this.getEmployeePostionData();
                break;
            default:
                this.getEmployeeDismissPositionData();
                break;
        }
    }
    private getEmployeePostionData() {
        getEmployeePositionData(this.employeeId).then((res: any) => {
            const data = res.data;
            this.originOptionData = _.map(data.Positions, (item: any) => {
                return {
                    key: item.id,
                    label: item.positionFullPath,
                };
            });
        }).catch(() => {
            this.originOptionData = [];
        });
    }
    private getEmployeeDismissPositionData() {
        getEmployeeDismissedPosition(this.employeeId).then((res: any) => {
            const data = res;
            console.log('为什么这种方式');
            console.log(res);
            this.dismissOptionData = _.map(data, (item: any) => {
                return {
                    key: item.id,
                    label: item.positionFullPath,
                };
            });
        }).catch(() => {
            this.dismissOptionData = [];
        });
    }
}
</script>

