<template>
    <a-modal :visible="isVisible"
    @cancel="cancelHandle" :width="728" title="附件上传" :footer="null">
        <a-row>
            <a-form layout='inline' class='attach_form'>
                <a-form-item label='文件描述'>
                    <a-input v-model='fileDescription'></a-input>
                </a-form-item>
                <a-form-item>
                    <a-upload :fileList="fileList"
                    :beforeUpload="beforeUpload"
                    :remove="handleRemove">
                        <a-button v-if='showUploadBtn'><a-icon type='upload'></a-icon>选择文件</a-button>
                    </a-upload>
                </a-form-item>
                <a-form-item>
                    <a-button type='primary' @click='handleSubmit'>新增</a-button>
                </a-form-item>
            </a-form>
        </a-row>
        <a-row style='marginTop: 30px'>
            <attachment-table :dataList="attachmentList" :employeeId="employeeId" 
            :employeePropertyId="employeePropertyId" ref="attach_child" :pathName="pathName" :keyName="keyName"/>
        </a-row>
    </a-modal>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import AttachmentTable from './AttachmentTable.vue';
import { Modal, Form, Input, Upload, Row, Button, Icon, message } from 'ant-design-vue';
import { newEmployeeAttachment, getEmployeeAttachmentDescriptionById } from '@/api/staff';
import { AttachmentData } from '@/interface';
@Component({
    components: {
        'a-modal': Modal,
        'a-form': Form,
        'a-form-item': Form.Item,
        'a-input': Input,
        'a-upload': Upload,
        'a-row': Row,
        'a-button': Button,
        'a-icon': Icon,
        'attachment-table': AttachmentTable,
    },
})
export default class Attach extends Vue {
    public $refs!: {
        attach_child: HTMLFormElement,
    };
    @Prop({ default: '' }) private employeeId!: string;
    @Prop({ default: false}) private visible!: boolean;
    @Prop({ default: []}) private attachmentList!: AttachmentData[];
    @Prop({ default: '' }) private employeePropertyId!: string;
    @Prop({ default: '' }) private pathName!: string;
    @Prop({ default: ''}) private keyName!: string;
    private fileDescription: string = '';
    private fileList: any = [];
    private showUploadBtn: boolean = true;
    private isVisible: boolean = this.visible;
    @Watch('fileList')
    private changeValue(fileList: any) {
        const isShow = fileList.length > 0 ? false : true;
        this.showUploadBtn = isShow;
    }
    @Watch('visible')
    private visibleChange(value: any) {
        this.isVisible = value;
    }
    private handleSubmit() {
        if (this.fileList.length > 0) {
            const formData = new FormData();
            formData.append('files[]', this.fileList[0]);
            newEmployeeAttachment(this.employeeId, this.employeePropertyId, this.pathName, formData).then((res: any) => {
                const patch = [
                    { op: 'replace', path: '/description', value: this.fileDescription },
                ];
                this.updateFileDescription(this.employeeId, this.employeePropertyId, res[0].id, patch);
            }).catch((err) => {
                message.error('新增失败');
            });
        } else {
            message.error('请上传文件！');
        }
    }
    private updateFileDescription(employeeId: string, employeePropertyId: string, key: string, diff: any) {
        getEmployeeAttachmentDescriptionById(employeeId, employeePropertyId, key, this.pathName,  diff).then(() => {
            this.fileList = [];
            this.fileDescription = '';
            this.$refs.attach_child.loadData();
        }).catch(() => {
            message.error('新增失败');
        });
    }
    private cancelHandle() {
        this.fileList = [];
        this.fileDescription = '';
        this.isVisible = false;
        this.$emit('cancel');
    }
    private beforeUpload(file: any) {
        if (this.fileList.length > 0) {
            this.fileList.splice(0, 1, file);
        } else {
            this.fileList = [...this.fileList, file];
        }
        return false;
    }
    private handleRemove(file: any) {
        const newFileList = this.fileList.slice();
        newFileList.splice(0, 1);
        this.fileList = newFileList;
    }

}
</script>

