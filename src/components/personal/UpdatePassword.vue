<template>
    <a-modal :visible="isVisible" title="修改密码" :keyboard="false"
    :maskClosable="false" :closable="false" @cancel="cancelHandle">
        <a-form :form="form">
            <a-form-item label="旧密码" v-bind="formItemLayout">
                <a-input type="password" autocomplete="false"
                placeholder="请输入旧密码" 
                v-decorator="['oldPassword', {rules: [{ required: true, message: '请输入旧密码' }]}]"></a-input>
            </a-form-item>
            <a-form-item label="新密码" v-bind="formItemLayout"
            >
                <a-input type="password" autocomplete="false"
                placeholder="至少6位密码，区分大小写" v-decorator="['password', {rules: [{ required: true, message: '至少6位密码，区分大小写' },{ validator: handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"></a-input>
            </a-form-item>
            <a-form-item label="再次确认" v-bind="formItemLayout">
                <a-input type="password" autocomplete="false"
                placeholder="确认密码" v-decorator="['passwords', { rules: [{required: true, message: '至少6位密码，区分大小写'}, {
                    validator: handlePasswordCheck
                }], validateTrigger: ['change', 'blur']}]"></a-input>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { Modal, Row, Col, Form, Input, AutoComplete } from 'ant-design-vue';
@Component({
    components: {
        'a-modal': Modal,
        'a-form': Form,
        'a-form-item': Form.Item,
        'a-input': Input,
    },
})

export default class UpdatePassword extends Vue {
    @Prop({ default: false}) private visible!: boolean;
    private isVisible: boolean = this.visible;
    private form: any;
    private $form: any;
    private formItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 4}},
        wrapperCol: { xs: {span: 24}, sm: {span: 20}},
    };
    @Watch('visible')
    private visibleChange(value: any) {
        this.isVisible = value;
    }
    private created() {
        this.form = this.$form.createForm(this);
    }
    private cancelHandle() {
        this.isVisible = false;
        this.form.resetFields();
        this.$emit('cancel');
    }
    private handlePasswordLevel(rule: any, value: string, callback: any) {
        if (/[0-9]/.test(value) && /[a-zA-Z]/.test(value) && /[^0-9a-zA-Z_]/.test(value)) {
            callback();
        } else {
            callback(new Error('密码强度不够'));
        }
    }
    private handlePasswordCheck(rule: any, value: string, callback: any) {
        const password = this.form.getFieldValue('password');
        if (value === undefined) {
            callback(new Error('请输入密码'));
        }
        if (value && password && value.trim() !== password.trim()) {
            callback(new Error('两次密码不一致'));
        }
        callback();
    }
}
</script>

