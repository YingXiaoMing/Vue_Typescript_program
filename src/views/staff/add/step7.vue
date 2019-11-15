<template>
    <div>
        <a-row class='basicData'>
            <a-divider class='diliver_item'>银行账号</a-divider>
            <a-form :form="form">
              <a-row :gutter="24">
                <a-col :span="8">
                    <a-form-item label="文档名称" v-bind="formItemLayout">
                        <a-input v-decorator="['name', {rules: [{ required: true, message: ' ' }]}]"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="文档描述" v-bind="formItemLayout">
                        <a-input v-decorator="['description', {rules: [{ required: true, message: ' ' }]}]"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="附件上传" v-bind="formItemLayout">
                        <a-upload :fileList="fileList" :beforeUpload="beforeUpload" :remove="handleRemove">
                            <a-button>
                                <a-icon type="upload"></a-icon>
                                点击上传
                            </a-button>
                        </a-upload>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item class='rightBtn'>
                        <a-button type="primary" @click="documentDataAdd">新增</a-button>
                    </a-form-item>
                </a-col>
              </a-row>
            </a-form>
            <a-row style="marginTop: 20px">
                <a-document-table :loading="documentLoading" :employeeId="employeeId"
                :ETag="etag"  :tabList="documentTableData" @loadData="loadDocumentData"></a-document-table>
            </a-row>
            <a-row v-if="employeeStatus !== 3">
                <a-col v-bind="botttomLayout" style="marginTop: 20px">
                    <a-col v-bind="bottomLayoutBtn">
                        <a-button type="primary" @click="preStep">上一步</a-button>
                    </a-col>
                    <a-col v-bind="bottomLayoutBtn">
                        <a-button type="primary" @click="complete">完成</a-button>
                    </a-col>
                </a-col>
            </a-row>
        </a-row>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component, Emit } from 'vue-property-decorator';
import { DocumentTableData } from '@/interface';
import DocumentTable from '@/components/Step7/DocumentTable.vue';
import { getEmployeeID } from '@/utils/cookie';
import { addEmployeeRelatedDocumentData, newEmployeeRelatedDocumentAttachment, getEmployeeRelatedDocument } from '@/api/staff';
import _ from 'lodash';
import { message } from 'ant-design-vue';
interface NewValueForm {
    name: string;
    description: string;
}
@Component({
    components: {
        'a-document-table': DocumentTable,
    },
})
export default class Step7 extends Vue {
    private form: any;
    private $form: any;
    private $store: any;
    private employeeId: string = '';
    private etag: string = '';
    private documentLoading: boolean = false;
    private employeeStatus: number = 1;
    private documentTableData: DocumentTableData[] = [];
    private formItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 10}},
        wrapperCol: { xs: {span: 24}, sm: {span: 14}},
    };
    private botttomLayout = {
        lg: {span: 12, offset: 8},
        md: {span: 24, offset: 14},
        sm: {span: 24, offset: 14},
    };
    private bottomLayoutBtn = {
        lg: {span: 12},
        md: {span: 24},
        sm: {span: 24},
    };
    private fileList: any = [];
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
        this.form = this.$form.createForm(this);
        this.loadDocumentData();
    }
    private beforeUpload(file: any): boolean {
        this.fileList = [...this.fileList, file];
        return false;
    }
    private documentDataAdd() {
        this.form.validateFields((err: any, values: any) => {
            if (!err) {
                const param = this.transformValueData(values);
                addEmployeeRelatedDocumentData(this.employeeId, param).then((res: any) => {
                    const data = res.data;
                    const id = data.id;
                    if (this.fileList.length > 0) {
                        const formData = new FormData();
                        this.fileList.forEach((file: any) => {
                            formData.append('files[]', file);
                        });
                        newEmployeeRelatedDocumentAttachment(this.employeeId, id, formData).then(() => {
                            this.form.resetFields();
                            this.fileList = [];
                            this.clearFormData();
                        }).catch(() => {
                            message.error('新增失败');
                        });
                    } else {
                        this.clearFormData();
                    }
                });
            } else {
                message.error('关联文档请填写完整');
            }
        });
    }
    private clearFormData() {
        this.form.resetFields();
        this.fileList = [];
        this.loadDocumentData();
    }
    private loadDocumentData() {
        this.documentLoading = true;
        getEmployeeRelatedDocument(this.employeeId).then((res: any) => {
            const data = res.data;
            this.etag = res.headers.etag;
            const newData = _.map(data, (item) => {
                return {
                    name: item.name,
                    key: item.id,
                    description: item.description,
                    editable: false,
                    disable: false,
                };
            });
            this.documentTableData = newData;
            this.documentLoading = false;
        }).catch((err) => {
            this.documentLoading = false;
        });
    }
    private handleRemove(file: any) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList;
    }
    private transformValueData(data: NewValueForm) {
        return {
            name: data.name,
            description: data.description,
        };
    }
    private preStep() {
        this.$emit('preStep');
    }
    private complete() {
        this.$emit('nextStep');
    }
}
</script>

