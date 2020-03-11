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
                            <a-date-picker v-decorator="['date']"></a-date-picker>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="10" :md="12" :sm="24">
                        <a-form-item>
                            <a-button type="primary" @click="searchClick">快速查询</a-button>
                        </a-form-item>
                    </a-col>
                </a-form>
            </a-row>
            <a-operation-recordTable :tabList="tabData" :loading="searchLoading" :paginationData="pagination" @tableChange="pageChange"></a-operation-recordTable>
            <div class="contentNote">
                <p><span class="title">说明:</span></p>
                <p><span>1.	本年年资可获有薪假H:  指该员工如果工作完当前工作年度能够获得的有薪假小时数</span></p>
                <p><span>2.	往年年资剩余有薪假H：指该员工往年获得的累计剩余有薪假</span></p>
                <p><span>3.	本年已获得有薪假H:   指该员工在当前工作年度已经获得的的有薪假</span></p>
                <p><span>4.	本年已使用有薪假H 指该员工在当前工作年度已经使用的有薪假</span></p>
                <p><span>5.	冻结已获得有薪假H： 指该员工录入有薪假请假工单后，已保存 状态，但是员工假期未休完，还未回来公司销假的请假单，暂时处于冻结有薪假状态，还未真正扣除</span></p>
                <p><span>6.	冻结可预支有薪假H：指该员工如果在指定查询日期后（7月10日后）请有薪假，在查询当日（7月7日）已获得的有薪假不够扣请假时数的时候，就会用‘至查询日期可预支有薪假’冻结来扣</span></p>
                <p><span>7.	至指定查询日期可预支有薪假H：指在查询当时并未获得该有薪假，但是因从查询当时到实际请假生效这段时间，员工仍可继续获得有薪假，故，可预支有薪假是指该员工从当询当天至指定查询日期这段时间内正常上班预计可产生的有薪假。</span></p>
                <p><span>8.	本年可用有薪假H： 指到指定查询日期那一天的可用有薪假（包含了已获得的剩余有薪假+查询当天到指定查询日期这段时间内如果正常上班预计产生的有薪假-已冻结的有薪假）</span></p>
                <p><span>9.	本年可用有薪假H=往年年资剩余有薪假H+本年已获得有薪假H-本年已使用有薪假H-冻结已获得有薪假H-冻结可预支有薪假H+至指定查询日期可预支有薪假H</span></p>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { searchEmployeeData } from '@/api/staff';
import OperationRecordTable from './recordTable.vue';
import { Pagination } from '@/interface';
import { message } from 'ant-design-vue';
import moment from 'moment';
import { getEmployeeSalaryRecord } from '@/api/operation';
import _ from 'lodash';
import './index.less';
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
    private searchClick() {
        this.form.validateFields((err: any, values: any) => {
            const params = new URLSearchParams();
            if (_.isEmpty(values.searchKey)) {
                message.error('员工暂时不能为空');
                return;
            }
            if (values.date) {
                params.set('endedDateTime', moment(values.date).format('YYYY-MM-DD'));
            }
            this.loadData(values.searchKey, params);
        });
    }
    private loadData(id: string, params: URLSearchParams) {
        this.searchLoading = true;
        getEmployeeSalaryRecord(id, params).then((res: any) => {
            const data = res.data;
            console.log(data);
            this.tabData = [...[{
                key: 1,
                num: data.employeeStringID,
                name: data.employeeFullName,
                employeeDate: moment(data.employeeEmploymentStartedDate).format('YYYY-MM-DD'),
                typeName: data.totalGetingHolidayWithSalaryHoursThisYear,
                type: data.totalRemainingHolidayWithSalaryHoursFromYesterYear,
                isWithSalary: data.totalGotHolidayWithSalaryHoursToToday,
                totalHours: data.totalUsedHolidayWithSalaryHoursThisYear,
                startDateTime: data.blockedHolidayWithSalaryHours,
                endedDateTime: data.blockedAdvanceHolidayWithSalaryHours,
                status: data.vaildHolidayWithSalaryHoursThisToday,
                operator: data.advanceHolidayWithSalaryHours,
            }]];
            this.searchLoading = false;
            this.pagination.total = 1;
            this.pagination.current = 1;
        }).catch(() => {
            this.searchLoading = false;
        })
    }
}
</script>

