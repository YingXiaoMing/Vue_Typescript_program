<template>
    <div class="reward_tab">
        <a-form :form="form">
        <a-row :gutter="24">
            <a-col :lg="8" :md="12" :sm="24">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="部门组织">
                    <a-tree-select :treeData="treeData" :showCheckedStrategy="SHOW_PARENT" 
                    treeCheckable v-decorator="['EmployeePrincipalPositionFullPaths']"/>
                </a-form-item>
            </a-col>
            <a-col :lg="8" :md="12" :sm="24">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="奖惩类型">
                    <a-select mode="multiple" v-decorator="['PrizePenaltyTypeIds']">
                        <a-select-opt-group v-for="item in prizePentalData" :label="item.name">
                            <a-select-option v-for="it in item.children"  :value="it.id">{{it.name}}</a-select-option>
                        </a-select-opt-group>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :lg="8" :md="12" :sm="24">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="输入工单号">
                    <a-input v-decorator="['WorkOrderNumber']"></a-input>
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
                <a-form-item class="rightBtn">
                    <a-button type="primary" @click="searchClick">查询</a-button>
                    <a-button style="marginLeft:15px" @click="exportDataClick">导出数据</a-button>
                </a-form-item>
            </a-col>
            <a-divider>查询结果</a-divider>
            <a-table1 :tabList="tabData" :loading="searchLoading" :paginationData="pagination"
            @refreshData="refreshData" @tableChange="pageChange"></a-table1>
        </a-row>
        </a-form>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import _ from 'lodash';
import Component from 'vue-class-component';
import { TreeSelect } from 'ant-design-vue';
import { getCompanyOrganizationChart } from '@/api/operation';
import { getAllPrizePenaltyClassify } from '@/api/basic';
import Table1 from './tabTable1.vue';
import { Pagination } from '@/interface';
import moment from 'moment';
import { searchPrizePenaltyRecord } from '@/api/operation';
import URLSearchParams from 'url-search-params';
import { message } from 'ant-design-vue';
import config from '@/utils/config';
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
interface PrizeData {
    name: string;
    id: string;
}
interface PrizePentalTable {
    name: string;
    id: string;
    children: PrizeData[];
}

@Component({
    components: {
        'a-table1': Table1,
    },
})

export default class Tab2 extends Vue {
    private labelCol = { xs: {span: 24}, sm: {span: 8}};
    private wrapperCol = { xs: {span: 24}, sm: {span: 16}};
    private prizePentalData: PrizePentalTable[] = [];
    private searchLoading: boolean = false;
    private employeePositionDataList: TableData[] = [];
    private SHOW_PARENT = TreeSelect.SHOW_PARENT;
    private treeData: TableData[] = [{ title: '', key: '', value: '', children: [], description: '' }];
    private form: any;
    private $form: any;
    private tabData: any = [];
    private dateFormat = 'YYYY-MM-DD';
    private dateTimeFormat = 'YYYY-MM-DD HH:mm';
    private param: URLSearchParams = new URLSearchParams();
    private pagination: Pagination = {
        pageSize: 0,
        total: 0,
        current: 0,
        onChange: this.pageChange,
        pageSizeOptions: ['5', '10', '15'],
        showSizeChanger: true,
        showTotal: this.showTotal,
    };
    private pageChange(current: number, pageSize: number) {
        this.param.set('PageNumber', current.toString());
        this.param.set('PageSize', pageSize.toString());
        this.loadData(this.param);
    }
    private showTotal(total: string, range: any) {
        return  `总记录数: ${total}条`;
    }
    private refreshData() {
        this.loadData(this.param);
    }
    private created() {
        this.form = this.$form.createForm(this);
        this.getOrganizationData();
        this.getAllPrizePenaltyClassifyData();
    }
    private getAllPrizePenaltyClassifyData() {
        getAllPrizePenaltyClassify().then((res) => {
            const data = res.data;
            this.prizePentalData = _.map(data, (item: any) => {
                return {
                    name: item.prizePenaltyTypeClassifyDisplayName,
                    id: item.prizePenaltyTypeClassifyValue,
                    children: item.prizePenaltyTypeDtos,
                };
            });
        });
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
    private exportDataClick() {
        if (!_.isEmpty(this.param.toString())) {
            let downLink;
            downLink = config.baseUrl + '/employee/Export/ExportPrizePenaltyRecordRecord?' + this.param;
            const link = document.createElement('a');
            link.href = downLink;
            link.click();
        } else {
            message.warning('暂无数据');
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
                if (values.WorkOrderNumber) {
                    params.set('FilterProperties.WorkOrderNumber', values.WorkOrderNumber);
                }
                this.changeListDataToParams(params, values.PrizePenaltyTypeIds, 'FilterProperties.PrizePenaltyTypeIds');
                this.changePositionDataToParams(params, values.EmployeePrincipalPositionFullPaths);
                this.param = params;
                this.loadData(params);
        });
    }
    private changeListDataToParams(params: URLSearchParams, data: string[], paramName: string) {
        if ( data && data.length > 0) {
            data.filter((item: string) => {
                params.append(paramName, item);
            });
        }
    }
    private addEmployeePositionDataList(data: TableData) {
        this.employeePositionDataList.push(data);
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
        searchPrizePenaltyRecord(param).then((res) => {
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
                    isAllowModification: item.recordStateValue === 1 ? true : false,
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
}
</script>

