<template>
    <a-card class="vacateCard">
        <span class="c-title">员工出差单</span>
        <a-form :form="form">
            <table border="1px" class="c-table">
                <tr>
                    <td class="firstTr">工单号</td>
                    <td class="firstTr" colspan="5">
                        <span>{{ data.orderNum }}</span>
                    </td>
                </tr>
                <tr>
                    <td class="firstTr">申请人</td>
                    <td class="firstTr">
                        <span>{{ data.name }}</span>
                    </td>
                    <td class="firstTr">员工工号</td>
                    <td class="firstTr">
                        <span>{{ data.num }}</span>
                    </td>
                    <td class="firstTr">出差类型</td>
                    <td class="firstTr">
                        <a-form-item v-if="data.isEdit" v-bind="formItemLayout">
                            <a-select :disabled="!data.isEdit" v-decorator="['timeoffOvertimeBusinesstripTypeId',  {initialValue: data.timeoffOvertimeBusinesstripTypeId, rules: [{ required: true, message: ' ' }]}]">
                                <a-select-option v-for="item in options" :value="item.key">{{item.label}}</a-select-option>
                            </a-select>
                        </a-form-item>
                        <span v-else>{{ data.timeoffOvertimeBusinesstripTypeName }}</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="6">
                        <a-form-item label="出差事由" v-bind="formItemLayout2" class="v-textera">
                            <a-textarea :read-only="!data.isEdit" :rows="4" v-decorator="['reason', {initialValue: data.reason, rules: [{ required: true, message: ' ' }]}]"></a-textarea>
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <td class="firstTr">开始日期时间</td>
                    <td colspan="2" class="firstTr">
                        <a-form-item v-if="data.isEdit" v-bind="formItemLayout">
                            <a-date-picker :disabled="!data.isEdit" style='width: 100%' :showTime="{ format: 'hh:mm' }" :format="dateFormat" v-decorator="['startDateTime', {initialValue: momentFromDate(data.startDateTime), rules: [{ required: true, message: ' ' }]}]"></a-date-picker>
                        </a-form-item>
                        <span v-else>{{ data.startDateTime }}</span>
                    </td>
                    <td class="firstTr">结束日期时间</td>
                    <td colspan="2" class="firstTr">
                        <a-form-item v-if="data.isEdit" v-bind="formItemLayout">
                            <a-date-picker :disabled="!data.isEdit" style='width: 100%' :showTime="{ format: 'hh:mm' }" :format="dateFormat"  v-decorator="['endedDateTime', {initialValue: momentFromDate(data.endedDateTime), rules: [{ required: true, message: ' ' }]}]"></a-date-picker>
                        </a-form-item>
                        <span v-else>{{ data.endedDateTime }}</span>
                    </td>
                </tr>
                <tr>
                    <td class="firstTr" >出差时长</td>
                    <td class="firstTr">
                        <a-form-item v-bind="formItemLayout" v-if="data.isEdit">
                            <a-input-number :disabled="!data.isEdit" style='width: 100%' v-decorator="['totalHours', {initialValue: data.totalHours, rules: [{ required: true, message: ' ' }]}]"></a-input-number>
                        </a-form-item>
                        <span v-else>{{ data.totalHours }}h</span>
                    </td>
                    <td class="firstTr">出差地点</td>
                    <td class="firstTr">
                        <a-form-item  v-if="data.isEdit" v-bind="formItemLayout">
                            <a-input v-decorator="['businesstripLocaltion', {initialValue: data.businesstripLocaltion, rules: [{ required: true, message: ' ' }]}]"></a-input>
                        </a-form-item>
                        <span v-else>{{ data.businesstripLocaltion }}</span>
                    </td>
                    <td class="firstTr">是否有薪</td>
                    <td class="firstTr">
                        <a-form-item v-if="data.isEdit" v-bind="formItemLayout">
                            <a-checkbox v-decorator="['isWithSalary', { valuePropName: 'checked', initialValue: data.isWithSalary}]"></a-checkbox>
                        </a-form-item>
                        <span v-else>{{data.isWithSalary? '是' : '否'}}</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="6">
                        <a-form-item label="备注" v-bind="formItemLayout2" class="v-textera">
                            <a-textarea :rows="4" :read-only="!data.isEdit" v-decorator="['note', {initialValue: data.note}]"></a-textarea>
                        </a-form-item>
                    </td>
                </tr>
            </table>
        </a-form>
    </a-card>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { SelectValue, BasicData } from '@/interface';
