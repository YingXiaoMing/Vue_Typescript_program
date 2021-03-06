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
            <a-operation-recordTable :columnList="column" :tabList="tabData" :loading="searchLoading" :paginationData="pagination" @tableChange="pageChange"></a-operation-recordTable>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { searchEmployeeData } from '@/api/staff';
import OperationRecordTable from '@/components/Table/PageTable.vue';
import { searchBusinessRecord } from '@/api/operation';
import { Pagination, ColumnList } from '@/interface';
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
    components: {
        'a-operation-recordTable': OperationRecordTable,
    },
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
    private column: ColumnList[] = [{
        title: '序号',
        width: 48,
        dataIndex: 'Index',
        align: 'center',
        scopedSlots: { customRender: 'Index' },
    }, {
        title: '工单号',
        dataIndex: 'orderNum',
        align: 'center',
        scopedSlots: { customRender: 'orderNum' },
    }, {
        title: '员工工号',
        dataIndex: 'num',
        align: 'center',
        scopedSlots: { customRender: 'num' },
    }, {
        title: '员工姓名',
        dataIndex: 'name',
        align: 'center',
        scopedSlots: { customRender: 'name' },
    }, {
        title: '职位',
        dataIndex: 'position',
        align: 'center',
        scopedSlots: { customRender: 'position' },
    }, {
        title: '类别',
        dataIndex: 'typeName',
        align: 'center',
        scopedSlots: { customRender: 'typeName' },
    }, {
        title: '类型',
        dataIndex: 'type',
        align: 'center',
        scopedSlots: { customRender: 'type' },
    }, {
        title: '是否有薪',
        dataIndex: 'isWithSalary',
        align: 'center',
        scopedSlots: { customRender: 'isWithSalary' },
    }, {
        title: '时长',
        dataIndex: 'totalHours',
        align: 'center',
        scopedSlots: { customRender: 'totalHours' },
    }, {
        title: '开始时间',
        dataIndex: 'startDateTime',
        align: 'center',
        scopedSlots: { customRender: 'startDateTime' },
    }, {
        title: '结束时间',
        dataIndex: 'endedDateTime',
        align: 'center',
        scopedSlots: { customRender: 'endedDateTime' },
    }, {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        scopedSlots: { customRender: 'status' },
    }, {
        title: '操作人',
        dataIndex: 'operator',
        align: 'center',
        scopedSlots: { customRender: 'operator' },
    }, {
        title: '操作时间',
        dataIndex: 'createDateTime',
        align: 'center',
        scopedSlots: { customRender: 'createDateTime' },
    }];
    private tabData: any = [];
    private formItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 10}},
        wrapperCol: { xs: {span: 24}, sm: {span: 14}},
    };
    private created() {
        this.form = this.$form.createForm(this, {
            IsIncludeTerminated: false,
        });
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
        params.set('PageNumber', '1');
        params.set('PageSize', '10');
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
                    params.set('FilterProperties.EmployeeIds', values.searchKey);
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
        searchBusinessRecord(param).then((res) => {
            const data = res.data;
            this.tabData = _.map(data, (item) => {
                return {
                    key: item.id,
                    orderNum: item.workOrderNumber,
                    num: item.employeeStringID,
                    name: item.employeeFullName,
                    position: item.employeePrincipalPositionFullPath,
                    typeName: item.askforLeaveOvertimeBusinesstripTypeClassifyName,
                    type: item.askforLeaveOvertimeBusinesstripTypeName,
                    isWithSalary: item.isWithSalary ? '是' : '否',
                    operator: item.createEmployeeId,
                    startDateTime: moment(item.startDateTime).format(this.dateTimeFormat),
                    endedDateTime: moment(item.endedDateTime).format(this.dateTimeFormat),
                    totalHours: item.totalHours,
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

