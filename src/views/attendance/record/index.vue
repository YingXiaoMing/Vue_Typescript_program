<template>
    <div class="wrapper">
        <div class="staff-head">
            <a-form :form="form">
            <a-row :gutter="24">
                <a-col  :lg="6" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="关键词">
                        <a-input v-decorator="['searchKey']"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :lg="6" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="类型">
                        <a-select mode="multiple">
                            <a-select-opt-group v-for="item in businessData" :label="item.name">
                                <a-select-option v-for="it in item.children" :value="it.id">{{it.name}}</a-select-option>
                            </a-select-opt-group>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :lg="6" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开始时间">
                        <a-date-picker v-decorator="['startDateTime']"></a-date-picker>
                    </a-form-item>
                </a-col>
                <a-col :lg="6" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="结束时间">
                        <a-date-picker v-decorator="['endDateTime']"></a-date-picker>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :lg="12" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="部门组织">
                        <a-select></a-select>
                    </a-form-item>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                    <a-form-item>
                        <a-button type="primary" @click="searchClick">查询</a-button>
                        <a-button style="marginLeft: 20px">导出数据</a-button>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-record-table :tabList="tabData" :loading="searchLoading" :paginationData="pagination"
                @refreshData="refreshData"></a-record-table>
            </a-row>
            </a-form>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Row, Col, Form, AutoComplete, Select, Input, DatePicker, Button } from 'ant-design-vue';
import { searchEmployeeData } from '@/api/staff';
import RecordTable from './RecordTable.vue';
import _ from 'lodash';
import { getAllBusinessClassify } from '@/api/basic';
import './index.less';
import moment from 'moment';
import { searchBusinessRecord } from '@/api/operation';
import { Pagination } from '@/interface';
import URLSearchParams from 'url-search-params';
interface EmployeeData {
    value: string;
    text: string;
    id: string;
    name: string;
}
interface BusinessData {
    name: string;
    id: string;
}
interface BusinessTable {
    name: string;
    id: string;
    children: BusinessData[];
}
@Component({
    components: {
        'a-row': Row,
        'a-form-item': Form.Item,
        'a-col': Col,
        'a-select': Select,
        'a-select-option': Select.Option,
        'a-input': Input,
        'a-date-picker': DatePicker,
        'a-button': Button,
        'a-record-table': RecordTable,
        'a-select-opt-group': Select.OptGroup,
        'a-form': Form,
    },
    name: 'attendRecord',
})
export default class Record extends Vue {
    private labelCol = { xs: {span: 24}, sm: {span: 8}};
    private wrapperCol = { xs: {span: 24}, sm: {span: 16}};
    private labelCol1 = { xs: {span: 24}, sm: {span: 4}};
    private wrapperCol1 = { xs: {span: 24}, sm: {span: 20}};
    private employeeDataList: EmployeeData[] = [];
    private param: URLSearchParams = new URLSearchParams();
    private searchLoading: boolean = false;
    private businessData: BusinessTable[] = [];
    private searchKey: string = '';
    private employeeName: string = '';
    private employeeNum: string = '';
    private employeeId: string = '';
    private dateFormat = 'YYYY-MM-DD';
    private pagination: Pagination = {
        pageSize: 0,
        total: 0,
        onChange: this.pageChange,
    };
    private tabData: any = [];
    private form: any;
    private $form: any;
    private created() {
        this.form = this.$form.createForm(this);
        this.getAllBusinessTypeData();
    }
    private pageChange(current: number, pageSize: number) {
        this.param.set('PageNumber', current.toString());
        this.loadData(this.param);
    }
    private refreshData() {
        this.loadData(this.param);
    }
    private getAllBusinessTypeData() {
        getAllBusinessClassify().then((res) => {
            this.businessData = _.map(res, (item: any) => {
                return {
                    name: item.askforLeaveOvertimeBusinesstripTypeClassifyDisplayName,
                    id: item.askforLeaveOvertimeBusinesstripTypeClassifyValue,
                    children: item.askforLeaveOvertimeBusinesstripTypeDtos,
                };
            });
        });
    }
    private searchClick() {
        this.form.validateFields((err: any, values: any) => {
            if (!err) {
                const params = new URLSearchParams();
                this.searchLoading = true;
                if (!_.isEqual(values.searchKey, undefined)) {
                    params.set('SearchQuery', values.searchKey);
                }
                params.set('PageNumber', '1');
                params.set('PageSize', '5');
                if (values.startDateTime) {
                    params.set('FilterProperties.StartDateTime', moment(values.startDateTime).format(this.dateFormat));
                }
                if (values.endDateTime) {
                    params.set('FilterProperties.EndedDateTime', moment(values.endDateTime).format(this.dateFormat));
                }
                this.param = params;
                this.loadData(params);
            }
        });
    }
    private loadData(param: URLSearchParams) {
        searchBusinessRecord(param).then((res: any) => {
            this.tabData = _.map(res.data, (item) => {
                return {
                    key: item.id,
                    num: item.employeeStringID,
                    name: item.employeeFullName,
                    position: item.employeePrincipalPositionFullPath,
                    type: item.timeoffOvertimeBusinesstripTypeClassifyName,
                    typeName: item.timeoffOvertimeBusinesstripTypeName,
                    totalHours: item.totalHours,
                    startTime: moment(item.startDateTime).format(this.dateFormat),
                    endTime: moment(item.endedDateTime).format(this.dateFormat),
                    isWithSalary: item.isWithSalary,
                    timeoffOvertimeBusinesstripTypeId: item.timeoffOvertimeBusinesstripTypeId,
                    employeeId: item.employeeId,
                    businesstripLocaltion: item.businesstripLocaltion,
                    reason: item.reason,
                    note: item.note,
                };
            });
            this.searchLoading = false;
            const paginationData = JSON.parse(res.headers['x-pagination']);
            this.pagination.pageSize = paginationData.pageSize;
            this.pagination.total = paginationData.totalCount;
        });
    }
}
</script>

