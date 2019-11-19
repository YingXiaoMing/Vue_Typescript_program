<template>
    <a-form :form="form">
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
        <a-divider>复职操作</a-divider>
        <a-row>
            <a-col :span="18">
                <a-form-item label="复职职位" v-bind="formItemLayout2">
                    <a-select v-decorator="['reinstatedPositionId', {initialValue: rehabPositionOption[0].key, rules: [{ required: true, message: ' ' }]}]">
                        <a-select-option v-for="item in rehabPositionOption" :value="item.key">{{item.label}}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="18">
                <a-form-item label="生效日期" v-bind="formItemLayout2">
                    <a-date-picker v-decorator="['effectiveDate', {initialValue: momentFromDate(data.effectiveDate), rules: [{ required: true, message: ' ' }] }]"></a-date-picker>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="24">
                <a-form-item label="复职原因" v-bind="formItemLayout3">
                    <a-textarea v-decorator="['reason', {initialValue: data.reason}]" rows="4"></a-textarea>
                </a-form-item>
            </a-col>
        </a-row>
    </a-form>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { SelectValues } from '@/interface';
import { getEmployeePositionReinstatedRecord, updateEmployeePositionReinstatedRecord } from '@/api/operation';
import moment from 'moment';
import { message } from 'ant-design-vue';
import _ from 'lodash';
interface FormData {
    name: string;
    num: string;
    id: string;
    employeeId: string;
    effectiveDate: string;
    reason: string;
}
@Component({
    name: 's-rehab',
    components: {},
})
export default class Rehab extends Vue {
    @Prop() private data!: FormData;
    private form: any;
    private $form: any;
    private dateFormat = 'YYYY-MM-DD';
    private rehabPositionOption: SelectValues[] = [{key: '', label: ''}];
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
        getEmployeePositionReinstatedRecord(this.data.employeeId, this.data.id).then((res) => {
            const data = res.data;
            this.rehabPositionOption = _.map(data, (item) => {
                return {
                    key: item.id,
                    label: item.positionFullPath,
                };
            });
        });
    }
    private momentFromDate(date: string) {
         if (_.isEmpty(date)) { return null; }
         return moment(date, this.dateFormat);
    }
    private sumbitData(callback: any) {
        this.form.validateFields((err: any, values: any) => {
            if (!err) {
                updateEmployeePositionReinstatedRecord(this.data.employeeId, this.data.id, {
                    reinstatedPositionId: values.reinstatedPositionId,
                    effectiveDate: moment(values.effectiveDate).format(this.dateFormat),
                }).then(() => {
                    message.success('更新成功');
                    callback(true);
                });
            }
        });
    }

}
</script>