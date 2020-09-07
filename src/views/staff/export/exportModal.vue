<template>
    <a-modal :visible="isVisible" title="导入模板" :width="628"
    @cancel="cancelHandle" @ok="cancelHandle">
        <a-row :gutter="24">
            <a-col :span="24">
                <div class="right" >
                    <a-button>下载模板</a-button>
                </div>
            </a-col>
            <a-col :span="24">
                <a-upload-dragger name="file">
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
import { Emit, Prop, Watch } from 'vue-property-decorator';
export default class ExportModal extends Vue {
    @Prop({ default: false}) private visible!: boolean;
    private isVisible: boolean = this.visible;
    @Watch('visible')
    private visibleChange(value: any) {
        this.isVisible = value;
    }
    private cancelHandle() {
        this.isVisible = false;
        this.$emit('cancel');
    }
}
</script>

