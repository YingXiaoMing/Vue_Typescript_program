<template>
    <div>
        <a-form :form="form">
            <a-row>
                <a-col :span="18">
                    <a-form-item label="选择类型" v-bind="formItemLayout">
                        <a-select labelInValue v-decorator="['type', {initialValue: data}]"
                        >
                          <a-select-option v-for="item in someTypeOption" :value="item.key">{{item.label}}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item>
                        <a-button type="primary" @click="submitData">点击提交</a-button>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { SelectValues } from '@/interface';
@Component({
    name: 'test',
    components: {},
})
export default class Test extends Vue {
    private form: any;
    private $form: any;
    private someTypeOption = [
        {label: '测试1', key: '1'},
        {label: '测试2', key: '2'},
        {label: '测试3', key: '3'},
    ];
    private data = {
        label: '测试4',
        key: '4',
    };
    private formItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 6}},
        wrapperCol: { xs: {span: 24}, sm: {span: 18}},
    };
    private created() {
        this.form = this.$form.createForm(this);
    }
    private submitData() {
        this.form.validateFields((err: any, values: any) => {
            if (!err) {
                console.log(values);
            }
        });
    }
}
</script>

