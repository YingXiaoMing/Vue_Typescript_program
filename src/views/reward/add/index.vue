<template>
    <div class="wrapper">
        <div class="staff-head">
            <a-row :gutter="24">
                <a-col  :lg="8" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="员工姓名(工号)">
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
                <a-tabs-com :employeeId="employeeId" @clearEmployeeDatas="clearEmployeeDatas"></a-tabs-com>
            </a-row>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Row, Col, Form, AutoComplete, Select, Input, Icon } from 'ant-design-vue';
import { searchEmployeeData } from '@/api/staff';
import TabComponent from './tabs.vue';
import _ from 'lodash';
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
        'a-col': Col,
        'a-form-item': Form.Item,
        'a-auto-complete': AutoComplete,
        'a-select-option': Select.Option,
        'a-input': Input,
        'a-tabs-com': TabComponent,
        'a-icon': Icon,
        'a-select': Select,
    },
    name: 'addReward',
})
export default class Add extends Vue {
    private labelCol = { xs: {span: 24}, sm: {span: 8}};
    private wrapperCol = { xs: {span: 24}, sm: {span: 16}};
    private employeeDataList: EmployeeData[] = [];
    private searchKey: string = '';
    private employeeName: string = '';
    private employeeNum: string = '';
    private employeeId: string = '';
    private handleChange(value: string) {
        this.fetch(value);
    }
    private valueChange(value: string) {
        this.searchKey = value;
    }
    private created() {
        this.fetch('');
    }
    private onSelect(value: string) {
        const item = _.find(this.employeeDataList, {value});
        if (item) {
            this.employeeName = item.name;
            this.employeeNum = item.id;
            this.employeeId = item.value;
        }
    }
    private focusHandle() {
        this.handleChange(this.searchKey);
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
    private clearEmployeeDatas() {
        this.employeeName = '';
        this.employeeNum = '';
        this.employeeId = '';
        this.searchKey = '';
        this.fetch('');
    }
}
</script>

