<template>
    <a-form :form="form">
        <a-row>
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
        </a-row>
        <a-divider>任职操作</a-divider>
        <a-row>
          <a-col :span="12">
            <a-form-item v-bind="formItemLayout" label="任职类型">
                <a-select v-if="data.isEdit" labelInValue v-decorator="['typeId',  {initialValue: positionDelegateTypeOption[0]}]">
                    <a-select-option v-for="item in positionDelegateTypeOption" :value="item.key">{{item.label}}</a-select-option>
                </a-select>
                <a-input v-else read-only v-decorator="['typeId', {initialValue: data.typeId}]"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="18">
              <a-form-item label="任职职位" v-bind="formItemLayout2">
                  <a-cascader v-if="data.isEdit" :options="cascderOption"  placeholder="请选择职位"
                  v-decorator="['newPostion',{ initialValue: data.position, rules: [{ required: true, message: ' ' }] }]"
                  @change="positionsChange"></a-cascader>
                  <a-input read-only v-else v-decorator="['newPosition', { initialValue: data.positionName }]"></a-input>
              </a-form-item>
          </a-col>
          <a-col :span="12">
              <a-form-item label="生效日期" v-bind="formItemLayout">
                  <a-date-picker v-if="data.isEdit" v-decorator="['effectiveDate', {initialValue: momentFromDate(data.effectiveDate), rules: [{ required: true, message: ' ' }] }]"></a-date-picker>
                  <a-input v-else read-only v-decorator="['effectiveDate', { initialValue: data.effectiveDate }]"></a-input>
              </a-form-item>
          </a-col>
          <a-col :span="24">
              <a-form-item label="原因" v-bind="formItemLayout3">
                  <a-textarea :read-only="!data.isEdit" v-decorator="['reason', {initialValue: data.reason}]" rows="4"></a-textarea>
              </a-form-item>
          </a-col>
        </a-row>
    </a-form>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import moment from 'moment';
import { getOrginzationData } from '@/api/basic';
import { putEmployeeModificationByRecordId, getEmployeePositionDelegatedType } from '@/api/operation';
import { CascderOptionItem, CascderOption, SelectValue, BasicData, RemoteCompanyOrgaizationData } from '@/interface';
import { message } from 'ant-design-vue';
import { conversionOrganizationData } from '@/utils';
import _ from 'lodash';
interface FormData {
    name: string;
    num: string;
    id: string;
    employeeId: string;
    effectiveDate: string;
    reason: string;
    orderNum: string;
    isEdit: boolean;
    position: string[];
    positionName: string;
    newPositionId: string;
}
@Component({
    name: 's-serve',
    components: {},
})
export default class Serve extends Vue {
    @Prop() private data!: FormData;
    private form: any;
    private $form: any;
    private cascderOption: CascderOption[] = [];
    private isNewPosition: boolean = false;
    private dateFormat = 'YYYY-MM-DD';
    private newDepartmentId: string = '';
    private newCompanyId: string = '';
    private newPositionId: string = '';
    private positionDelegateTypeOption: SelectValue[] = [];
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
        getEmployeePositionDelegatedType().then((res: any) => {
            const data = res.data;
            this.positionDelegateTypeOption = this.transformSelectData(data);
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
    }
    private transformSelectData(data: any) {
        return _.map(data, (item: BasicData) => {
            return {
                key: item.id,
                label: item.name,
            };
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
    private momentFromDate(date: string) {
         if (_.isEmpty(date)) { return null; }
         return moment(date, this.dateFormat);
    }
    private sumbitData(callback: any) {
        this.form.validateFields((err: any, values: any) => {
            if (!err) {
                if (this.data.isEdit) {
                    putEmployeeModificationByRecordId(this.data.id, {
                        newPositionCompanyId: this.newCompanyId,
                        newPositionDepartmentId: this.newDepartmentId,
                        newPositionId: this.newPositionId,
                        effectiveDate: moment(values.effectiveDate).format(this.dateFormat),
                        reason: values.reason,
                        employeePositionModificationTypeId: values.typeId.key,
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

