<template>
    <a-modal :visible="isVisible" title="导入基础资料" :width="628">
        <a-row :gutter="24">
            <a-col :span="24" style="marginBottom: 10px">
                <div class="right">
                    <a-button @click="exportBasicData">初始化基础资料导入模板</a-button>
                </div>
            </a-col>
        </a-row>
    </a-modal>
</template>
<script lang="ts">
import Vue from 'vue';
import { Emit, Prop, Watch } from 'vue-property-decorator';
export default class UploadModal extends Vue {
    @Prop({ default: false}) private visible!: boolean;
    private isVisible: boolean = this.visible;
    @Watch('visible')
    private visibleChange(value: any) {
        this.isVisible = value;
    }
    private exportBasicData() {
        console.log('下载新的数据');
    }
}
</script>

