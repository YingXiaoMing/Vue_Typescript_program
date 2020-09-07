<template>
    <a-modal :visible="isVisible" :title="mdoalTitle" :width="628" 
    @cancel="cancelHandle" class="basicData" @ok="okHandle">
             <a-row :gutter="24">
                <a-col :span="24" style="marginBottom: 10px">
                    <div class="right">
                        <a-button @click="downloadModal">下载模板</a-button>
                    </div>
                </a-col>
                <a-col :span="24">
                        <a-upload-dragger name="file" :multiple="false" :action="BaseUrl + mUrl"
                    @change="handleChange" :file-list="fileList">
                        <p class="ant-upload-drag-icon">
                            <a-icon type="inbox"></a-icon>
                        </p>
                        <p class="ant-upload-text">点击或者拖拽文件到此区域上传</p>
                    </a-upload-dragger>
                </a-col>
            </a-row>
    </a-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { message } from 'ant-design-vue';
import config from '@/utils/config';
@Component({
    components: {},
})
export default class UploadModal extends Vue {
    @Prop({ default: false}) private visible!: boolean;
    @Prop({ default:  ''}) private mUrl!: string;
    @Prop({ default:  ''}) private title!: string;
    private isVisible: boolean = this.visible;
    private BaseUrl: string = config.baseUrl;
    private mdoalTitle: string = '';
    private fileList: any[] = [];
    private form: any;
    private $form: any;
    private formItemLayout = {
        labelCol: { span: 0 },
        wrapperCol: { span: 24 },
    };
    @Watch('visible')
    private visibleChange(value: any) {
        this.isVisible = value;
        this.mdoalTitle = '导入' + this.title + '模板';
    }
    private created() {
        this.form = this.$form.createForm(this);
    }
    private cancelHandle() {
        this.isVisible = false;
        this.fileList = [];
        this.$emit('cancel');
    }
    private okHandle() {
        this.isVisible = false;
        this.fileList = [];
        this.$emit('cancel');
    }
    private handleChange(info: any) {
        const status = info.file.status;
        const { fileList } = info;
        if (status === 'done') {
            message.success('上传成功');
        }
        this.fileList = [... fileList];
    }
    private downloadModal() {
        let downLink;
        downLink = config.baseUrl + this.mUrl;
        const link = document.createElement('a');
        link.href = downLink;
        link.click();
    }
}
</script>
