<template>
    <div class="wrapper">
        <div class="staff-head">
            <a-form :form="form">
            <a-row :gutter="24">
                <a-col :lg="7" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="类型">
                        <!-- <a-select mode="multiple" v-decorator="['AskforLeaveOvertimeBusinesstripTypeIds']">
                            <a-select-opt-group v-for="item in businessData" :label="item.name">
                                <a-select-option v-for="it in item.children" :value="it.id">{{it.name}}</a-select-option>
                            </a-select-opt-group>
                        </a-select> -->
                        <a-tree-select :treeData="typeTreeData" :showCheckedStrategy="SHOW_PARENT" treeCheckable
                        v-decorator="['AskforLeaveOvertimeBusinesstripTypeIds']"/>
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
                <a-col :lg="7" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="部门组织">
                        <a-tree-select :treeData="treeData" :showCheckedStrategy="SHOW_PARENT" treeCheckable
                        v-decorator="['EmployeePrincipalPositionFullPaths']"/>
                    </a-form-item>
                </a-col>
                <a-col :lg="7" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
                        <a-select v-decorator="['recordStateValue',{initialValue: ''}]">
                          <a-select-option value="">全部</a-select-option>
                          <a-select-option value="1">已生效</a-select-option>
                          <a-select-option value="2">已删除</a-select-option>
                          <a-select-option value="3">已取消</a-select-option>
                          <a-select-option value="4">已撤销</a-select-option>
                          <a-select-option value="5">已核假</a-select-option>
                          <a-select-option value="6">已保存</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :lg="7" :md="12" :sm="24">
                    <a-form-item>
                        <a-button type="primary" @click="searchClick">查询</a-button>
                        <a-button style="marginLeft: 20px" @click="exportDataClick">导出数据</a-button>
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
import config from '@/utils/config';
import { Pagination } from '@/interface';
import URLSearchParams from 'url-search-params';
import { message } from 'ant-design-vue';
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
    description?: string;
    key: string;
}
interface TableData {
    title: string;
    key: string;
    value: string;
    description?: string;
    children: Data[];
}
@Component({
    components: {
        'a-record-table': RecordTable,
    },
    name: 'attendRecord',
})
export default class Record extends Vue {
    private labelCol = { xs: {span: 24}, lg: {span: 6} , xxl: {span: 4}};
    private wrapperCol = { xs: {span: 24}, lg: {span: 18} , xxl: {span: 20}};
    private labelCol1 = { xs: {span: 24}, lg: {span: 3}, xxl: {span: 2}};
    private wrapperCol1 = { xs: {span: 24}, lg: {span: 21}, xxl: {span: 22}};
    private employeeDataList: EmployeeData[] = [];
    private param: URLSearchParams = new URLSearchParams();
    private employeePositionDataList: TableData[] = [];
    private businessTypeList: string[] = [];
    private SHOW_PARENT = TreeSelect.SHOW_PARENT;
    private treeData: TableData[] = [{ title: '', key: '', value: '', children: [], description: '' }];
    private typeTreeData: TableData[] = [{ title: '', key: '', value: '', children: [] }];
    private searchLoading: boolean = false;
    private businessData: BusinessTable[] = [];
    private searchKey: string = '';
    private employeeName: string = '';
    private employeeNum: string = '';
    private employeeId: string = '';
    private dateFormat = 'YYYY-MM-DD hh:mm';
    private $route: any;
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
    private activated() {
        if (this.$route.params.type === 1) {
            this.getAllBusinessTypeData(() => {
                this.form.setFieldsValue({
                    recordStateValue: '6',
                    endDateTime: moment().format(this.dateFormat),
                    AskforLeaveOvertimeBusinesstripTypeIds: [this.businessTypeList[0]],
                });
                this.searchClick();
            });
        }
    }
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
    private getAllBusinessTypeData(callback: any) {
        getAllBusinessClassify().then((res) => {
            const data = res.data;
            this.businessTypeList = _.map(data, (item: any) => {
                return item.askforLeaveOvertimeBusinesstripTypeClassifyValue;
            });
            this.typeTreeData = _.map(data, (item: any) => {
                return {
                    title: item.askforLeaveOvertimeBusinesstripTypeClassifyDisplayName,
                    key: item.askforLeaveOvertimeBusinesstripTypeClassifyValue,
                    value: item.askforLeaveOvertimeBusinesstripTypeClassifyValue,
                    children: _.map(item.askforLeaveOvertimeBusinesstripTypeDtos, (vt: any) => {
                        return {
                            title: vt.name,
                            value: vt.id,
                            key: vt.id,
                        };
                    }),
                };
            });
            if (callback) {
                callback();
            }
        });
    }
    private exportDataClick() {
        if (!_.isEmpty(this.param.toString())) {
            let downLink;
            downLink = config.baseUrl + '/employee/Export/ExportAskforLeaveOvertimeBusinesstripRecord?' + this.param;
            const link = document.createElement('a');
            link.href = downLink;
            link.click();
        } else {
            message.warning('暂无数据');
        }
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
                if (values.recordStateValue) {
                    params.set('FilterProperties.RecordStateValue', values.recordStateValue);
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
                if (!_.includes(this.businessTypeList, item)) {
                    params.append(paramName, item);
                } else {
                    const newData: TableData = _.find(this.typeTreeData, { value: item });
                    newData.children.filter((vt: Data) => {
                        params.append(paramName, vt.value);
                    });
                }
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
            console.log('独自承受伤害');
            console.log(res);
            this.tabData = _.map(res.data, (item) => {
                return {
                    workOrderNumber: item.workOrderNumber,
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
                    status: item.recordStateName,
                    reason: item.reason,
                    isAllowModification: item.recordStateValue,
                    note: item.Note,
                    operateTime: moment(item.createDateTime).format(this.dateFormat),
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

