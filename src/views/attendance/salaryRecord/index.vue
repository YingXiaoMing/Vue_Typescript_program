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
                            <a-popover trigger="hover" title="说明" placement="bottom" style="marginLeft: 10px">
                                <template slot="content">
                                    <div class="contentNote">
                                        <p><span>1.	本年年资可获有薪假H：当前工作年度做满一年可以获得的有薪假</span></p>
                                        <p><span>2.	上一年剩余有薪假H：上一年度未用完的有薪假可以积累到下一年度</span></p>
                                        <p><span>3.	本年已获得有薪假H：当前工作年度按天累加已获得的有薪假</span></p>
                                        <p><span>4.	本年已使用有薪假H：当前工作年度已核销的有薪假</span></p>
                                        <p><span>5.	待核销有薪假H：请了有薪假，处于请假状态，还未回公司销假的时数</span></p>
                                        <p><span>6.	至指定查询日期可用有薪假H:</span></p>
                                        <p><span>7.	当天可用有薪假H:</span></p>
                                        <p><span>8.	至指定查询日期可用有薪假H=上一年剩余有薪假+本年已获得有薪假-本年已使用有薪假-待核销有薪假+当天至指定查询日期应当获得的有</span></p>
                                        <p><span>9.	当天可用有薪假H=上一年剩余有薪假+本年已获得有薪假-本年已使用有薪假-待核销有薪假</span></p>
                                    </div>
                                    <div class="contentNote" style="marginTop: 2px">
                                        <p><span class="title" >请有薪假注意事项:</span></p>
                                        <p><span>1.	请有薪假的时候，当天有多少有薪假，就可以请多少有薪假，不可以请未来假</span></p>
                                        <p><span>2.	有薪假每天0点自动计算更新</span></p>
                                        <p><span>3.	有薪假请假流程：查询有薪假--》 请有薪假（状态：待核假）--》 有薪假待核销（冻结）--》请假回来上班找人事核销有薪假（按实际请假天数）--》有薪假核销完成（系统减扣有薪假，状态：已核假）</span></p>
                                    </div>
                                </template>
                                <span class="x_cs_popver">说明</span><a-icon type="question" />
                            </a-popover>
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
        // this.fetch('');
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
            let ids = '';
            if (!_.isEmpty(values.searchKey)) {
                ids = values.searchKey;
            }
            params.set('FilterProperties.Id', ids);
            params.set('endedDateTime', moment(new Date()).format('YYYY-MM-DD'));
            if (values.date) {
                params.set('endedDateTime', moment(values.date).format('YYYY-MM-DD'));
            }
            this.loadData(values.searchKey, params);
        });
    }
    private loadData(id: string, params: URLSearchParams) {
        this.searchLoading = true;
        getEmployeeSalaryRecord(params).then((res: any) => {
            const data = res.data;
            this.tabData = _.map(data, (item: any, index: number) => {
                return {
                    key: index,
                    num: item.employeeStringID,
                    name: item.employeeFullName,
                    employeeDate: moment(item.employeeEmploymentStartedDate).format('YYYY-MM-DD'),
                    typeName: item.totalGetingHolidayWithSalaryHoursThisYear,
                    type: item.totalRemainingHolidayWithSalaryHoursFromYesterYear,
                    isWithSalary: item.totalGotHolidayWithSalaryHoursToToday,
                    totalHours: item.totalUsedHolidayWithSalaryHoursThisYear,
                    startDateTime: item.blockedHolidayWithSalaryHours,
                    endedDateTime: item.blockedAdvanceHolidayWithSalaryHours,
                    status: item.vaildHolidayWithSalaryHoursThisToday,
                    operator: item.advanceHolidayWithSalaryHours,
                };
            });
            this.searchLoading = false;
            const paginationData = JSON.parse(res.headers['x-pagination']);
            this.pagination.pageSize = paginationData.pageSize;
            this.pagination.total = paginationData.totalCount;
            this.pagination.current = paginationData.currentPage;
        }).catch(() => {
            this.pagination.total = 0;
            this.searchLoading = false;
            this.tabData = [];
            this.pagination.current = 1;
        });
    }
}
</script>
<style lang="less">
.x_cs_popver {
    margin-top: 20px;
    color: rgba(0, 0, 0, 0.45);
}
</style>

