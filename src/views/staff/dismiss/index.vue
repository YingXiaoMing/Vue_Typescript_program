<template>
    <div class="wrapper">
        <div class="staff-head">
            <a-row :gutter="24">
                <a-col  :lg="8" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="输入员工姓名或工号">
                        <a-auto-complete placeholder="请输入姓名或工号进行智能搜索"
                        @search="handleChange" @select="onSelect" v-model="searchKey">
                            <template slot="dataSource">
                                <a-select-option v-for="item in employeeDataList" :key="item.value">{{item.text}}</a-select-option>
                            </template>
                             <a-input @change="e => valueChange(e.target.value)"></a-input>
                        </a-auto-complete>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :lg="8" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="员工工号">
                        <a-input disabled v-model="employeeNum"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :lg="8" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="员工姓名">
                        <a-input disabled v-model="employeeName"></a-input>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-tab-component :orginData="originPostions" :employeeId="employeeId" :dismissData="dismissPositions"></a-tab-component>
            </a-row>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { Row, Col, Form, AutoComplete, Input, Select } from 'ant-design-vue';
import _ from 'lodash';
import { searchEmployeeData, getEmployeePositionData } from '@/api/staff';
import { SelectValue } from '@/interface';
import TabComponent from './tabs.vue';
import './index.less';
interface EmployeeData {
    value: string;
    text: string;
    id: string;
    name: string;
}
@Component({
    components: {
        'a-row': Row,
        'a-form-item': Form.Item,
        'a-col': Col,
        'a-auto-complete': AutoComplete,
        'a-select-option': Select.Option,
        'a-input': Input,
        'a-tab-component': TabComponent,
    },
})
export default class Dismiss extends Vue {
    private labelCol = { xs: {span: 24}, sm: {span: 8}};
    private wrapperCol = { xs: {span: 24}, sm: {span: 16}};
    private employeeDataList: EmployeeData[] = [];
    private originPostions: SelectValue[] = [];
    private dismissPositions: SelectValue[] = [];
    private employeeName: string = '';
    private employeeNum: string = '';
    private employeeId: string = '';
    private searchKey: string = '';
    private handleChange(value: string) {
        this.fetch(value);
    }
    private created() {
        this.fetch('');
    }
    private valueChange(value: string) {
        this.searchKey = value;
    }
    private onSelect(value: string) {
        const item = _.find(this.employeeDataList, {value});
        if (item) {
            this.employeeName = item.name;
            this.employeeNum = item.id;
            getEmployeePositionData(item.value).then((res: any) => {
                // tslint:disable-next-line:no-shadowed-variable
                const data = res.data;
                this.originPostions = _.map(data.positions, (item: any) => {
                    return {
                        key: item.id,
                        label: item.positionFullPath,
                    };
                });
                this.employeeId = item.value;
            });
        }
    }
    private fetch(value: string) {
        const params = new URLSearchParams();
        params.set('SearchQuery', value);
        params.set('ShapedFields', 'fullName,employeeStringId,id');
        searchEmployeeData(params.toString()).then((res) => {
            const data = res.data;
            this.employeeDataList = _.map(data, (item) => {
                return {
                    value: item.id,
                    text: item.employeeStringID + '-' + item.fullName,
                    id: item.employeeStringID,
                    name: item.fullName,
                };
            });
        });
    }
}
</script>

