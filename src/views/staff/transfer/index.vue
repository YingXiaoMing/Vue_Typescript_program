<template>
    <div class="wrapper">
        <div class="staff-head">
            <a-row :gutter="24">
                <a-col  :lg="8" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="输入员工姓名或工号">
                        <a-auto-complete placeholder="请输入姓名或工号进行智能搜索" @focus="focusHandle"
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
                <a-tab-component :orginData="originPostions" :employeeId="employeeId" @clearEmployeeDatas="clearEmployeeDatas"></a-tab-component>
            </a-row>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { Row, Col, Form, AutoComplete, Select, Input } from 'ant-design-vue';
import { searchEmployeeData, getEmployeePositionData } from '@/api/staff';
import TabComponent from './tabs.vue';
import _ from 'lodash';
import './index.less';
import { SelectValue } from '@/interface';
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
    name: 'staffTransfer',
})
export default class Transfer extends Vue {
    private labelCol = { xs: {span: 24}, xl: {span: 10}, xxl: {span: 8}};
    private wrapperCol = { xs: {span: 24}, xl: {span: 14}, xxl: {span: 16}};
    private employeeDataList: EmployeeData[] = [];
    private originPostions: SelectValue[] = [];
    private searchName: string = '';
    private searchKey: string = '';
    private employeeName: string = '';
    private employeeNum: string = '';
    private employeeId: string = '';
    private $route: any;
    private handleChange(value: string) {
        this.fetch(value);
    }
    private searchEmployeePositionData(employeId: string) {
        getEmployeePositionData(employeId).then((res: any) => {
            // tslint:disable-next-line:no-shadowed-variable
            const data = res.data;
            this.originPostions = _.map(data.positions, (item: any) => {
                return {
                    key: item.id,
                    label: item.positionFullPath,
                };
            });
            this.employeeId = employeId;
        });
    }
    private onSelect(value: string) {
        const item = _.find(this.employeeDataList, {value});
        if (item) {
            this.employeeName = item.name;
            this.employeeNum = item.id;
            this.searchEmployeePositionData(item.value);
        }
    }
    private focusHandle() {
        this.handleChange(this.searchKey);
    }
    private created() {
        // this.fetch('');
    }
    private activated() {
        if (this.$route.params.form) {
            const data = this.$route.params.form;
            this.employeeName = data.employeeName;
            this.employeeId = data.employeeId;
            this.searchKey = data.employeeName + '-' + data.employeeNum;
            this.employeeNum = data.employeeNum;
            this.searchEmployeePositionData(this.employeeId);
        }
    }
    private clearEmployeeDatas() {
        this.employeeName = '';
        this.employeeNum = '';
        this.searchKey = '';
        this.employeeId = '';
        this.fetch('');
    }
    private valueChange(value: string) {
        this.searchKey = value;
    }
    private fetch(value: string) {
        const params = new URLSearchParams();
        params.set('SearchQuery', value);
        params.set('ShapedFields', 'fullName,employeeStringId,id');
        params.set('PageNumber', '1');
        params.set('PageSize', '10');
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

