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
      <a-divider>离职操作</a-divider>
      <a-row>
        <a-col :span="18">
            <a-form-item label="离职类型" v-bind="formItemLayout2">
                  <a-select v-if="data.isEdit" v-decorator="['employeePositionChangeTypeId', {initialValue: data.employeePositionChangeTypeId, rules: [{ required: true, message: ' ' }]}]">
                    <a-select-option v-for="item in endJobTypeOption" :value="item.key">{{item.label}}</a-select-option>
                  </a-select>
                  <a-input disabled v-else v-decorator="['employeePositionChangeTypeId', {initialValue: data.employeePositionChangeTypeId}]"></a-input>
            </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="18">
            <a-form-item label="生效日期" v-bind="formItemLayout2">
                  <a-date-picker v-if="data.isEdit" v-decorator="['effectiveDate', {initialValue: momentFromDate(data.effectiveDate), rules: [{ required: true, message: ' ' }] }]"></a-date-picker>
                  <a-input disabled v-else v-decorator="['effectiveDate', { initialValue: data.effectiveDate }]"></a-input>   
            </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
            <a-form-item label="离职原因" v-bind="formItemLayout3">
                <a-textarea :disabled="!data.isEdit" v-decorator="['reason', {initialValue: data.reason}]" rows="4"></a-textarea>
            </a-form-item>
        </a-col>
      </a-row>
    </a-form>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { SelectValues, BasicData } from '@/interface';
import { getEmployeeEndJonType } from '@/api/basic';
import { putEmployeeModificationByRecordId } from '@/api/operation';
import moment from 'moment';
import _ from 'lodash';
import { message } from 'ant-design-vue';
interface FormData {
    name: string;
    num: string;
    id: string;
    employeeId: string;
    effectiveDate: string;
    reason: string;
    employeePositionChangeTypeId: string;
    isEdit: boolean;
}
@Component({
    name: 's-departure',
    components: {},
})
export default class DismissForm extends Vue {
    @Prop() private data!: FormData;
    private endJobTypeOption: SelectValues[] = [{key: '', label: ''}];
    private form: any;
    private $form: any;
    private dateFormat = 'YYYY-MM-DD';
    private formItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 6}},
        wrapperCol: { xs: {span: 24}, sm: {span: 18}},
    };
    private formItemLayout2 = {
        labelCol: { xs: {span: 24}, sm: {span: 4}},
        wrapperCol: { xs: {span: 24}, sm: {span: 20}},
    };
    private formItemLayout3 = {
        labelCol: { xs: {span: 24}, sm: {span: 3}},
        wrapperCol: { xs: {span: 24}, sm: {span: 20}},
    };
    private created() {
        this.form = this.$form.createForm(this);
        getEmployeeEndJonType().then((res: any) => {
            const data = res.data;
            this.endJobTypeOption = this.transformSelectData(data);
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
        this.form.validateFields((err: any, values: any) => {
            if (!err) {
                if (this.data.isEdit) {
                    putEmployeeModificationByRecordId(this.data.employeeId, this.data.id, {
                        employeePositionChangeTypeId: values.employeePositionChangeTypeId,
                        effectiveDate: moment(values.effectiveDate).format(this.dateFormat),
                        reason: values.reason,
                    }).then(() => {
                        message.success('更新成功');
                        callback(true);
                    });
                } else {
                    callback(true);
                }
            }
        });
    }
}
</script>
