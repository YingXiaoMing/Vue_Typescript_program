<template>
    <div class='wrapper'>
        <div class='staff-head'>
            <a-row :gutter="24" >
                    <!-- <a-row>
                        <a-col :xxl="12" :md="20" :sm="24">
                            <a-form-item label="导出选项" v-bind="formItemLayout">
                                <a-checkbox-group>
                                    <a-row>
                                        <a-col :span="6"><a-checkbox value="1">基本信息</a-checkbox></a-col>
                                        <a-col :span="6"><a-checkbox value="2">身份证件信息</a-checkbox></a-checkbox></a-col>
                                        <a-col :span="6"><a-checkbox value="3">联系电话</a-checkbox></a-col>
                                        <a-col :span="6"><a-checkbox value="4">联系地址</a-checkbox></a-col>
                                        <a-col :span="6"><a-checkbox value="5">紧急联系人资料</a-checkbox></a-col>
                                        <a-col :span="6"><a-checkbox value="6">职位信息</a-checkbox></a-col>
                                        <a-col :span="6"><a-checkbox value="7">教育经历</a-checkbox></a-col>
                                        <a-col :span="6"><a-checkbox value="8">工作经历</a-checkbox></a-col>
                                        <a-col :span="6"><a-checkbox value="9">证件资料</a-checkbox></a-col>
                                        <a-col :span="6"><a-checkbox value="10">个人合同</a-checkbox></a-col>
                                        <a-col :span="6"><a-checkbox value="11">银行账号</a-checkbox></a-col>
                                        <a-col :span="6"><a-checkbox value="12">电脑登录账号</a-checkbox></a-col>
                                        <a-col :span="6"><a-checkbox value="13">企业邮箱</a-checkbox></a-col>
                                        <a-col :span="6"><a-checkbox value="14">企业钉钉</a-checkbox></a-col>
                                        <a-col :span="6"><a-checkbox value="15">关联文档</a-checkbox></a-col>
                                    </a-row>
                                </a-checkbox-group>
                            </a-form-item>
                        </a-col>
                    </a-row> -->
                    <a-row>
                        <a-divider orientation="left">
                            基础资料导入
                        </a-divider>
                        <a-col :xxl="12" :md="20" :sm="24" class="export_de">
                            <a-button @click="exportBasicData">导入基础资料</a-button>
                        </a-col>
                    </a-row>
            </a-row>
            <a-export-modal :visible="basciDataModalVisible"></a-export-modal>
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
    private basciDataModalVisible: boolean = false;

    private created() {
        console.log('这是一个测数据');
    }
    private exportBasicData() {
        console.log('你何必这么烦，你何必那么乱');
        this.basciDataModalVisible = true;
    }
}
</script>
<style lang="less">
.export_de {
    padding: 10px 10px;
}
</style>

