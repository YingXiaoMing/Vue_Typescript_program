<template>
    <div class="wrapper">
        <div class="staff-head">
            <a-form :form="form">
            <a-row :gutter="24">
                <a-col :lg="7" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="类型" class="form_control">
                        <a-select mode="multiple" v-decorator="['AskforLeaveOvertimeBusinesstripTypeIds']">
                            <a-select-opt-group v-for="item in businessData" :label="item.name">
                                <a-select-option v-for="it in item.children" :value="it.id">{{it.name}}</a-select-option>
                            </a-select-opt-group>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :lg="7" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开始时间">
                        <a-date-picker v-decorator="['startDateTime']"></a-date-picker>
                    </a-form-item>
                </a-col>
                <a-col :lg="7" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="结束时间">
                        <a-date-picker v-decorator="['endDateTime']"></a-date-picker>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :lg="14" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="部门组织">
                        <a-tree-select :treeData="treeData" :showCheckedStrategy="SHOW_PARENT" treeCheckable
                        v-decorator="['EmployeePrincipalPositionFullPaths']"/>
                    </a-form-item>
                </a-col>
                <a-col :lg="10" :md="12" :sm="24">
                    <a-form-item>
                        <a-button type="primary" @click="searchClick">查询</a-button>
                        <a-button style="marginLeft: 20px">导出数据</a-button>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-record-table :tabList="tabData" :loading="searchLoading" :paginationData="pagination"
                @refreshData="refreshData" @tableChange="pageChange"></a-record-table>
            </a-row>
            </a-form>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { TreeSelect } from 'ant-design-vue';
