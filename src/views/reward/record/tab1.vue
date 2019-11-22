<template>
    <div class="reward_tab">
        <a-row :gutter="24">
            <a-form :form="form">
                <a-row :gutter="24">
                    <a-col :lg="8" :md="12" :sm="24">
                        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="员工姓名(工号)">
                            <a-auto-complete placeholder="请输入姓名或工号进行智能搜索"
                            @search="handleChange" @select="onSelect" v-decorator="['query']">
                                <template slot="dataSource">
                                    <a-select-option v-for="item in employeeDataList" :key="item.value">{{item.text}}</a-select-option>
                                </template>
                                <a-input></a-input>
                            </a-auto-complete>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24">
                        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="输入工单号">
                            <a-input></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :lg="8" :md="12" :sm="24">
                        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开始时间">
                            <a-date-picker v-decorator="['startDateTime']"></a-date-picker>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24">
                        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="结束时间">
                            <a-date-picker v-decorator="['endDateTime']"></a-date-picker>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24">
                        <a-form-item :labelCol="labelCol">
                            <a-button type="primary" @click="searchClick">查询</a-button>
                            <a-button style="marginLeft:15px">导出数据</a-button>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
            <a-divider class="diliver_item">查询结果</a-divider>
            <a-table1 :tabList="tabData" :loading="searchLoading" :paginationData="pagination"
            @refreshData="refreshData" @tableChange="pageChange"></a-table1>
        </a-row>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Row, Col, Form, AutoComplete, Select, Input, DatePicker, Button, Divider } from 'ant-design-vue';
import { searchEmployeeData } from '@/api/staff';
import Table1 from './tabTable1.vue';
import moment from 'moment';
import _ from 'lodash';
import { searchPrizePenaltyRecord } from '@/api/operation';
import { Pagination } from '../../../interface/index';
import URLSearchParams from 'url-search-params';
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
        'a-input': Input,
        'a-select-option': Select.Option,
        'a-date-picker': DatePicker,
        'a-button': Button,
        'a-divider': Divider,
        'a-table1': Table1,
        'a-form': Form,
    },
})
export default class Tab1 extends Vue {
    private labelCol = { xs: {span: 24}, sm: {span: 8}};
    private wrapperCol = { xs: {span: 24}, sm: {span: 16}};
    private param: URLSearchParams = new URLSearchParams();
    private employeeDataList: EmployeeData[] = [];
    private dateFormat = 'YYYY-MM-DD';
    private searchKey: string = '';
    private searchLoading: boolean = false;
    private tabData: any = [];
    private form: any;
    private $form: any;
    private pagination: Pagination = {
        pageSize: 0,
        total: 0,
        current: 0,
        onChange: this.pageChange,
        pageSizeOptions: ['5', '10', '15'],
        showSizeChanger: true,
        showTotal: this.showTotal,
    };
    private created() {
        this.form = this.$form.createForm(this);
        this.fetch('');
    }
    private handleChange(value: string) {
        this.fetch(value);
    }
    private pageChange(current: number, pageSize: number) {
        this.param.set('PageNumber', current.toString());
        this.param.set('PageSize', pageSize.toString());
        this.loadData(this.param);
    }
    private showTotal(total: string, range: any) {
        return  `总记录数: ${total}条`;
    }
    private fetch(value: string) {
        const params = new URLSearchParams();
        params.set('SearchQuery', value);
        params.set('ShapedFields', 'fullName,employeeStringId,id');
        searchEmployeeData(params.toString()).then((res) => {
            const data = res.data;
            this.employeeDataList = _.map(data, (item) => {
                return {
                    value: item.fullName,
                    text: item.employeeStringID + '-' + item.fullName,
                    id: item.employeeStringID,
                    name: item.fullName,
                };
            });
        });
    }
    private refreshData() {
        this.loadData(this.param);
    }
    private onSelect(value: string) {
        const item = _.find(this.employeeDataList, {value});
        if (item) {
            this.searchKey = item.name;
        }
    }
    private searchClick() {
        this.form.validateFields((err: any, values: any) => {
                const params = new URLSearchParams();
                params.set('PageNumber', '1');
                params.set('PageSize', '10');
                if (values.startDateTime) {
                    params.set('FilterProperties.EffectiveDateStartValue', moment(values.startDateTime).format(this.dateFormat));
                }
                if (values.endDateTime) {
                    params.set('FilterProperties.EffectiveDateEndValue', moment(values.endDateTime).format(this.dateFormat));
                }
                if (values.query) {
                    params.set('SearchQuery', values.query);
                }
                this.param = params;
                this.loadData(params);
        });
    }
    private loadData(param: URLSearchParams) {
        this.searchLoading = true;
        searchPrizePenaltyRecord(param).then((res) => {
            const data = res.data;
            this.tabData = _.map(res.data, (item) => {
                return {
                    key: item.id,
                    num: item.employeeStringID,
                    name: item.employeeFullName,
                    position: item.employeePrincipalPositionFullPath,
                    isReward: item.prizePenaltyTypeClassifyName,
                    rewardType: item.prizePenaltyTypeName,
                    date: moment(item.effectiveDate).format(this.dateFormat),
                    situationDescription: item.situationDescription,
                    solution: item.solution,
                    orderNum: item.workOrderNumber,
                    status: item.recordStateName,
                    typeId: item.prizePenaltyTypeId,
                    id: item.id,
                    employeeId: item.employeeId,
                };
            });
            this.searchLoading = false;
            const paginationData = JSON.parse(res.headers['x-pagination']);
            this.pagination.pageSize = paginationData.pageSize;
            this.pagination.total = paginationData.totalCount;
            this.pagination.current = paginationData.currentPage;
        });
    }
}
</script>
