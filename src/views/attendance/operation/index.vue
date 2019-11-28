<template>
    <div class="wrapper">
        <div class="staff-head">
            <a-row :gutter="24">
                <a-form :form="form">
                    <a-col :lg="8" :md="12" :sm="24">
                        <a-form-item label="输入员工姓名或工号" v-bind="formItemLayout">
                            <a-auto-complete placeholder="请输入姓名或工号进行智能搜索"
                            @search="handleChange" @select="onSelect" @focus="focusHandle" v-decorator="['searchKey']">
                                <template slot="dataSource">
                                    <a-select-option v-for="item in employeeDataList" :key="item.value">{{item.text}}</a-select-option>
                                </template>
                                <a-input @change="e => valueChange(e.target.value)"></a-input>
                            </a-auto-complete>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="6" :md="12" :sm="24">
                        <a-form-item label="输入工单号" v-bind="formItemLayout">
                            <a-input v-decorator="['WorkOrderNumber']"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="4" :md="12" :sm="24">
                        <a-form-item>
                            <a-checkbox v-decorator="['IsIncludeTerminated', { valuePropName: 'checked', initialValue: false }]">包含离职员工</a-checkbox>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="6" :md="12" :sm="24">
                        <a-form-item>
                            <a-button type="primary" @click="searchClick">快速查询</a-button>
                        </a-form-item>
                    </a-col>
                </a-form>
            </a-row>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { searchEmployeeData } from '@/api/staff';
import { getEmployeeModificationRecord } from '@/api/operation';
import { Pagination } from '@/interface';
import { message } from 'ant-design-vue';
import _ from 'lodash';
import moment from 'moment';
interface EmployeeData {
    value: string;
    text: string;
    id: string;
}
@Component({
    name: 'attendOperationRecord',
    components: {},
})
export default class Operation extends Vue {
    private form: any;
    private $form: any;
    private searchKey: string = '';
    private employeeDataList: EmployeeData[] = [];
    private dateFormat = 'YYYY-MM-DD';
    private dateTimeFormat = 'YYYY-MM-DD HH:mm';
    private param: URLSearchParams = new URLSearchParams();
    private searchLoading: boolean = false;
    private pagination: Pagination = {
        pageSize: 0,
        total: 0,
        current: 0,
        // onChange: this.pageChange,
        pageSizeOptions: ['5', '10', '15'],
        showSizeChanger: true,
        showTotal: this.showTotal,
    };
    private tabData: any = [];
    private formItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 10}},
        wrapperCol: { xs: {span: 24}, sm: {span: 14}},
    };
    private created() {
        this.form = this.$form.createForm(this, {
            IsIncludeTerminated: false,
        });
        this.fetch('');
    }
    private handleChange(value: string) {
        this.fetch(value);
    }
    private focusHandle() {
        this.handleChange(this.searchKey);
    }
    private valueChange(value: string) {
        this.searchKey = value;
    }
    private fetch(value: string) {
        const params = new URLSearchParams();
        params.set('SearchQuery', value);
        params.set('ShapedFields', 'fullName,employeeStringId,id');
        this.changeDataToParamas(params, this.form.getFieldValue('IsIncludeTerminated'), 'FilterProperties.IsIncludeTerminated');
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
    private pageChange(current: number, pageSize: number) {
        this.param.set('PageNumber', current.toString());
        this.param.set('PageSize', pageSize.toString());
        this.loadData(this.param);
    }
    private showTotal(total: string, range: any) {
        return  `总记录数: ${total}条`;
    }
    private searchClick() {
        this.form.validateFields((err: any, values: any) => {
                const params = new URLSearchParams();
                params.set('PageNumber', '1');
                params.set('PageSize', '10');
                if (values.searchKey) {
                    params.set('FilterProperties.EmployeeId', values.searchKey);
                }
                if (values.WorkOrderNumber) {
                    params.set('FilterProperties.WorkOrderNumber', values.WorkOrderNumber);
                }
                if (values.IsIncludeTerminated) {
                    // 暂时没包含离职员工
                    params.set('FilterProperties.IsIncludeEmploymentTerminated', values.IsIncludeTerminated);
                }
                params.set('FilterProperties.IsIncludeOperations', 'true');
                this.param = params;
                this.loadData(params);
        });
    }
    private loadData(param: URLSearchParams) {
        this.searchLoading = true;
        getEmployeeModificationRecord(param).then((res) => {
            const data = res.data;
            this.tabData = _.map(data, (item) => {
                return {
                    key: item.id,
                    orderNum: item.workOrderNumber,
                    num: item.employeeStringID,
                    name: item.employeeFullName,
                    orginPosition: item.orginalPositionFullPath,
                    newPosition: item.newPositionFullPath,
                    typeName: item.employeePositionChangeClassifyName,
                    type: item.employeePositionChangeTypeName,
                    effectedDate: moment(item.effectiveDate).format(this.dateFormat),
                    status: item.recordStateName,
                    createDateTime: moment(item.createDateTime).format(this.dateTimeFormat),
                };
            });
            this.searchLoading = false;
            const paginationData = JSON.parse(res.headers['x-pagination']);
            this.pagination.pageSize = paginationData.pageSize;
            this.pagination.total = paginationData.totalCount;
            this.pagination.current = paginationData.currentPage;
        });
    }
    private changeDataToParamas(params: URLSearchParams, data: boolean, paramName: string) {
        if (data) {
            params.set(paramName, data.toString());
        }
    }
    private onSelect(value: string) {
        const item = _.find(this.employeeDataList, {value});
        if (item) {
            this.searchKey = item.value;
        }
    }
}
</script>

