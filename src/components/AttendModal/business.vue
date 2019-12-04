<template>
    <a-form :form="form">
        <a-row>
            <a-col :span="12">
                <a-form-item label="工单号" v-bind="formItemLayout">
                    <a-input disabled v-decorator="['orderNum', {initialValue: data.orderNum}]"></a-input>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="12">
                <a-form-item label="员工工号" v-bind="formItemLayout">
                    <a-input disabled v-decorator="['num', {initialValue: data.num}]"></a-input>
                </a-form-item>
            </a-col>
            <a-col :span="12">
                <a-form-item label="员工姓名" v-bind="formItemLayout">
                    <a-input disabled v-decorator="['name', {initialValue: data.name}]"></a-input>
                </a-form-item>
            </a-col>
        </a-row>
         <a-row>
            <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="出差类型" v-bind="formItemLayout">
                    <a-select :disabled="!data.isEdit" v-decorator="['timeoffOvertimeBusinesstripTypeId',  {initialValue: data.timeoffOvertimeBusinesstripTypeId, rules: [{ required: true, message: ' ' }]}]">
                        <a-select-option v-for="item in businessType" :value="item.key">{{item.label}}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
        </a-row>
        <a-divider>出差详情</a-divider>
        <a-row>
            <a-col :span="12">
                <a-form-item label="是否有薪" v-bind="formItemLayout">
                    <a-checkbox :disabled="!data.isEdit" v-decorator="['isWithSalary', { valuePropName: 'checked', initialValue: data.isWithSalary}]"></a-checkbox>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="12">
                <a-form-item label="开始日期时间" v-bind="formItemLayout">
                    <a-date-picker :disabled="!data.isEdit" style='width: 100%' :showTime="{ format: 'hh:mm' }" :format="dateFormat" v-decorator="['startDateTime', {initialValue: momentFromDate(data.startDateTime), rules: [{ required: true, message: ' ' }]}]"></a-date-picker>
                </a-form-item>
            </a-col>
            <a-col :span="12">
                <a-form-item label="结束日期时间" v-bind="formItemLayout">
                <a-date-picker :disabled="!data.isEdit" style='width: 100%' :showTime="{ format: 'hh:mm' }" :format="dateFormat"  v-decorator="['endedDateTime', {initialValue: momentFromDate(data.endedDateTime), rules: [{ required: true, message: ' ' }]}]"></a-date-picker>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="12">
                <a-form-item label="出差时长" v-bind="formItemLayout">
                    <a-input-number :disabled="!data.isEdit" style='width: 100%' v-decorator="['totalHours', {initialValue: data.totalHours, rules: [{ required: true, message: ' ' }]}]"></a-input-number>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="12">
                <a-form-item label="出差地点" v-bind="formItemLayout">
                    <a-input :disabled="!data.isEdit" v-decorator="['businesstripLocaltion', {initialValue: data.businesstripLocaltion, rules: [{ required: true, message: ' ' }]}]"></a-input>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row style="marginTop: 6px">
            <a-col :span="24">
                <a-form-item label="出差事由" v-bind="formItemLayout2">
                    <a-textarea :disabled="!data.isEdit" v-decorator="['reason', {initialValue: data.reason, rules: [{ required: true, message: ' ' }]}]"></a-textarea>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row style="marginTop: 6px">
            <a-col :span="24">
                <a-form-item label="备注" v-bind="formItemLayout2">
                    <a-textarea :disabled="!data.isEdit" v-decorator="['note', {initialValue: data.note}]"></a-textarea>
                </a-form-item>
            </a-col>
        </a-row>
    </a-form>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import moment from 'moment';
import { getBusinessOptions } from '@/api/basic';
import { putAskforLeaveOvertimeBusinesstripRecord } from '@/api/operation';
import _ from 'lodash';
import { message } from 'ant-design-vue';
import { SelectValue, BasicData } from '@/interface';
import jsonpatch from 'fast-json-patch';
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
@Component({
    name: 'a-vacate',
    components: {},
})
export default class Business extends Vue {
    @Prop() private data!: FormData;
    private form: any;
    private $form: any;
    private businessType: SelectValue[] = [];
    private dateFormat = 'YYYY-MM-DD HH:mm';
    private formItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 6}},
        wrapperCol: { xs: {span: 24}, sm: {span: 16}},
    };
    private formItemLayout2 = {
        labelCol: { xs: {span: 24}, sm: {span: 3}},
        wrapperCol: { xs: {span: 24}, sm: {span: 20}},
    };
    private created() {
        this.form = this.$form.createForm(this);
        getBusinessOptions().then((res: any) => {
            const data = res.data;
            this.businessType = this.transformSelectData(data);
        });
    }
    private momentFromDate(date: string) {
         if (_.isEmpty(date)) { return null; }
         return moment(date, this.dateFormat);
    }
    private transformSelectData(data: any) {
        return _.map(data, (item: BasicData) => {
            return {
                key: item.id,
                label: item.name,
            };
        });
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