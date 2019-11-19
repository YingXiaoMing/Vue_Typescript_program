<template>
    <a-modal :visible="isVisible" title="导出选项" :width="628" 
    @cancel="cancelHandle" class="basicData" @ok="okHandle">
        <a-form :form="form">
            <a-row>
                <a-col :span="6" v-for="item in BasicData">
                    <a-form-item v-bind="formItemLayout">
                        <a-checkbox :disabled="item.isSelect" v-decorator="[item.name, {valuePropName:'checked',initialValue: item.isSelect}]">{{item.title}}</a-checkbox>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="6" v-for="item in data">
                    <a-form-item v-bind="formItemLayout">
                        <a-checkbox v-decorator="[item.name, {valuePropName:'checked',initialValue: item.isSelect}]">{{item.title}}</a-checkbox>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
interface FilterSort {
    name: string;
    title: string;
    isSelect: boolean;
}
@Component({
    components: {},
})
export default class DetailModal extends Vue {
    @Prop({ default: false}) private visible!: boolean;
    @Prop({ default: []}) private propsData!: FilterSort[];
    private data: FilterSort[] = this.propsData;
    private isVisible: boolean = this.visible;
    private BasicData: FilterSort[] = [{
        name: 'IsExportEmployeeStringID',
        title: '员工工号',
        isSelect: true,
    }, {
        name: 'IsExportEmployeeFullName',
        title: '员工姓名',
        isSelect: true,
    }];
    private form: any;
    private $form: any;
    private formItemLayout = {
        labelCol: { span: 0 },
        wrapperCol: { span: 24 },
    };
    private created() {
        this.form = this.$form.createForm(this);

    }
    @Watch('visible')
    private visibleChange(value: any) {
        this.isVisible = value;
    }
    @Watch('propsData')
    private PropsDataChange(value: any) {
        this.data = value;
    }
    private cancelHandle() {
        this.isVisible = false;
        this.$emit('cancel');
    }
    private okHandle() {
        this.form.validateFields((err: any, values: any) => {
            this.$emit('ok', values);
            this.form.resetFields();
        });
    }
}
</script>