import { searchEmployeeData } from '@/api/staff';
import { getBusinessOptions } from '@/api/basic';
import { putAskforLeaveOvertimeBusinesstripRecord } from '@/api/operation';
import _ from 'lodash';
import { message } from 'ant-design-vue';
import moment from 'moment';
interface FormData {
    timeoffOvertimeBusinesstripTypeId: string;
    startDateTime: string;
    endedDateTime: string;
    isWithSalary: boolean;
    totalHours: string;
    businesstripLocaltion: string;
    id: string;
    employeeId: string;
    reason: string;
    note: string;
    name: string;
    num: string;
    isEdit: boolean;
}
interface EmployeeData {
    value: string;
    text: string;
    id: string;
    name: string;
}
@Component({
    name: 'a-business',
    components: {},
})
export default class Business extends Vue {
    @Prop() private data!: FormData;
    private form: any;
    private $form: any;
    private formItemLayout = {
        wrapperCol: { xs: {span: 24}, sm: {span: 24}},
    };
    private dateFormat = 'YYYY-MM-DD HH:mm';

    private formItemLayout2 = {
        labelCol: { xs: {span: 24}, sm: {span: 3}},
        wrapperCol: { xs: {span: 24}, sm: {span: 21}},
    };
    private options: SelectValue[] = [];
    private created() {
        this.form = this.$form.createForm(this);
        getBusinessOptions().then((res: any) => {
            const data = res.data;
            this.options = this.transformSelectData(data);
        });
    }
    private transformSelectData(data: any) {
        return _.map(data, (item: BasicData) => {
            return {
                key: item.id,
                label: item.name,
            };
        });
    }
    private momentFromDate(date: string) {
         if (_.isEmpty(date)) { return null; }
         return moment(date, this.dateFormat);
    }
    private sumbitData(callback: any) {
        if (this.data.isEdit) {
            this.form.validateFields((err: any, values: any) => {
                if (!err && this.compareStartDateAndEndDate(values.startDateTime, values.endedDateTime) && this.isRangeDate(values.totalHours)) {
                    const param = this.transformNewData(values);
                    putAskforLeaveOvertimeBusinesstripRecord(this.data.employeeId, this.data.id, param).then((res) => {
                        message.success('更新成功');
                        callback(true);
                    });
                }
            });
        } else {
            callback(true);
        }
    }
    private transformNewData(value: any) {
        return {
            askforLeaveOvertimeBusinesstripTypeId: value.timeoffOvertimeBusinesstripTypeId,
            startDateTime: moment(value.startDateTime).format(this.dateFormat),
            endedDateTime: moment(value.endedDateTime).format(this.dateFormat),
            isWithSalary: value.isWithSalary,
            totalHours: value.totalHours,
            businesstripLocaltion: value.businesstripLocaltion,
            reason: value.reason,
            note: value.note,
        };
    }
    private compareStartDateAndEndDate(startDate: any, endDate: any) {
        if (moment(startDate).isAfter(endDate)) {
            message.error('开始日期不能晚于结束日期');
            return false;
        }
        return true;
    }
    private isRangeDate(hour: string): boolean {
        const nativeReg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
        if (!nativeReg.test(hour)) {
            message.error('时长必须为正整数');
            return false;
        }
        return true;
    }
}
</script>

