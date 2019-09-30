<template>
    <div>
        <a-row :gutter="24" class='basicData'>
          <a-divider class='diliver_item'>个人合同</a-divider>
          <a-form :form="form">
            <a-row :gutter="24"> 
                <a-col :span="8">
                    <a-form-item label="合同类型" v-bind="formItemLayout">
                        <a-select labelInValue v-decorator="['contractType', {rules: [{ required: true, message: ' ' }], initialValue: contractTypeOption[0] }]">
                        <a-select-option v-for="item in contractTypeOption" :value="item.key">{{item.label}}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="合同名称" v-bind="formItemLayout">
                        <a-input v-decorator="['contractName', {rules: [{ required: true, message: ' ' }]}]"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="合同编号" v-bind="formItemLayout">
                        <a-input v-decorator="['contractNum', {rules: [{ required: true, message: ' ' }]}]"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                <a-form-item label="生效日期" v-bind="formItemLayout">
                    <a-date-picker :format="dateFormat" v-decorator="['issueDate', {rules: [{ required: true, message: ' ' }]}]"></a-date-picker>
                </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="合同有效期至" v-bind="formItemLayout">
                        <a-radio-date v-decorator="['expireDate', {rules: [{ required: true, message: ' ' }], initialValue: { value: '0', date: '9999-12-31'}}]"></a-radio-date>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="备注" v-bind="formItemLayout">
                        <a-input v-decorator="['note', {rules: [{ required: true, message: ' ' }]}]"></a-input>
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
                <a-col :span="16">
                    <a-form-item class='rightBtn'>
                        <a-button type="primary" @click="contractDataAdd">新增</a-button>
                    </a-form-item>
                </a-col>
          </a-row>
          </a-form>
          <a-row style="marginTop:20px">
            <a-contract-table :contractOption="contractTypeOption" :loading="contractLoading"
            :employeeId="employeeId" :tabList="contractTableData" :ETag="etag" @loadData="loadContractData"></a-contract-table>
          </a-row>
        </a-row>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { SelectValue, BasicData, ContractTableData } from '@/interface';
import Component from 'vue-class-component';
import RadioDate from '@/components/RadioDate/index.vue';
import { getContractTypeOption } from '@/api/basic';
import ContractTable from '@/components/Step4/ContractTable.vue';
import moment from 'moment';
import { addEmployeeContactData, newEmployeeContactAttachment, getEmployeeContactData } from '@/api/staff';
import { message } from 'ant-design-vue';
import _ from 'lodash';
interface NewValueForm {
    contractType: {
        key: string;
        value: string;
    };
    contractName: string;
    contractNum: string;
    issueDate: any;
    expireDate: {
        date: string;
    };
    note: string;
}
@Component({
    components: {
        'a-radio-date': RadioDate,
        'a-contract-table': ContractTable,
    },
})
export default class Step4 extends Vue {
    private form: any;
    private $form: any;
    private $store: any;
    private employeeId: string = '';
    private contractLoading: boolean = false;
    private dateFormat: string = 'YYYY-MM-DD';
    private etag: string = '';
    private contractTableData: ContractTableData[] = [];
    private formItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 10}},
        wrapperCol: { xs: {span: 24}, sm: {span: 14}},
    };
    private fileList: any = [];
    private contractTypeOption: SelectValue[] = [];
    private created() {
        const { employeeId } = this.$store.state.step;
        this.employeeId = employeeId;
        this.form = this.$form.createForm(this);
        this.fetchContractTypeData();
    }
    private beforeUpload(file: any): boolean {
        this.fileList = [...this.fileList, file];
        return false;
    }
    private fetchContractTypeData() {
        getContractTypeOption().then((res) => {
            const data = res.data;
            this.contractTypeOption = this.transformSelectData(data);
            this.loadContractData();
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
    private handleRemove(file: any) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList;
    }
    private contractDataAdd() {
        this.form.validateFields((err: any, values: any) => {
            if (!err) {
                const param = this.transformValueData(values);
                if (moment(param.issueDate).isAfter(param.expireDate)) {
                    message.error('有效日期不能早于生效日期');
                    return;
                }
                addEmployeeContactData(this.employeeId, param).then((res: any) => {
                    const data = res.data;
                    const id = data.id;
                    if (this.fileList.length > 0) {
                        const formData = new FormData();
                        this.fileList.forEach((file: any) => {
                            formData.append('files[]', file);
                        });
                        newEmployeeContactAttachment(this.employeeId, id, formData).then(() => {
                            this.clearFormData();
                        }).catch(() => {
                            message.error('新增失败');
                        });
                    } else {
                        this.clearFormData();
                    }
                });
            }
        });
    }
    private loadContractData() {
        this.contractLoading = true;
        getEmployeeContactData(this.employeeId).then((res) => {
            const data = res.data;
            this.etag = res.headers.etag;
            const newData = _.map(data, (item) => {
                const targetType = _.find(this.contractTypeOption, {key: item.typeId});
                return {
                    key: item.id,
                    contractType: targetType ? targetType : { key: '', label: '' },
                    name: item.name,
                    contractNum: item.no,
                    note: item.note,
                    issueDate: moment(item.issueDate).format(this.dateFormat),
                    expireDate: moment(item.expireDate).format(this.dateFormat),
                    editable: false,
                };
            });
            this.contractTableData = newData;
            this.contractLoading = false;
        }).catch((err) => {
            this.contractLoading = false;
        })
    }
    private clearFormData() {
        this.form.resetFields();
        this.fileList = [];
        this.loadContractData();
    }
    private transformValueData(data: NewValueForm) {
        return {
            typeId: data.contractType.key,
            no: data.contractNum,
            name: data.contractName,
            note: data.note,
            issueDate:  moment(data.issueDate).format(this.dateFormat),
            expireDate: data.expireDate.date,
        };
    }
}
</script>
