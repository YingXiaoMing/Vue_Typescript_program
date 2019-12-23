<template>
    <div class='wrapper'>
        <div class='staff-head'>
            <a-row :gutter="24">
                <a-form :form="form">
                    <a-row>
                        <a-col :xxl="10" :md="20" :sm="24">
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
                    </a-row>
                    <a-row>
                        <a-col :xxl="10" :md="20" :sm="24">
                            <a-form-item label="导入文件上传" v-bind="formItemLayout">
                                <a-button type="primary" icon="download">上传Excel</a-button>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    
                </a-form>
            </a-row>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
@Component({
    components: {},
    name: 'staffExport',
})
export default class StaffExport extends Vue {
    private form: any;
    private $form: any;
    private formItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 6}},
        wrapperCol: { xs: {span: 24}, sm: {span: 18}},
    };
    private created() {
        this.form = this.$form.createForm(this, {});
        console.log('精算师');
    }
}
</script>
