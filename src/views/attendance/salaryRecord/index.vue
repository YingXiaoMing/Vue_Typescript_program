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
                        <a-form-item label="指定查询日期" v-bind="formItemLayout">
                            <a-date-picker v-decorator="['WorkOrderNumber']"></a-date-picker>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="10" :md="12" :sm="24">
                        <a-form-item>
                            <a-button type="primary">快速查询</a-button>
                            <a-button type="primary" style="marginLeft: 10px">查询所有员工有薪假</a-button>
                        </a-form-item>
                    </a-col>
                </a-form>
            </a-row>
            <a-operation-recordTable :tabList="tabData" :loading="searchLoading" :paginationData="pagination" @tableChange="pageChange"></a-operation-recordTable>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { searchEmployeeData } from '@/api/staff';
import OperationRecordTable from './recordTable.vue';
import { Pagination } from '@/interface';
import _ from 'lodash';
interface EmployeeData {
    value: string;
    text: string;
    id: string;
}
@Component({
    components: {
        'a-operation-recordTable': OperationRecordTable,
    },
    name: 'salaryRecord',
})
export default class SalaryRecord extends Vue {
    private form: any;
    private $form: any;
    private formItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 10}},
        wrapperCol: { xs: {span: 24}, sm: {span: 14}},
    };
    private searchKey: string = '';
    private searchLoading: boolean = false;
    private tabData: any = [];
    private pagination: Pagination = {
        pageSize: 0,
        total: 0,
        current: 0,
        // onChange: this.pageChange,
        pageSizeOptions: ['5', '10', '15'],
        showSizeChanger: true,
        showTotal: this.showTotal,
    };
    private employeeDataList: EmployeeData[] = [];
    private created() {
        this.form = this.$form.createForm(this);
        this.fetch('');
    }
    private pageChange(current: number, pageSize: number) {
        // this.param.set('PageNumber', current.toString());
        // this.param.set('PageSize', pageSize.toString());
        // this.loadData(this.param);
    }
    private showTotal(total: string, range: any) {
        return  `总记录数: ${total}条`;
    }
    private handleChange(value: string) {
        this.fetch(value);
    }
    private focusHandle() {
        this.handleChange(this.searchKey);
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

