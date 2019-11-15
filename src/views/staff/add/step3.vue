<template>
    <div>
        <a-row :gutter="24" class="basicData"> 
          <a-divider class='diliver_item'>证件资料</a-divider>
          <a-row :gutter="24">
            <a-form :form="form">
                <a-col :span="8">
                    <a-form-item label="证件/证书类型" v-bind="formItemLayout">
                        <a-select labelInValue v-decorator="['credentialType', {rules: [{ required: true, message: ' ' }], initialValue: credentialTypeOption[0] }]">
                            <a-select-option v-for="item in credentialTypeOption" :value="item.key">{{item.label}}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="证件/证书名称" v-bind="formItemLayout">
                        <a-input v-decorator="['credentialName', {rules: [{ required: true, message: ' ' }]}]"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="颁发日期" v-bind="formItemLayout">
                        <a-date-picker :format="dateFormat" v-decorator="['issueDate', {rules: [{ required: true, message: ' ' }]}]"></a-date-picker>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="有效日期" v-bind="formItemLayout">
                        <a-radio-date v-decorator="['expireDate', {rules: [{ required: true, message: ' ' }], initialValue: initialDateValue }]"></a-radio-date>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="证件上传" v-bind="formItemLayout">
                        <a-upload :fileList="fileList" :beforeUpload="beforeUpload" :remove="handleRemove">
                            <a-button>
                                <a-icon type="upload"></a-icon>
                                点击上传
                            </a-button>
                        </a-upload>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item class='rightBtn'>
                        <a-button type="primary" @click="credntialDataAdd">新增</a-button>
                    </a-form-item>
                </a-col>
            </a-form>
          </a-row>
          <a-row style="marginTop:20px">
              <a-credentialTable :credentialOption="credentialTypeOption"
                    :loading="credentialLoading" :tabList="credntialTableData"
                    :employeeId="employeeId" @loadData="loadCredentialData" :ETag="etag"></a-credentialTable>
          </a-row>
        </a-row>
        <a-row v-if="employeeStatus !== 3">
          <a-col v-bind="botttomLayout" style="marginTop: 20px">
              <a-col v-bind="bottomLayoutBtn">
                  <a-button type="primary" @click="preStep">上一步</a-button>
              </a-col>
              <a-col v-bind="bottomLayoutBtn">
                  <a-button type="primary" @click="nextStep">下一步</a-button>
              </a-col>
          </a-col>
        </a-row>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import RadioDate from '@/components/RadioDate/index.vue';
import { getCredentialTypeOption } from '@/api/basic';
import { SelectValues, BasicData, CredntialTableData } from '@/interface';
import CredentialTable from '@/components/Step3/CredentialTable.vue';
import moment from 'moment';
import { getEmployeeID } from '@/utils/cookie';
import { getEmployeeCredentialData, newEmployeeCredential, newEmployeeCredentialAttachment } from '@/api/staff';
import { message } from 'ant-design-vue';
import _ from 'lodash';
interface NewValueForm {
    credentialType: {
        key: string;
        value: string;
    };
    credentialName: string;
    issueDate: any;
    expireDate: {
        date: string;
        value: string;
    };
}
@Component({
    components: {
        'a-radio-date': RadioDate,
        'a-credentialTable': CredentialTable,
    },
})
export default class Step3 extends Vue {
    private form: any;
    private $form: any;
    private $store: any;
    private employeeStatus: number = 1;
    private employeeId: string = '';
    private dateFormat = 'YYYY-MM-DD';
    private fileList: any = [];
    private etag: string = '';
    private credentialLoading: boolean = false;
    private credentialTypeOption: SelectValues[] = [];
    private credntialTableData: CredntialTableData[] = [];
    private initialDateValue = {
        value: '0',
        date: moment().format('L'),
        isShow: true,
    };
    private formItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 10}},
        wrapperCol: { xs: {span: 24}, sm: {span: 14}},
    };
    private bottomLayoutBtn = {
        lg: {span: 12},
        md: {span: 24},
        sm: {span: 24},
    };
    private botttomLayout = {
        lg: {span: 12, offset: 8},
        md: {span: 24, offset: 14},
        sm: {span: 24, offset: 14},
    };
    private created() {
        const { employeeStatus, newEmployeeId } = this.$store.state.step;
        this.employeeStatus = employeeStatus;
        switch (employeeStatus) {
            case 3:
                const employeeId = getEmployeeID();
                if (employeeId) {
                    this.employeeId = employeeId;
                }
                break;
            default:
                this.employeeId = newEmployeeId;
                break;
        }
        this.fetchCredentialTypeData();
        this.form = this.$form.createForm(this);
    }
    private beforeUpload(file: any): boolean {
        this.fileList = [...this.fileList, file];
        return false;
    }
    private handleRemove(file: any) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList;
    }
    private credntialDataAdd() {
        this.form.validateFields((err: any, values: any) => {
            if (!err) {
                const param = this.transformValueData(values);
                if (moment(param.issueDate).isAfter(param.expireDate)) {
                    message.error('有效日期不能早于颁发日期');
                    return;
                }
                if (moment(param.issueDate).isAfter()) {
                    message.error('颁发日期不能早于当天时间');
                    return;
                }
                newEmployeeCredential(this.employeeId, param).then((res: any) => {
                    const data = res.data;
                    const  id = data.id;
                    if (this.fileList.length > 0) {
                        const formData = new FormData();
                        this.fileList.forEach((file: any) => {
                            formData.append('files[]', file);
                        });
                        newEmployeeCredentialAttachment(this.employeeId, id, formData).then(() => {
                            this.clearFormData();
                        }).catch(() => {
                            message.error('新增失败');
                        });
                    } else {
                        this.clearFormData();
                    }
                });
            } else {
                message.error('证件资料请填写完整');
            }
        });
    }
    private clearFormData() {
        this.form.resetFields();
        this.fileList = [];
        this.loadCredentialData();
    }
    private fetchCredentialTypeData() {
        getCredentialTypeOption().then((res) => {
            const data = res.data;
            this.credentialTypeOption = this.transformSelectData(data);
            this.loadCredentialData();
        });
    }
    private loadCredentialData() {
        this.credentialLoading = true;
        getEmployeeCredentialData(this.employeeId).then((res) => {
            const data = res.data;
            this.etag = res.headers.etag;
            const newData = _.map(data, (item) => {
                const targetType = _.find(this.credentialTypeOption, {key: item.typeId});
                return {
                    key: item.id,
                    name: item.name,
                    credentialType: targetType ? targetType : { key: '', label: '' },
                    issueDate: moment(item.issueDate).format(this.dateFormat),
                    editable: false,
                    disable: false,
                    expireDate: _.isEqual(moment(item.expireDate).format(this.dateFormat), '9999-12-31') ? {date: '9999-12-31', value: '0', isShow: true} : {date: moment(item.expireDate).format(this.dateFormat), value: '1', isShow: false},
                    employeeCredentialAttachments: item.employeeCredentialAttachments,
                };
            });
            this.credntialTableData = newData;
            this.credentialLoading = false;
        }).catch((err) => {
            this.credentialLoading = false;
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
    private transformValueData(data: NewValueForm) {
        return {
            typeId: data.credentialType.key,
            name: data.credentialName,
            issueDate:  moment(data.issueDate).format(this.dateFormat),
            expireDate: data.expireDate.value ===  '0' ? '9999-12-31' : data.expireDate.date,
        };
    }
    private nextStep() {
        this.$emit('nextStep');
    }
    private preStep() {
        this.$emit('preStep');
    }
}
</script>

