<template>
    <a-form :form="form">
        <a-row>
            <a-col :span="12">
                <a-form-item label="工单号" v-bind="formItemLayout">
                    <a-input read-only v-decorator="['orderNum', {initialValue: data.orderNum}]"></a-input>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
              <a-form-item label="员工工号" v-bind="formItemLayout">
                  <a-input read-only v-decorator="['num', {initialValue: data.num}]"></a-input>
              </a-form-item>
          </a-col>
          <a-col :span="12">
              <a-form-item label="员工姓名" v-bind="formItemLayout">
                  <a-input read-only v-decorator="['name', {initialValue: data.name}]"></a-input>
              </a-form-item>
          </a-col>
        </a-row>
        <a-divider>调职操作</a-divider>
        <a-row>
          <a-col :span="18">
              <a-form-item label="原职位" v-bind="formItemLayout2">
                  <a-select v-if="data.isEdit" v-decorator="['originalPositionId', {initialValue: data.position, rules: [{ required: true, message: ' ' }]}]">
                    <a-select-option v-for="item in orginPositionOption" :value="item.key">{{item.label}}</a-select-option>
                  </a-select>
                  <a-input v-else read-only v-decorator="['orginPosition', { initialValue: data.orginPositionName }]"></a-input>
              </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
              <a-form-item label="调职类型" v-bind="formItemLayout">
                  <a-select v-if="data.isEdit" v-decorator="['employeePositionChangeType', {initialValue: data.employeePositionChangeTypeId, rules: [{ required: true, message: ' ' }]}]">
                      <a-select-option v-for="item in transferTypeOption" :value="item.key">{{item.label}}</a-select-option>
                  </a-select>
                  <a-input v-else read-only v-decorator="['employeePositionChangeTypeName', {initialValue: data.employeePositionChangeTypeName}]"></a-input>
              </a-form-item>
          </a-col>
          <a-col :span="12">
              <a-form-item label="生效日期" v-bind="formItemLayout">
                  <a-date-picker v-if="data.isEdit" v-decorator="['effectiveDate', {initialValue: momentFromDate(data.effectiveDate), rules: [{ required: true, message: ' ' }] }]"></a-date-picker>
                  <a-input v-else read-only v-decorator="['effectiveDate', {initialValue: data.effectiveDate }]"></a-input>  
              </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="18">
              <a-form-item label="新职位" v-bind="formItemLayout2">
                  <a-cascader :options="cascderOption" placeholder="请选择职位" v-if="data.isEdit"
                  v-decorator="['newPostion',{ initialValue: data.newPosition, rules: [{ required: true, message: ' ' }] }]"
                  @change="positionsChange"></a-cascader>
                  <a-input v-else read-only v-decorator="['newPosition', { initialValue: data.newPositionName }]"></a-input>
              </a-form-item>
          </a-col>
        </a-row>
        <a-row>
            <a-col :span="18">
                <a-form-item label="原因" v-bind="formItemLayout2">
                    <a-textarea :read-only="!data.isEdit"  v-decorator="['reason', { initialValue: data.reason }]" rows="4"></a-textarea>
                </a-form-item>
            </a-col>
        </a-row>
    </a-form>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { CascderOption, SelectValues, BasicData, CascderOptionItem, RemoteCompanyOrgaizationData } from '@/interface';
import { getOrginzationData, getEmployeePositionChangeType } from '@/api/basic';
import { getEmployeePositionForUpdatePositionTransferRrcord, putEmployeeModificationByRecordId } from '@/api/operation';
import moment from 'moment';
import { message } from 'ant-design-vue';
import { conversionOrganizationData } from '@/utils';
import _ from 'lodash';
interface FormData {
    name: string;
    num: string;
    id: string;
    employeeId: string;
    effectiveDate: string;
    employeePositionChangeTypeId: string;
    position: string;
    newPosition: string[];
    isEdit: boolean;
    orginPositionName: string;
    newPositionName: string;
    employeePositionChangeTypeName: string;
    newPositionId: string;
}
@Component({
    name: 's-transfer',
    components: {},
})
export default class TransferForm extends Vue {
    @Prop() private data!: FormData;
    private form: any;
    private $form: any;
    private cascderOption: CascderOption[] = [];
    private transferTypeOption: SelectValues[] = [{key: '', label: ''}];
    private orginPositionOption: SelectValues[] = [{key: '', label: ''}];
    private isNewPosition: boolean = false;
    private newDepartmentId: string = '';
    private newCompanyId: string = '';
    private newPositionId: string = '';
    private formItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 6}},
        wrapperCol: { xs: {span: 24}, sm: {span: 16}},
    };
    private dateFormat = 'YYYY-MM-DD';
    private formItemLayout2 = {
        labelCol: { xs: {span: 24}, sm: {span: 4}},
        wrapperCol: { xs: {span: 24}, sm: {span: 20}},
    };
    private created() {
        this.form = this.$form.createForm(this);
        getEmployeePositionChangeType().then((res: any) => {
            const data = res.data;
            this.transferTypeOption = this.transformSelectData(data);
        });
        getOrginzationData().then((res: any) => {
            const data: RemoteCompanyOrgaizationData = res.data;
            this.cascderOption = conversionOrganizationData(data, {
                isOperation: true,
                positionId: this.data.newPositionId,
                callback: (option: any) => {
                    this.newPositionId = option.positionId;
                    this.newCompanyId = option.companyId;
                    this.newDepartmentId = option.departmentId;
                    this.isNewPosition = true;
                },
            });
        });
        getEmployeePositionForUpdatePositionTransferRrcord(this.data.employeeId, this.data.id).then((res: any) => {
            const data = res.data;
            this.orginPositionOption = _.map(data, (item) => {
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
                    if (!this.isNewPosition) {
                        message.error('请选择一个有效职位');
                        callback(false);
                        return;
                    }
                    putEmployeeModificationByRecordId(this.data.id, {
                        originalPositionId: values.originalPositionId,
                        newPositionCompanyId: this.newCompanyId,
                        newPositionDepartmentId: this.newDepartmentId,
                        newPositionId: this.newPositionId,
                        employeePositionModificationTypeId: values.employeePositionChangeType,
                        effectiveDate: moment(values.effectiveDate).format(this.dateFormat),
                        reason : values.reason,
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
    private positionsChange( value: string[], selectOption: CascderOptionItem[] ) {
        const target = _.last(selectOption);
        this.isNewPosition =  _.has(target, 'key');
        if (value.length > 0 && selectOption[selectOption.length - 1].key) {
            this.newPositionId = value[value.length - 1];
            this.newDepartmentId = selectOption[selectOption.length - 1].departmentId;
            this.newCompanyId =  selectOption[selectOption.length - 1].companyId;
        }
    }
    private transformSelectData(data: any) {
        return _.map(data, (item: BasicData) => {
            return {
                key: item.id,
                label: item.name,
            };
        });
    }
}
</script>

