<template>
    <a-modal :visible="isVisible" title="奖惩记录" @cancel="cancelHandle" :width="828"
    class='rewardModal' @ok="confirmHandle">
        <a-form :form="form">
        <a-row>
            <a-col :span="12">
                <a-form-item label="工单号" v-bind="formItemLayout">
                    <a-input disabled v-decorator="['workOrderNumber', {initialValue: formModal.workOrderNumber}]"></a-input>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="12">
                <a-form-item label="员工工号" v-bind="formItemLayout">
                    <a-input disabled v-decorator="['num', {initialValue: formModal.num}]"></a-input>
                </a-form-item>
            </a-col>
            <a-col :span="12">
                <a-form-item label="员工姓名" v-bind="formItemLayout">
                    <a-input disabled v-decorator="['name', {initialValue: formModal.name}]"></a-input>
                </a-form-item>
            </a-col>
            <a-col :span="12">
                <a-form-item label="奖励类型" v-bind="formItemLayout" v-if="formModal.type === 1">
                    <a-select v-if="formModal.isEdit" labelInValue v-decorator="['prizePenaltyTypeId',{initialValue: formModal.prizePenaltyTypeId,rules: [{ required: true, message: ' ' }]}]">
                      <a-select-option v-for="item in RewardType" :value="item.key">{{item.label}}</a-select-option>
                    </a-select>
                    <a-input v-else disabled v-decorator="['typeName', {initialValue: formModal.prizePenaltyTypeId.label}]"></a-input>
                </a-form-item>
                <a-form-item  label="惩罚类型" v-bind="formItemLayout" v-else>
                    <a-select v-if="formModal.isEdit" labelInValue v-decorator="['prizePenaltyTypeId',{initialValue: formModal.prizePenaltyTypeId,rules: [{ required: true, message: ' ' }]}]">
                      <a-select-option v-for="item in PenaltyType" :value="item.key">{{item.label}}</a-select-option>
                    </a-select>
                    <a-input v-else disabled v-decorator="['typeName', {initialValue: formModal.prizePenaltyTypeId.label}]"></a-input>
                </a-form-item>
            </a-col>
            <a-col :span="12">
                <a-form-item  label="执行日期" v-bind="formItemLayout">
                    <a-date-picker v-if="formModal.isEdit" :format="dateForm" v-decorator="['effectiveDate',{initialValue: momentDate(formModal.effectiveDate) ,rules: [{ required: true, message: ' ' }]}]"></a-date-picker>
                    <a-input v-else disabled v-decorator="['effectiveDate', {initialValue: formModal.effectiveDate}]"></a-input>
                </a-form-item>
                
            </a-col>
        </a-row>
        <a-divider>具体情况</a-divider>
        <a-row :gutter="24">
            <a-col :span="24">
                <a-form-item label="情况描述" v-bind="formItemLayout2">
                    <a-textarea :disabled="!formModal.isEdit" rows="4" v-decorator="['situationDescription', {initialValue: formModal.situationDescription}]"></a-textarea>
                </a-form-item>
            </a-col>
            <a-col :span="24" style="marginTop:20px">
                <a-form-item label="处理方式" v-bind="formItemLayout2">
                    <a-textarea :disabled="!formModal.isEdit" rows="4" v-decorator="['solution', {initialValue: formModal.solution}]"></a-textarea>
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
import { Modal, Row, Col, Input, Form, DatePicker, Divider, Select } from 'ant-design-vue';
import './index.less';
import _ from 'lodash';
import { getPrizePenaltyTypePrize, getPrizePenaltyTypePenalty } from '@/api/basic';
import moment from 'moment';
import { SelectValue, BasicData } from '@/interface';
import jsonpatch from 'fast-json-patch';
import { editPrizePenaltyRecord } from '@/api/operation';
interface FormData {
    solution: string;
    situationDescription: string;
    effectiveDate: string;
    name: string;
    num: string;
    prizePenaltyTypeId: {
        key: string;
        label: string;
    };
    id?: string;
    employeeId?: string;
    type?: number;
    isEdit: boolean;
}

@Component({
    components: {
        'a-modal': Modal,
        'a-row': Row,
        'a-col': Col,
        'a-input': Input,
        'a-form': Form,
        'a-form-item': Form.Item,
        'a-date-picker': DatePicker,
        'a-textarea': Input.TextArea,
        'a-divider': Divider,
        'a-select': Select,
        'a-select-option': Select.Option,
    },
})
export default class RewardModal extends Vue {
    @Prop({ default: false}) private visible!: boolean;
    @Prop({default: ''}) private ETag!: string;
    @Prop({ default: () => ({num: '', name: '', solution: '', deal: '', type: ''}) }) private formData!: FormData;
    private dateForm: string = 'YYYY/MM/DD';
    private formModal: FormData = this.formData;
    private storeModal: any;
    private formItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 6}},
        wrapperCol: { xs: {span: 24}, sm: {span: 16}},
    };
    private formItemLayout2 = {
        labelCol: { xs: {span: 24}, sm: {span: 3} },
        wrapperCol: { xs: {span: 24}, sm: {span: 21}},
    };
    private isVisible: boolean = this.visible;
    private RewardType: SelectValue[] = [];
    private PenaltyType: SelectValue[] = [];
    private form: any;
    private $form: any;
    @Watch('visible')
    private visibleChange(value: any) {
        this.isVisible = value;
    }
    @Watch('formData')
    private formDataChange(value: FormData) {
        this.formModal = value;
    }
    private cancelHandle() {
        this.isVisible = false;
        this.form.resetFields();
        this.$emit('cancel');
    }
    private created() {
        this.form = this.$form.createForm(this);
        getPrizePenaltyTypePrize().then((res: any) => {
            const data = res.data;
            this.RewardType = this.transformSelectData(data);
        });
        getPrizePenaltyTypePenalty().then((res: any) => {
            const data = res.data;
            this.PenaltyType = this.transformSelectData(data);
        });
    }
    private momentDate(date: string) {
        return moment(date, this.dateForm);
    }
    private transformSelectData(data: any) {
        return _.map(data, (item: BasicData) => {
            return {
                key: item.id,
                label: item.name,
            };
        });
    }
    private confirmHandle() {
        if (this.formModal.isEdit) {
            this.form.validateFields((err: any, values: FormData) => {
                if (!err) {
                    const employeeId = this.formModal.employeeId;
                    const id = this.formModal.id;
                    const oldValue = this.transformCompareData(this.formModal);
                    const newValue = this.transformCompareData(values);
                    const puma = this.compareNewAndOldValue(newValue, oldValue);
                    if (employeeId && id && puma.length > 0) {
                        editPrizePenaltyRecord(employeeId, id, puma, {
                            'If-Match': this.ETag,
                        }).then((res) => {
                            this.form.resetFields();
                            this.$emit('refreshTableData');
                        });
                    } else {
                        this.form.resetFields();
                        this.$emit('refreshTableData');
                    }
                }
            });
        } else {
            this.$emit('refreshTableData');
        }
    }
    private transformCompareData(oldValue: FormData) {
        return {
            solution: oldValue.solution,
            situationDescription: oldValue.situationDescription,
            effectiveDate: moment(oldValue.effectiveDate).format(this.dateForm),
            prizePenaltyTypeId: oldValue.prizePenaltyTypeId.key,
        };
    }
    private compareNewAndOldValue(newValue: any, oldValue: any) {
        const diff = jsonpatch.compare(oldValue, newValue);
        return diff;
    }
}
</script>

