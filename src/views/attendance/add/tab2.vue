<template>
    <div>
        <a-form :form="form">
            <a-row>
                <a-col :xxl="6" :md="8" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="工单号">
                        <a-input disabled v-decorator="['orderNum', { initialValue: '系统自动生成' }]"></a-input>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :xxl="6" :md="8" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="出差类型">
                        <a-select labelInValue v-decorator="['type',{initialValue: options[0]}]">
                            <a-select-option v-for="item in options" :value="item.key">{{item.label}}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-divider>出差详情</a-divider>
            <a-row>
              <a-col :xxl="6" :md="8" :sm="24">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否有薪">
                      <a-checkbox v-decorator="['isWithSalary',{valuePropName:'checked', initialValue: false}]"></a-checkbox>
                  </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :xxl="6" :md="8" :sm="24">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开始日期时间">
                      <a-date-picker style="width: 100%" :showTime="{ format: 'hh:mm' }" :format="dateForm" v-decorator="['startDateTime',
                  {rules: [{ required: true, message: ' ' }]}]"></a-date-picker>
                  </a-form-item>
              </a-col>
              <a-col :xxl="6" :md="8" :sm="24">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="结束日期时间">
                      <a-date-picker style="width: 100%" :showTime="{ format: 'hh:mm' }" :format="dateForm" v-decorator="['endedDateTime', 
                  {rules: [{ required: true, message: ' ' }]}]"></a-date-picker>
                  </a-form-item>
              </a-col>
            </a-row>
            <a-row>
                <a-col :xxl="6" :md="8" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="出差时长">
                        <a-input-number style="width: 100%" v-decorator="['totalHours', 
                  {rules: [{ required: true, message: ' ' }]}]"></a-input-number>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
              <a-col :xxl="6" :md="8" :sm="24">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="出差地点">
                      <a-input v-decorator="['businesstripLocaltion',{rules: [{ required: true, message: ' ' }]}]"></a-input>
                  </a-form-item>
              </a-col>
            </a-row>
            <a-row>
                <a-col :xxl="12" :md="16" :sm="24">
                    <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="出差事由">
                        <a-textarea v-decorator="['reason', {rules: [{ required: true, message: ' ' }]}]"></a-textarea>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :xxl="12" :md="16" :sm="24">
                    <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="备注">
                        <a-textarea v-decorator="['note']"></a-textarea>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row class="bottom_button">
                <a-button type="primary" @click="check">保存</a-button>
            </a-row>
        </a-row>
        </a-form>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { getBusinessOptions } from '@/api/basic';
import { Row, Col, Form, Select, Divider, DatePicker, Checkbox, Input, Button, message } from 'ant-design-vue';
import { SelectValue, BasicData } from '@/interface';
import _ from 'lodash';
import {Prop, Watch } from 'vue-property-decorator';
import moment from 'moment';
import { newBusinesstrip } from '@/api/operation';
@Component({
    components: {
        'a-row': Row,
        'a-col': Col,
        'a-select': Select,
        'a-form-item': Form.Item,
        'a-date-picker': DatePicker,
        'a-divider': Divider,
        'a-checkbox': Checkbox,
        'a-input': Input,
        'a-textarea': Input.TextArea,
        'a-button': Button,
        'a-form': Form,
        'a-select-option': Select.Option,
    },
})
export default class Tab2 extends Vue {
    @Prop({default: ''}) private employeeId!: string;
    private labelCol = { xs: {span: 24}, sm: {span: 8}};
    private wrapperCol = { xs: {span: 24}, sm: {span: 16}};
    private labelCol1 = { xs: {span: 24}, sm: {span: 4} };
    private wrapperCol1 = { xs: {span: 24}, sm: {span: 20} };
    private options: SelectValue[] = [];
    private dateForm = 'YYYY-MM-DD HH:mm';
    private form: any;
    private $form: any;
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
    private check() {
        if (_.isEqual(this.employeeId, '')) {
            message.error('请指定某一个员工');
            return;
        }
        this.form.validateFields((err: any, values: any) => {
            if (!err && this.compareStartDateAndEndDate(values.startDateTime, values.endedDateTime) && this.isRangeDate(values.totalHours)) {
                newBusinesstrip({
                    employeeId: this.employeeId,
                    askforLeaveOvertimeBusinesstripTypeId: values.type.key,
                    startDateTime: moment(values.startDateTime).format(this.dateForm),
                    endedDateTime: moment(values.endedDateTime).format(this.dateForm),
                    isWithSalary: values.isWithSalary,
                    businesstripLocaltion: values.businesstripLocaltion,
                    reason: values.reason,
                    totalHours: values.totalHours,
                    note: values.note,
                }).then(() => {
                    this.form.resetFields();
                    message.success('员工申请出差成功');
                    this.$emit('clearEmployeeData');
                });
            }
        });
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