import { searchEmployeeData } from '@/api/staff';
import RecordTable from './RecordTable.vue';
import _ from 'lodash';
import { getAllBusinessClassify } from '@/api/basic';
import './index.less';
import moment from 'moment';
import { searchBusinessRecord, getCompanyOrganizationChart } from '@/api/operation';
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
interface Data {
    title: string;
    value: string;
    description: string;
    key: string;
}
interface TableData {
    title: string;
    key: string;
    value: string;
    description: string;
    children: Data[];
}
@Component({
    components: {
        'a-record-table': RecordTable,
    },
    name: 'attendRecord',
})
export default class Record extends Vue {
    private labelCol = { xs: {span: 24}, sm: {span: 4}};
    private wrapperCol = { xs: {span: 24}, sm: {span: 20}};
    private labelCol1 = { xs: {span: 24}, sm: {span: 2}};
    private wrapperCol1 = { xs: {span: 24}, sm: {span: 22}};
    private employeeDataList: EmployeeData[] = [];
    private param: URLSearchParams = new URLSearchParams();
    private employeePositionDataList: TableData[] = [];
    private SHOW_PARENT = TreeSelect.SHOW_PARENT;
    private treeData: TableData[] = [{ title: '', key: '', value: '', children: [], description: '' }];
    private searchLoading: boolean = false;
    private businessData: BusinessTable[] = [];
    private searchKey: string = '';
    private employeeName: string = '';
    private employeeNum: string = '';
    private employeeId: string = '';
    private dateFormat = 'YYYY-MM-DD hh:mm';
    private pagination: Pagination = {
        pageSize: 0,
        total: 0,
        current: 1,
        onChange: this.pageChange,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '15'],
        showTotal: this.showTotal,
    };
    private tabData: any = [];
    private form: any;
    private $form: any;
    private created() {
        this.form = this.$form.createForm(this);
        this.getOrganizationData();
        this.getAllBusinessTypeData();
    }
    private showTotal(total: string, range: any) {
        return  `总记录数: ${total}条`;
    }
    private pageChange(current: number, pageSize: number) {
        this.param.set('PageNumber', current.toString());
        this.param.set('PageSize', pageSize.toString());
        this.loadData(this.param);
    }
    private refreshData() {
        this.loadData(this.param);
    }
    private getOrganizationData() {
        getCompanyOrganizationChart().then((res: any) => {
            const data = res.data;
            const newData: TableData = {
                title: data.name,
                key: data.id,
                value: data.id,
                description: 'company',
                children: [],
            };
            this.addEmployeePositionDataList(newData);
            if (data.subCompanies) {
                this.traverseStepNodeChild(data.subCompanies, newData, 'company');
            }
            if (res.departments) {
                this.traverseStepNodeChild(data.departments, newData, 'department');
            }
            // 强行转换成数组
            this.treeData = _.castArray(newData);
        });
    }
    private traverseStepNodeChild(data: any, TopParentNode: any, descriptionName: string) {
        if (data) {
            const target = _.map(data, (item) => {
                let newTarget;
                if (_.isEqual(descriptionName, 'position')) {
                    newTarget = {
                        title: item.name,
                        key: item.id,
                        value: item.id,
                        description: descriptionName,
                        children: [],
                    };
                    this.addEmployeePositionDataList(newTarget);
                } else {
                    newTarget = {
                        title: item.name,
                        key: item.id,
                        value: item.id,
                        description: descriptionName,
                        children: [],
                    };
                    this.addEmployeePositionDataList(newTarget);
                }
                if (item.subCompanies) {
                    this.traverseStepNodeChild(item.subCompanies, newTarget, 'company');
                }
                if (item.departments) {
                    this.traverseStepNodeChild(item.departments, newTarget, 'department');
                }
                if (item.subDepartments) {
                    this.traverseStepNodeChild(item.subDepartments, newTarget, 'department');
                }
                if (item.positions) {
                    this.traverseStepNodeChild(item.positions, newTarget, 'position');
                }
                return newTarget;
            });
            TopParentNode.children = _.concat(TopParentNode.children, target);
        }
    }
    private addEmployeePositionDataList(data: TableData) {
        this.employeePositionDataList.push(data);
    }
    private getAllBusinessTypeData() {
        getAllBusinessClassify().then((res) => {
            const data = res.data;
            this.businessData = _.map(data, (item: any) => {
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
                params.set('PageSize', '10');
                if (values.startDateTime) {
                    params.set('FilterProperties.StartDateTime', moment(values.startDateTime).format(this.dateFormat));
                }
                if (values.endDateTime) {
                    params.set('FilterProperties.EndedDateTime', moment(values.endDateTime).format(this.dateFormat));
                }
                this.changeListDataToParams(params, values.AskforLeaveOvertimeBusinesstripTypeIds, 'FilterProperties.AskforLeaveOvertimeBusinesstripTypeIds');
                this.changePositionDataToParams(params, values.EmployeePrincipalPositionFullPaths);
                this.param = params;
                this.loadData(params);
            }
        });
    }

    private changeListDataToParams(params: URLSearchParams, data: string[], paramName: string) {
        if ( data && data.length > 0) {
            data.filter((item: string) => {
                params.append(paramName, item);
            });
        }
    }
    private changePositionDataToParams(params: URLSearchParams, data: string[]) {
        _.map(data, (item: string) => {
            return _.find(this.employeePositionDataList, (it) => {
                if (_.isEqual(it.value, item)) {
                    switch (it.description) {
                        case 'company':
                            this.changeValueToParamas(params, it.value, 'FilterProperties.CompanyIds');
                            break;
                        case 'department':
                            this.changeValueToParamas(params, it.value, 'FilterProperties.DepartmentIds');
                            break;
                        case 'position':
                            this.changeValueToParamas(params, it.value, 'FilterProperties.PositionIds');
                            break;
                        default:
                            break;
                    }
                }
            });
        });
    }
    // 单独处理字段
    private changeValueToParamas(params: URLSearchParams, data: string, paramName: string) {
        if (data && !_.isEmpty(data)) {
            params.append(paramName, data);
        }
    }
    private loadData(param: URLSearchParams) {
        this.searchLoading = true;
        searchBusinessRecord(param).then((res: any) => {
            this.tabData = _.map(res.data, (item) => {
                return {
                    key: item.id,
                    num: item.employeeStringID,
                    name: item.employeeFullName,
                    position: item.employeePrincipalPositionFullPath,
                    type: item.askforLeaveOvertimeBusinesstripTypeClassifyName,
                    typeName: item.askforLeaveOvertimeBusinesstripTypeName,
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
            this.pagination.current = paginationData.currentPage;
        }).catch(() => {
            this.searchLoading = false;
            this.tabData = [];
            this.pagination.pageSize = 5;
            this.pagination.total = 0;
            this.pagination.current = 1;
        });
    }
}
</script>

