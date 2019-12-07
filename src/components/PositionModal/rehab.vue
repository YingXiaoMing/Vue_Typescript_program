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
        <a-divider>复职操作</a-divider>
        <a-row>
            <a-col :span="18">
                <a-form-item label="复职类型" v-bind="formItemLayout2">
                    <a-select v-if="data.isEdit"  v-decorator="['employeePositionChangeTypeId', {initialValue: typeOption[0].key, rules: [{ required: true, message: ' ' }]}]">
                        <a-select-option v-for="item in typeOption" :value="item.key">{{item.label}}</a-select-option>
                    </a-select>
                    <a-input v-else disabled v-decorator="['employeePositionChangeTypeName', {initialValue: data.employeePositionChangeTypeName}]"></a-input>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="18">
                <a-form-item label="复职职位" v-bind="formItemLayout2">
                    <a-select  v-if="data.isEdit" v-decorator="['reinstatedPositionId', {initialValue: data.positionId, rules: [{ required: true, message: ' ' }]}]">
                        <a-select-option v-for="item in rehabPositionOption" :value="item.key">{{item.label}}</a-select-option>
                    </a-select>
                    <a-input disabled v-else v-decorator="['positionName',{initialValue: data.positionName}]"></a-input>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="18">
                <a-form-item label="生效日期" v-bind="formItemLayout2">
                    <a-date-picker v-if="data.isEdit" v-decorator="['effectiveDate', {initialValue: momentFromDate(data.effectiveDate), rules: [{ required: true, message: ' ' }] }]"></a-date-picker>
                    <a-input v-else disabled v-decorator="['effectiveDate', {initialValue: data.effectiveDate }]"></a-input>  
                </a-form-item>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="24">
                <a-form-item label="复职原因" v-bind="formItemLayout3">
                    <a-textarea :disabled="!data.isEdit" v-decorator="['reason', {initialValue: data.reason}]" rows="4"></a-textarea>
                </a-form-item>
            </a-col>
        </a-row>
    </a-form>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { SelectValues, BasicData } from '@/interface';
import { getEmployeePositionReinstatedRecord, putEmployeeModificationByRecordId, getEmployeePositionReinstatedType } from '@/api/operation';
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
    orderNum: string;
    positionName: string;
    positionId: string;
    employeePositionChangeTypeName: string;
    isEdit: boolean;
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
    private typeOption: SelectValues[] = [{key: '', label: ''}];
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
    private transformSelectData(data: any) {
        return _.map(data, (item: BasicData) => {
            return {
                key: item.id,
                label: item.name,
            };
        });
    }
    private created() {
        this.form = this.$form.createForm(this);
        getEmployeePositionReinstatedType().then((res: any) => {
            const data = res.data;
            this.typeOption = this.transformSelectData(data);
        });
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
                if (this.data.isEdit) {
                    putEmployeeModificationByRecordId(this.data.employeeId, this.data.id, {
                        employeePositionModificationTypeId: values.employeePositionChangeTypeId,
                        orginalPositionId: values.reinstatedPositionId,
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