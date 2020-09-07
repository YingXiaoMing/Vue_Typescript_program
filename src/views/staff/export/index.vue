<template>
    <div class='wrapper'>
        <div class='staff-head'>
            <a-row :gutter="24" >
                <a-col :span="24">
                    <a-divider orientation="left">
                        基础资料导入
                    </a-divider>
                    <a-col :xxl="12" :md="20" :sm="24" class="export_de">
                        <a-button @click="exportBasicData">导入基础资料</a-button>
                    </a-col>
                </a-col>
                <a-col :span="24">
                    <a-divider orientation="left">
                        奖惩记录导入
                    </a-divider>
                    <a-col :xxl="12" :md="20" :sm="24" class="export_de">
                        <a-button @click="exportPrizePenaltyData">导入奖惩记录</a-button>  
                    </a-col>
                </a-col>
                <a-col :span="24">
                    <a-divider orientation="left">
                        请假出差记录导入
                    </a-divider>
                    <a-col :xxl="12" :md="20" :sm="24" class="export_de">
                        <a-button @click="exportBussinessData">导入请假出差记录</a-button>
                    </a-col>
                </a-col>
                <a-col :span="24">
                    <a-divider orientation="left">
                        员工信息导入
                    </a-divider>
                    <a-col :xxl="12" :md="20" :sm="24" class="export_de">
                        <a-button @click="exportInfoData">导入员工信息</a-button>
                    </a-col>
                </a-col>
            </a-row>
            <a-export-modal :visible="modalVisible" @cancel="cancelHandle" :mUrl="exportURL" :title="modalTitle"></a-export-modal>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import ExportModal from '@/components/UploadModal/index.vue';
@Component({
    components: {
        'a-export-modal': ExportModal,
    },
    name: 'staffExport',
})
export default class StaffExport extends Vue {
    private modalVisible: boolean = false;
    private modalTitle: string = '';
    private exportURL: string = '';
    private exportBasicData() {
        this.exportURL = '/ImportData/ImportBaseData';
        this.modalTitle = '基础资料';
        this.modalVisible = true;
    }
    private exportPrizePenaltyData() {
        this.exportURL = '/ImportData/ImportPrizePenaltyData';
        this.modalTitle = '奖惩记录';
        this.modalVisible = true;
    }
    private exportBussinessData() {
        this.exportURL = '/ImportData/ImportAskforLeaveOvertimeBusinesstripRecord';
        this.modalTitle = '请假出差记录';
        this.modalVisible = true;
    }
    private exportInfoData() {
        this.exportURL = '/ImportData/ImportEmployeeInfo';
        this.modalTitle = '员工信息';
        this.modalVisible = true;
    }
    private cancelHandle() {
        this.modalVisible = false;
    }
}
</script>
<style lang="less">
.export_de {
    padding: 10px 10px;
}
</style>

